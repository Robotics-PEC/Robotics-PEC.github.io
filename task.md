# Task Specification: Inventory Management System

**Required Skills:** `frontend-ui-engineering`, `ui-ux-pro-max`, `backend-security-coder`, `security-and-hardening`, `code-review-and-quality`, `verify-and-stop`

## Scope & Objective
Build an Inventory Management System with dual-mode access:
1. **Member Portal** (`member` role or higher, logged in): Browse items, view availability, condition, handling rules, borrow limits, cap-constrained return date picker, submit borrow request with quantity and liability consent signing.
2. **Admin/Panel Manager** (`admin` or slug matching `panel`): Two sub-views:
   - Sub-window 1: Manage borrow requests (approve, reject, mark returned).
   - Sub-window 2: Inventory catalog management (add, edit, remove items, quantity, condition, price equivalent, handling instructions, max custom loan days, borrow limit per user).

---

## Phase 1: Database Schema & Migration

### 1.1 Tables Definition
Create migration `supabase/migrations/<timestamp>_inventory_system.sql`:
- **`public.inventory_items`**
  - `id` (UUID, PK, default `gen_random_uuid()`)
  - `name` (TEXT, NOT NULL)
  - `description` (TEXT)
  - `category` (TEXT)
  - `total_quantity` (INT, NOT NULL, CHECK >= 0)
  - `available_quantity` (INT, NOT NULL, CHECK >= 0)
  - `condition` (TEXT, NOT NULL) — e.g., `'Brand New'`, `'Good'`, `'Fair'`, `'Damaged/Maintenance'`
  - `price_equivalent` (NUMERIC(10,2), NOT NULL, CHECK >= 0) — replacement valuation for consent liability
  - `handling_instructions` (TEXT) — safety/usage guidelines
  - `max_borrow_days` (INT, NOT NULL, DEFAULT 7, CHECK > 0) — max custom borrowing duration allowed
  - `max_quantity_per_request` (INT, NOT NULL, DEFAULT 1, CHECK > 0)
  - `image_url` (TEXT)
  - `created_at` (TIMESTAMPTZ, DEFAULT now())
  - `updated_at` (TIMESTAMPTZ, DEFAULT now())

- **`public.inventory_requests`**
  - `id` (UUID, PK, default `gen_random_uuid()`)
  - `item_id` (UUID, NOT NULL, FK -> `public.inventory_items.id` ON DELETE CASCADE)
  - `profile_id` (UUID, NOT NULL, FK -> `public.profiles.id` ON DELETE CASCADE)
  - `quantity` (INT, NOT NULL, CHECK > 0)
  - `item_condition_snapshot` (TEXT, NOT NULL) — condition acknowledged at request time
  - `start_date` (DATE, NOT NULL, DEFAULT CURRENT_DATE)
  - `expected_return_date` (DATE, NOT NULL)
  - `actual_return_date` (DATE)
  - `status` (TEXT, NOT NULL, DEFAULT 'pending', CHECK IN ('pending', 'approved', 'rejected', 'returned', 'cancelled'))
  - `liability_consent_agreed` (BOOLEAN, NOT NULL, CHECK (liability_consent_agreed = true))
  - `consent_signature_text` (TEXT, NOT NULL) — full legal name / college SID signed
  - `rejection_reason` (TEXT)
  - `reviewer_profile_id` (UUID, FK -> `public.profiles.id`)
  - `created_at` (TIMESTAMPTZ, DEFAULT now())
  - `updated_at` (TIMESTAMPTZ, DEFAULT now())

### 1.2 Database Functions & Atomic Transactions
- **`public.approve_inventory_request(p_request_id UUID, p_reviewer_id UUID)`**:
  - Validates `available_quantity >= request.quantity`.
  - Atomically decrements `available_quantity` in `public.inventory_items`.
  - Sets request `status = 'approved'` and `reviewer_profile_id = p_reviewer_id`.
- **`public.mark_inventory_returned(p_request_id UUID, p_returned_condition TEXT)`**:
  - Atomically increments `available_quantity` in `public.inventory_items`.
  - Sets `actual_return_date = CURRENT_DATE` and `status = 'returned'`.
- RLS Policies:
  - `inventory_items`: Read allowed for authenticated users (`member` or higher). Write/Update/Delete allowed only for `is_admin_or_panel()`.
  - `inventory_requests`: Read own requests for members; read all requests for `is_admin_or_panel()`. Insert allowed for authenticated user linking to their own `profile_id`. Update allowed only for `is_admin_or_panel()`.

---

## Phase 2: Data Access Layer & TypeScript Contracts

### 2.1 Types (`src/types/inventory.ts`)
- `InventoryItem`: Interface matching table schema.
- `InventoryRequest`: Interface matching table schema + join fields (`item`, `profile`).
- `InventoryItemInput`: Omit auto-generated fields for catalog form.
- `BorrowRequestInput`: Payload for member borrow action.

### 2.2 Supabase Actions (`src/lib/supabase/actions/inventory.ts`)
- `fetchInventoryItems()`: Fetch all catalog items with filters (category, search, availability).
- `fetchInventoryItemById(id: string)`: Fetch single item details.
- `createInventoryItem(item: InventoryItemInput)`: Admin action.
- `updateInventoryItem(id: string, item: Partial<InventoryItemInput>)`: Admin action.
- `deleteInventoryItem(id: string)`: Admin action.
- `submitBorrowRequest(input: BorrowRequestInput)`: Member submission with validation.
- `fetchUserBorrowRequests(profileId: string)`: Member's own borrowing history.
- `fetchAllBorrowRequests(status?: string)`: Admin queue listing.
- `approveBorrowRequest(requestId: string, reviewerProfileId: string)`: RPC call.
- `rejectBorrowRequest(requestId: string, reviewerProfileId: string, reason?: string)`: Update status.
- `markItemReturned(requestId: string, returnedCondition: string)`: RPC call.

---

## Phase 3: Member Portal (Catalog & Borrow Flow)
> **Design Note for Phase 3 & 4:** Maintain existing design system, color tokens, and CSS theme of the website exactly (Tailwind semantic tokens, Radix UI primitives, Lucide icons, Sonner toasts). No changes to existing website UI; new features must strictly adhere to existing visual patterns.

### 3.1 Route & Access Control
- Page: `src/pages/inventory/index.tsx`
- Route protection: Requires authenticated session with `member`, `panel`, or `admin` role via `useAuthRole()`.

### 3.2 Component Architecture
- **`src/components/inventory/InventoryCatalog.tsx`**:
  - Grid/list view with search, category filtering, and status badge (In Stock / Out of Stock).
  - Item Card shows: Name, image, category, available vs total quantity, condition badge.
- **`src/components/inventory/ItemDetailModal.tsx`**:
  - Opens on item card click.
  - Displays: Full description, handling instructions, replacement valuation (price equivalent), condition status.
  - Controls: Quantity selector (min: 1, max: `min(available_quantity, max_quantity_per_request)`).
  - Return Date Picker: `react-day-picker` constrained between `today` and `today + max_borrow_days`.
- **`src/components/inventory/LiabilityConsentDialog.tsx`**:
  - Explicit liability agreement:
    - Return item in identical condition (`item_condition_snapshot`).
    - Replacement/repair liability up to `price_equivalent * quantity`.
    - Adherence to handling instructions.
  - Mandatory checkbox + typed digital signature (Member Name / SID).
  - Submit button triggers `submitBorrowRequest()`.
- **`src/components/inventory/MemberLoansHistory.tsx`**:
  - Tab/drawer showing member's active requests and approval statuses.

---

## Phase 4: Admin & Panel Inventory Manager

### 4.1 Route & Access Control
- Page: `src/pages/admin/inventory.tsx`
- Route protection: Strict check for `role.slug === 'admin' || role.slug.includes('panel')`.

### 4.2 Two-Subwindow Tabbed Interface
- **Window 1: Borrow Requests Queue (`src/components/inventory/admin/BorrowRequestsManager.tsx`)**:
  - Filter tabs: Pending, Active/Approved, Returned, Rejected.
  - Request table/cards:
    - Member name, email, SID.
    - Item requested, quantity, current condition vs snapshot.
    - Start date, expected return date, overdue alert if past date.
    - Digital signature & consent verification badge.
  - Actions:
    - **Approve**: Decrements stock, notifies status.
    - **Disapprove/Reject**: Prompts optional rejection reason modal.
    - **Mark Returned**: Opens return inspection dialog with condition update.
- **Window 2: Catalog & Stock Editor (`src/components/inventory/admin/CatalogManager.tsx`)**:
  - List/data-table of all inventory items with edit/delete actions.
  - **Item Form Modal (`ItemEditorModal.tsx`)**:
    - Item Name, Description, Category.
    - Total Quantity, Available Quantity.
    - Condition dropdown (`Brand New`, `Good`, `Fair`, `Damaged`).
    - Price Equivalent (INR).
    - Handling & Care Instructions (textarea).
    - Max Borrowing Window (`max_borrow_days`).
    - Max Limit Per Member (`max_quantity_per_request`).
    - Image upload or URL link.

---

## Phase 5: Navigation, RBAC Routing & Polish

### 5.1 RBAC Registration
- Update `src/lib/roles.ts`: Add `/inventory` and `/admin/inventory` to `PAGES` definition.
- Update Navbar/Sidebar:
  - Display "Inventory" link for all authenticated members.
  - Display "Inventory Management" in Admin sub-menu for `admin` and `panel-*` roles.

### 5.2 Edge Cases & Safety Gating
- Concurrency guard: Stale checks if another member claims the last available quantity before approval.
- Zero-quantity disablement: Request button disabled when `available_quantity === 0`.
- Validation checks: Return date cannot exceed `today + max_borrow_days`.

---

## Comprehensive Unit & Integration Tests

Create test suite under `src/__tests__/inventory/`:

### 1. Catalog & Validation Logic Tests (`catalog-validation.test.ts`)
- `test_borrow_quantity_capped_by_item_limit`: Verify requested quantity cannot exceed `max_quantity_per_request`.
- `test_borrow_quantity_capped_by_available_stock`: Verify requested quantity cannot exceed `available_quantity`.
- `test_zero_available_stock_blocks_request`: Verify request cannot be initiated if `available_quantity = 0`.
- `test_return_date_exceeding_max_borrow_days_rejected`: Given `max_borrow_days = 5`, verify selecting day 6 triggers validation error.
- `test_return_date_in_past_rejected`: Selecting date `< today` fails validation.

### 2. Liability & Consent Tests (`liability-consent.test.ts`)
- `test_consent_requires_explicit_checkbox`: Submitting without `liability_consent_agreed = true` throws validation error.
- `test_consent_requires_signature_text`: Submitting empty signature string throws error.
- `test_consent_snapshot_matches_item_condition`: Verify `item_condition_snapshot` in request matches item condition at submission time.
- `test_price_equivalent_liability_calculation`: Verify consent document displays total valuation (`price_equivalent * quantity`).

### 3. State Transition & RPC Tests (`inventory-state.test.ts`)
- `test_approve_request_decrements_available_stock`: Approving request of 2 units reduces available stock from 5 to 3.
- `test_approve_fails_if_stock_depleted`: Approving request when available < requested quantity fails with error.
- `test_mark_returned_increments_available_stock`: Marking returned increases available stock from 3 back to 5.
- `test_reject_request_does_not_mutate_stock`: Rejecting leaves available stock unchanged.

### 4. RBAC & Access Guard Tests (`inventory-rbac.test.ts`)
- `test_unauthenticated_user_denied_access`: Unauthenticated visitors cannot access `/inventory` or `/admin/inventory`.
- `test_member_role_can_access_catalog_only`: Member role can access `/inventory` but gets 404/Denied on `/admin/inventory`.
- `test_panel_role_can_access_admin_inventory`: User with slug `panel-1` can access `/admin/inventory`.
- `test_admin_role_can_access_both_views`: User with `admin` role can access both `/inventory` and `/admin/inventory`.
