import { useEffect } from "react";
import { useRouter } from "next/router";
import { client } from "@/lib/supabase/supabase";
import { toast } from "@/components/ui/use-toast";

const PEC_DOMAIN = "@pec.edu.in"; // ← replace with your actual college domain

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const { data: listener } = client.auth.onAuthStateChange(async (event, session) => {

            if (!session) {
                if (event === "INITIAL_SESSION" || event === "SIGNED_OUT") {
                    toast({
                        title: "Sign in failed",
                        description: "We couldn't sign you in. Please try again.",
                        variant: "destructive",
                    });
                    router.replace("/login");
                }
                return;
            }

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