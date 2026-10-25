import type { BorrowRequestInput, InventoryItem } from "../types/inventory";

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validates borrow request bounds before submission
 */
export function validateBorrowRequest(
    item: Pick<InventoryItem, "available_quantity" | "max_quantity_per_request" | "max_borrow_days">,
    input: {
        quantity: number;
        startDate: Date;
        expectedReturnDate: Date;
        liabilityAgreed: boolean;
        signature: string;
    }
): ValidationResult {
    // 1. Stock check
    if (item.available_quantity <= 0) {
        return { valid: false, error: "Item is currently out of stock." };
    }

    // 2. Quantity checks
    if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
        return { valid: false, error: "Quantity must be a positive whole number." };
    }

    if (input.quantity > item.available_quantity) {
        return {
            valid: false,
            error: `Requested quantity (${input.quantity}) exceeds available stock (${item.available_quantity}).`,
        };
    }

    const perRequestLimit = item.max_quantity_per_request || 1;
    if (input.quantity > perRequestLimit) {
        return {
            valid: false,
            error: `Requested quantity (${input.quantity}) exceeds per-member limit (${perRequestLimit}).`,
        };
    }

    // 3. Date checks
    const startTime = new Date(input.startDate.getFullYear(), input.startDate.getMonth(), input.startDate.getDate()).getTime();
    const returnTime = new Date(input.expectedReturnDate.getFullYear(), input.expectedReturnDate.getMonth(), input.expectedReturnDate.getDate()).getTime();

    if (returnTime < startTime) {
        return { valid: false, error: "Return date cannot be earlier than start date." };
    }

    const diffDays = Math.ceil((returnTime - startTime) / (1000 * 60 * 60 * 24));
    if (diffDays > item.max_borrow_days) {
        return {
            valid: false,
            error: `Borrowing period (${diffDays} days) exceeds maximum allowed duration (${item.max_borrow_days} days).`,
        };
    }

    // 4. Consent and signature
    if (!input.liabilityAgreed) {
        return { valid: false, error: "You must explicitly agree to the liability terms." };
    }

    if (!input.signature || input.signature.trim().length < 3) {
        return { valid: false, error: "A valid digital signature (name or SID) is required." };
    }

    return { valid: true };
}

/**
 * Calculates total liability valuation
 */
export function calculateLiabilityAmount(priceEquivalent: number, quantity: number): number {
    if (priceEquivalent < 0 || quantity <= 0) return 0;
    return Number((priceEquivalent * quantity).toFixed(2));
}

/**
 * Access check helper
 */
export function canAccessAdminInventory(roleSlug?: string | null): boolean {
    if (!roleSlug) return false;
    return roleSlug === "admin" || roleSlug.toLowerCase().includes("panel");
}

export function canAccessMemberInventory(isLoggedIn: boolean): boolean {
    return isLoggedIn;
}
