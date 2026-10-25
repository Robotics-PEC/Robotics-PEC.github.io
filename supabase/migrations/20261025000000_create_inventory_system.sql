-- Migration: 20261025000000_create_inventory_system.sql
-- Description: Inventory management system with items catalog, borrowing requests, atomic transactions, and RLS

-- 1. Create inventory_items table
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    total_quantity INT NOT NULL CHECK (total_quantity >= 0),
    available_quantity INT NOT NULL CHECK (available_quantity >= 0 AND available_quantity <= total_quantity),
    condition TEXT NOT NULL DEFAULT 'Good',
    price_equivalent NUMERIC(10, 2) NOT NULL CHECK (price_equivalent >= 0),
    handling_instructions TEXT,
    max_borrow_days INT NOT NULL DEFAULT 7 CHECK (max_borrow_days > 0),
    max_quantity_per_request INT NOT NULL DEFAULT 1 CHECK (max_quantity_per_request > 0),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create inventory_requests table
CREATE TABLE IF NOT EXISTS public.inventory_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    item_condition_snapshot TEXT NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_return_date DATE NOT NULL CHECK (expected_return_date >= start_date),
    actual_return_date DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'returned', 'cancelled')),
    liability_consent_agreed BOOLEAN NOT NULL CHECK (liability_consent_agreed = true),
    consent_signature_text TEXT NOT NULL CHECK (length(trim(consent_signature_text)) > 0),
    rejection_reason TEXT,
    reviewer_profile_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_requests_profile_id ON public.inventory_requests(profile_id);
CREATE INDEX IF NOT EXISTS idx_inventory_requests_item_id ON public.inventory_requests(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_requests_status ON public.inventory_requests(status);

-- 3. Atomic RPC: Approve borrow request
CREATE OR REPLACE FUNCTION public.approve_inventory_request(
    p_request_id UUID,
    p_reviewer_profile_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_item_id UUID;
    v_requested_qty INT;
    v_current_available INT;
    v_status TEXT;
BEGIN
    -- Verify reviewer has admin or panel role
    IF NOT public.is_admin_or_panel() THEN
        RAISE EXCEPTION 'Unauthorized: only admin or panel members can approve inventory requests';
    END IF;

    -- Fetch request details with lock
    SELECT item_id, quantity, status
    INTO v_item_id, v_requested_qty, v_status
    FROM public.inventory_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found';
    END IF;

    IF v_status <> 'pending' THEN
        RAISE EXCEPTION 'Only pending requests can be approved. Current status: %', v_status;
    END IF;

    -- Fetch item available quantity with lock
    SELECT available_quantity
    INTO v_current_available
    FROM public.inventory_items
    WHERE id = v_item_id
    FOR UPDATE;

    IF v_current_available < v_requested_qty THEN
        RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', v_current_available, v_requested_qty;
    END IF;

    -- Deduct available quantity
    UPDATE public.inventory_items
    SET available_quantity = available_quantity - v_requested_qty,
        updated_at = now()
    WHERE id = v_item_id;

    -- Update request status
    UPDATE public.inventory_requests
    SET status = 'approved',
        reviewer_profile_id = p_reviewer_profile_id,
        updated_at = now()
    WHERE id = p_request_id;

    RETURN jsonb_build_object(
        'success', true,
        'request_id', p_request_id,
        'item_id', v_item_id,
        'remaining_available', v_current_available - v_requested_qty
    );
END;
$$;

-- 4. Atomic RPC: Mark inventory returned
CREATE OR REPLACE FUNCTION public.mark_inventory_returned(
    p_request_id UUID,
    p_returned_condition TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_item_id UUID;
    v_qty INT;
    v_status TEXT;
    v_total_qty INT;
    v_new_available INT;
BEGIN
    -- Verify reviewer has admin or panel role
    IF NOT public.is_admin_or_panel() THEN
        RAISE EXCEPTION 'Unauthorized: only admin or panel members can mark items returned';
    END IF;

    SELECT item_id, quantity, status
    INTO v_item_id, v_qty, v_status
    FROM public.inventory_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found';
    END IF;

    IF v_status <> 'approved' THEN
        RAISE EXCEPTION 'Only approved/active loans can be marked as returned. Current status: %', v_status;
    END IF;

    -- Return stock to item
    SELECT total_quantity, available_quantity
    INTO v_total_qty, v_new_available
    FROM public.inventory_items
    WHERE id = v_item_id
    FOR UPDATE;

    UPDATE public.inventory_items
    SET available_quantity = LEAST(v_total_qty, available_quantity + v_qty),
        condition = COALESCE(p_returned_condition, condition),
        updated_at = now()
    WHERE id = v_item_id;

    -- Update request
    UPDATE public.inventory_requests
    SET status = 'returned',
        actual_return_date = CURRENT_DATE,
        updated_at = now()
    WHERE id = p_request_id;

    RETURN jsonb_build_object(
        'success', true,
        'request_id', p_request_id,
        'item_id', v_item_id
    );
END;
$$;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_requests ENABLE ROW LEVEL SECURITY;

-- 5.1 RLS for inventory_items
CREATE POLICY "Allow authenticated users to view inventory items"
    ON public.inventory_items
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow admin or panel to insert inventory items"
    ON public.inventory_items
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_panel());

CREATE POLICY "Allow admin or panel to update inventory items"
    ON public.inventory_items
    FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_panel())
    WITH CHECK (public.is_admin_or_panel());

CREATE POLICY "Allow admin or panel to delete inventory items"
    ON public.inventory_items
    FOR DELETE
    TO authenticated
    USING (public.is_admin_or_panel());

-- 5.2 RLS for inventory_requests
CREATE POLICY "Allow users to view own requests or admin/panel to view all"
    ON public.inventory_requests
    FOR SELECT
    TO authenticated
    USING (
        profile_id IN (
            SELECT p.id FROM public.profiles p WHERE p."userId" = auth.uid()
        )
        OR public.is_admin_or_panel()
    );

CREATE POLICY "Allow authenticated users to create request for own profile"
    ON public.inventory_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (
        profile_id IN (
            SELECT p.id FROM public.profiles p WHERE p."userId" = auth.uid()
        )
    );

CREATE POLICY "Allow admin or panel to update requests"
    ON public.inventory_requests
    FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_panel())
    WITH CHECK (public.is_admin_or_panel());
