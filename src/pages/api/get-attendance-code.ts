import { NextApiRequest, NextApiResponse } from 'next';
import * as OTPAuth from 'otpauth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end();

    if (!process.env.ATTENDANCE_SECRET) {
        return res.status(500).json({ error: "Secret not configured" });
    }

    const totp = new OTPAuth.TOTP({
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromHex(process.env.ATTENDANCE_SECRET.trim()),
    });

    res.status(200).json({ code: totp.generate() });
}
