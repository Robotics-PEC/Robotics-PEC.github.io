import { toast } from "@/hooks/use-toast";
import { panelistClient } from "../panelistClient";

export const loginPanelist = async (email: string, password: string) => {
    try {
        const { data, error } = await panelistClient
            .from("panelist_auth")
            .select("*")
            .eq("email", email)
            .eq("password", password)
            .single();

        if (error || !data) {
            toast({
                title: "Error",
                description: "Email or password is incorrect",
                variant: "destructive",
            });
            return null;
        }

        return data;
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to log in. Please try again.",
            variant: "destructive",
        });
        return null;
    }
};
