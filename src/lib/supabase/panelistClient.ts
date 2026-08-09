import { createClient } from "@supabase/supabase-js";
export const panelistClient = createClient(
  process.env.NEXT_PUBLIC_PANELIST_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_PANELIST_SUPABASE_ANON_KEY!
);
