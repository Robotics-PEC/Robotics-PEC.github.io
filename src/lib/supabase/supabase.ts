import { createClient } from "@supabase/supabase-js";
import { sessionStorageAdapter } from "../sessionStorageAdapter";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const client = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            storage: sessionStorageAdapter,
            storageKey: `sb-${process.env.NEXT_PUBLIC_PROJECT_REF}-auth-token`
        }
    }
);
