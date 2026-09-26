import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@supabase/supabase-js";
import * as OTPAuth from 'otpauth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const getSupabaseClient = (req: NextApiRequest) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing authorization token");
  }

  const token = authHeader.substring(7);

  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  );
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { eventId, code, userId } = req.body;

        if (!userId) return res.status(400).json({ error: "User ID required" });

        const supabase = getSupabaseClient(req);

        // 1. Validate TOTP
        const totp = new OTPAuth.TOTP({
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromHex(process.env.ATTENDANCE_SECRET!.trim()),
        });

        const isValidCode = totp.validate({ token: code, window: 1 }) !== null;
        if (!isValidCode) {
            return res.status(400).json({ error: "Invalid code" });
        }

        // Just validate, return success
        res.status(200).json({ isValid: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
