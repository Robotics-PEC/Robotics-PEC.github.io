import { client } from "../supabase";
import type {
    InventoryItem,
    InventoryItemInput,
    InventoryRequest,
    BorrowRequestInput,
} from "@/types/inventory";

/* ----------------------------------------------------------------- Items CRUD */

export async function fetchInventoryItems(): Promise<InventoryItem[]> {
    const { data, error } = await client
        .from("inventory_items")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return (data as InventoryItem[]) ?? [];
}

export async function fetchInventoryItemById(id: string): Promise<InventoryItem | null> {
    const { data, error } = await client
        .from("inventory_items")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as InventoryItem;
}

export async function createInventoryItem(item: InventoryItemInput): Promise<InventoryItem> {
    const { data, error } = await client
        .from("inventory_items")
        .insert([item])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as InventoryItem;
}

export async function updateInventoryItem(
    id: string,
    item: Partial<InventoryItemInput>
): Promise<InventoryItem> {
    const { data, error } = await client
        .from("inventory_items")
        .update({ ...item, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as InventoryItem;
}

export async function deleteInventoryItem(id: string): Promise<void> {
    const { error } = await client.from("inventory_items").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}

/* ----------------------------------------------------------------- Borrow Requests */

export async function submitBorrowRequest(
    input: BorrowRequestInput
): Promise<InventoryRequest> {
    // Basic validation
    if (!input.liability_consent_agreed) {
        throw new Error("You must agree to the liability consent agreement.");
    }
    if (!input.consent_signature_text || input.consent_signature_text.trim() === "") {
        throw new Error("Digital signature is required.");
    }
    if (input.quantity <= 0) {
        throw new Error("Quantity must be at least 1.");
    }

    const { data, error } = await client
        .from("inventory_requests")
        .insert([
            {
                item_id: input.item_id,
                profile_id: input.profile_id,
                quantity: input.quantity,
                item_condition_snapshot: input.item_condition_snapshot,
                start_date: input.start_date ?? new Date().toISOString().split("T")[0],
                expected_return_date: input.expected_return_date,
                liability_consent_agreed: input.liability_consent_agreed,
                consent_signature_text: input.consent_signature_text.trim(),
                status: "pending",
            },
        ])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as InventoryRequest;
}

export async function fetchUserBorrowRequests(
    profileId: string
): Promise<InventoryRequest[]> {
    const { data, error } = await client
        .from("inventory_requests")
        .select("*, item:inventory_items(*)")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return (data as InventoryRequest[]) ?? [];
}

export async function fetchAllBorrowRequests(
    status?: string
): Promise<InventoryRequest[]> {
    let query = client
        .from("inventory_requests")
        .select("*, item:inventory_items(*), profile:profiles(*)")
        .order("created_at", { ascending: false });

    if (status && status !== "all") {
        query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return (data as InventoryRequest[]) ?? [];
}

export async function approveBorrowRequest(
    requestId: string,
    reviewerProfileId: string
): Promise<{ success: boolean; request_id: string; remaining_available: number }> {
    const { data, error } = await client.rpc("approve_inventory_request", {
        p_request_id: requestId,
        p_reviewer_profile_id: reviewerProfileId,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function rejectBorrowRequest(
    requestId: string,
    reviewerProfileId: string,
    rejectionReason?: string
): Promise<void> {
    const { error } = await client
        .from("inventory_requests")
        .update({
            status: "rejected",
            reviewer_profile_id: reviewerProfileId,
            rejection_reason: rejectionReason ?? null,
            updated_at: new Date().toISOString(),
        })
        .eq("id", requestId);

    if (error) {
        throw new Error(error.message);
    }
}

export async function markItemReturned(
    requestId: string,
    returnedCondition?: string
): Promise<{ success: boolean; request_id: string }> {
    const { data, error } = await client.rpc("mark_inventory_returned", {
        p_request_id: requestId,
        p_returned_condition: returnedCondition ?? null,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
