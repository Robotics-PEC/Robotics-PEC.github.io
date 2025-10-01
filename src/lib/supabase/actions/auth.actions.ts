import { toast } from "@/components/ui/use-toast";
import { client } from "../supabase";
import crypto from "crypto";

export const loginUser = async (email: string, password: string) => {

    const hash = crypto.createHash("sha256").update(password).digest("hex");

    console.log({ hash });

    if (hash != process.env.NEXT_PUBLIC_PASSWORD_HASH || email != process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        toast({
            title: "Error",
            description: "Email or password is incorrect",
            variant: "destructive",
        });
        return;
    }

    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
        console.log(error);
        toast({
            title: "Error",
            description: "Failed to log in. Please try again.",
            variant: "destructive",
        });
        return;
    }

    return JSON.parse(JSON.stringify(data));

}
