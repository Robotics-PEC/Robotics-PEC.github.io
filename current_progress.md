# Current Progress: Inventory Management System

**Branch:** `feature/Inventory`  
**Base Target:** Phase 1 and Phase 2 Complete, Phase 3–5 Ready for Implementation.

---

## 1. What Has Been Completed

### Phase 1: Database Schema & Migrations
- Migration file: `supabase/migrations/20261025000000_create_inventory_system.sql`
  - Table: `public.inventory_items`
    - Columns: `id`, `name`, `description`, `category`, `total_quantity`, `available_quantity`, `condition`, `price_equivalent`, `handling_instructions`, `max_borrow_days`, `max_quantity_per_request`, `image_url`, timestamps.
    - Constraints: Valid quantity checks, positive pricing, max borrow days validation.
  - Table: `public.inventory_requests`
    - Columns: `id`, `item_id`, `profile_id`, `quantity`, `item_condition_snapshot`, `start_date`, `expected_return_date`, `actual_return_date`, `status`, `liability_consent_agreed`, `consent_signature_text`, `rejection_reason`, `reviewer_profile_id`, timestamps.
    - Foreign keys: Cascade to `inventory_items` and `profiles`.
  - Stored Procedures / RPCs:
    - `public.approve_inventory_request(p_request_id, p_reviewer_profile_id)`: Atomic transaction with `FOR UPDATE` lock, checks stock, decrements `available_quantity`, sets status to `approved`.
    - `public.mark_inventory_returned(p_request_id, p_returned_condition)`: Atomic transaction, increments `available_quantity`, updates condition and actual return date.
  - Row Level Security (RLS):
    - Enabled on both tables.
    - Authenticated users can view catalog and create requests for their own profile.
    - `is_admin_or_panel()` strictly required for inventory mutations, request approvals, and updates.

### Phase 2: Data Access Layer & TypeScript Contracts
- Types: `src/types/inventory.ts`
  - Defines `InventoryItem`, `InventoryRequest`, `InventoryItemInput`, `BorrowRequestInput`, `ItemCondition`, `RequestStatus`.
- Actions: `src/lib/supabase/actions/inventory.actions.ts`
  - Items CRUD: `fetchInventoryItems`, `fetchInventoryItemById`, `createInventoryItem`, `updateInventoryItem`, `deleteInventoryItem`.
  - Requests: `submitBorrowRequest`, `fetchUserBorrowRequests`, `fetchAllBorrowRequests`, `approveBorrowRequest`, `rejectBorrowRequest`, `markItemReturned`.

### Validation & Comprehensive Unit Tests
- Validation Library: `src/lib/inventory/validation.ts`
  - `validateBorrowRequest`: Quantity bounds, per-item limits, stock availability, duration caps, date validations, liability consent checks.
  - `calculateLiabilityAmount`: Financial liability computation.
  - `canAccessAdminInventory` & `canAccessMemberInventory`: Role slug permissions.
- Test Suite: `src/__tests__/inventory/inventory-unit.test.ts`
  - 11 unit tests covering bounds, consent, and role security gates.
- Test Runner: `yarn test:inventory` (added to `package.json`).
  - Run via: `yarn test:inventory` (all 11 tests pass).

---

## 2. What Remains To Be Done (Phases 3–5)

Refer to `task.md` for full implementation specs:
1. **Phase 3: Member Portal UI**
   - Create catalog view with search and category filters.
   - Create item modal displaying specs, condition, price equivalent, and handling guidelines.
   - Create borrow request dialog with capped date-picker (`react-day-picker`) and digital liability signature.
   - Create member's loan history tracker.
   - Adhere strictly to the existing website theme (Tailwind tokens, Radix UI, Lucide icons, Sonner toasts).
2. **Phase 4: Admin/Panel Manager**
   - Sub-window 1: Borrow requests queue (pending, approved, returned, rejected) with approval/disapproval and return condition inspection.
   - Sub-window 2: Inventory CRUD editor (name, stock, condition, price equivalent, max days, per-member limit).
3. **Phase 5: Navigation & Route Registration**
   - Register routes in `src/lib/roles.ts` (`/inventory`, `/admin/inventory`).
   - Add navigation links in `Header.tsx` based on user roles.
