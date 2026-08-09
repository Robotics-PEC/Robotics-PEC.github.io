import { useEffect } from "react";
import { useRouter } from "next/router";
import { client } from "@/lib/supabase/supabase";
import { toast } from "@/components/ui/use-toast";

const PEC_DOMAIN = "@pec.edu.in"; 

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const { data: listener } = client.auth.onAuthStateChange(async (event, session) => {
            if (!session) return;

            const email = session.user.email?.toLowerCase();

            if (!email || !email.endsWith(PEC_DOMAIN)) {
                await client.auth.signOut();
                toast({
                    title: "Access denied",
                    description: "Please log in with your PEC college email.",
                    variant: "destructive",
                });
                router.replace("/login");
                return;
            }

            router.replace("/");
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [router]);

    return <p>Signing you in...</p>;
}