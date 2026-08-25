// import "server-only";
import { createClient } from "@supabase/supabase-js";
import { NextApiRequest } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// lib/supabase/server.ts

export const client = createClient(
    supabaseUrl,
    supabaseAnonKey
);

export const getSupabaseClient = () => {
    return createClient(
        supabaseUrl,
        supabaseAnonKey
    );
};

export const getAuthenticatedSupabaseClient = (
    req: NextApiRequest
) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        throw new Error("Missing authorization token");
    }

    const accessToken = authorization.substring(7);

    return createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }
    );
};

export const apiFetch = async (
    input: RequestInfo | URL,
    init: RequestInit = {}
) => {
    const {
        data: { session },
    } = await client.auth.getSession();

    const headers = new Headers(init.headers);

    headers.set("Content-Type", "application/json");

    if (session?.access_token) {
        headers.set(
            "Authorization",
            `Bearer ${session.access_token}`
        );
    }

    return fetch(input, {
        ...init,
        headers,
    });
};