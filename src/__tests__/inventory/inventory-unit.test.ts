import {
    validateBorrowRequest,
    calculateLiabilityAmount,
    canAccessAdminInventory,
    canAccessMemberInventory,
} from "../../lib/inventory/validation";
import type { InventoryItem } from "../../types/inventory";

const mockItem: InventoryItem = {
    id: "item-123",
    name: "Arduino Mega 2560",
    description: "Microcontroller board",
    category: "Microcontrollers",
    total_quantity: 5,
    available_quantity: 3,
    condition: "Good",
    price_equivalent: 1800,
    handling_instructions: "Handle with ESD precautions",
    max_borrow_days: 7,
    max_quantity_per_request: 2,
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

function runTest(testName: string, fn: () => void) {
    try {
        fn();
        console.log(`[PASS] ${testName}`);
    } catch (err) {
        console.error(`[FAIL] ${testName}:`, (err as Error).message);
        throw err;
    }
}

function assert(condition: boolean, message: string) {
    if (!condition) {
        throw new Error(message);
    }
}

export function runInventoryUnitTests() {
    console.log("--- Starting Inventory Unit Tests ---");

    // 1. Stock Bounds
    runTest("test_borrow_quantity_capped_by_item_limit", () => {
        const today = new Date();
        const returnDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
        const result = validateBorrowRequest(mockItem, {
            quantity: 3, // exceeds max_quantity_per_request = 2
            startDate: today,
            expectedReturnDate: returnDate,
            liabilityAgreed: true,
            signature: "Manav Kohli",
        });
        assert(!result.valid, "Should fail when requested qty exceeds per-request limit");
        assert(
            result.error?.includes("exceeds per-member limit") === true,
            "Error message should mention per-member limit"
        );
    });

    runTest("test_borrow_quantity_capped_by_available_stock", () => {
        const itemLowStock: InventoryItem = {
            ...mockItem,
            available_quantity: 1,
            max_quantity_per_request: 5,
        };
        const today = new Date();
        const returnDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
        const result = validateBorrowRequest(itemLowStock, {
            quantity: 2, // exceeds available_quantity = 1
            startDate: today,
            expectedReturnDate: returnDate,
            liabilityAgreed: true,
            signature: "Manav Kohli",
        });
        assert(!result.valid, "Should fail when requested qty exceeds available stock");
        assert(
            result.error?.includes("exceeds available stock") === true,
            "Error message should mention available stock"
        );
    });

    runTest("test_zero_available_stock_blocks_request", () => {
        const outOfStockItem: InventoryItem = {
            ...mockItem,
            available_quantity: 0,
        };
        const today = new Date();
        const returnDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
        const result = validateBorrowRequest(outOfStockItem, {
            quantity: 1,
            startDate: today,
            expectedReturnDate: returnDate,
            liabilityAgreed: true,
            signature: "Manav Kohli",
        });
        assert(!result.valid, "Should fail when available quantity is 0");
        assert(result.error === "Item is currently out of stock.", "Expected out of stock error");
    });

    // 2. Date Bounds
    runTest("test_return_date_exceeding_max_borrow_days_rejected", () => {
        const today = new Date();
        const returnDate = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000); // 8 days > 7 max_borrow_days
        const result = validateBorrowRequest(mockItem, {
            quantity: 1,
            startDate: today,
            expectedReturnDate: returnDate,
            liabilityAgreed: true,
            signature: "Manav Kohli",
        });
        assert(!result.valid, "Should fail when return date exceeds max_borrow_days");
        assert(
            result.error?.includes("exceeds maximum allowed duration") === true,
            "Error message should mention duration"
        );
    });

    runTest("test_return_date_in_past_rejected", () => {
        const today = new Date();
        const pastDate = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
        const result = validateBorrowRequest(mockItem, {
            quantity: 1,
            startDate: today,
            expectedReturnDate: pastDate,
            liabilityAgreed: true,
            signature: "Manav Kohli",
        });
        assert(!result.valid, "Should fail when return date is before start date");
    });

    // 3. Liability & Consent
    runTest("test_consent_requires_explicit_checkbox", () => {
        const today = new Date();
        const returnDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
        const result = validateBorrowRequest(mockItem, {
            quantity: 1,
            startDate: today,
            expectedReturnDate: returnDate,
            liabilityAgreed: false, // unchecked
            signature: "Manav Kohli",
        });
        assert(!result.valid, "Should fail when liability checkbox is unchecked");
        assert(
            result.error?.includes("explicitly agree") === true,
            "Error message should mention agreement"
        );
    });

    runTest("test_consent_requires_signature_text", () => {
        const today = new Date();
        const returnDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
        const result = validateBorrowRequest(mockItem, {
            quantity: 1,
            startDate: today,
            expectedReturnDate: returnDate,
            liabilityAgreed: true,
            signature: "  ", // blank signature
        });
        assert(!result.valid, "Should fail when signature is empty or blank");
    });

    runTest("test_price_equivalent_liability_calculation", () => {
        const liabilitySingle = calculateLiabilityAmount(1800, 1);
        assert(liabilitySingle === 1800, "1 unit liability should be 1800");

        const liabilityMultiple = calculateLiabilityAmount(1800, 2);
        assert(liabilityMultiple === 3600, "2 unit liability should be 3600");
    });

    // 4. RBAC Gates
    runTest("test_unauthenticated_user_denied_access", () => {
        assert(canAccessMemberInventory(false) === false, "Unauthenticated user denied member inventory");
    });

    runTest("test_member_role_can_access_catalog_only", () => {
        assert(canAccessMemberInventory(true) === true, "Logged in user can access member inventory");
        assert(canAccessAdminInventory("member") === false, "Regular member cannot access admin inventory");
    });

    runTest("test_panel_role_can_access_admin_inventory", () => {
        assert(canAccessAdminInventory("panel-1") === true, "panel-1 slug can access admin inventory");
        assert(canAccessAdminInventory("recruitment-panel") === true, "recruitment-panel slug can access admin inventory");
    });

    runTest("test_admin_role_can_access_both_views", () => {
        assert(canAccessAdminInventory("admin") === true, "admin can access admin inventory");
        assert(canAccessMemberInventory(true) === true, "admin can access member catalog");
    });

    console.log("--- All 11 Unit Tests Passed Successfully ---");
}

// Auto-run if executed directly via node
if (typeof require !== "undefined" && require.main === module) {
    runInventoryUnitTests();
}
