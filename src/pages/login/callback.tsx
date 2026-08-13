import { useEffect } from "react";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { client } from "@/lib/supabase/supabase";
import { toast } from "@/components/ui/use-toast";

const PEC_DOMAIN = "@pec.edu.in"; // ← replace with your actual college domain

export default function AuthCallback() {
    const router = useRouter();

    const redirectTarget = useMemo(() => {
        if (!router.isReady) {
            return "/";
        }

        const query = router.asPath.split("?")[1] ?? "";
        const redirectValue = new URLSearchParams(query).get("redirect") ?? "/";
        return redirectValue.startsWith("/") ? redirectValue : "/";
    }, [router.asPath, router.isReady]);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

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

            router.replace(redirectTarget);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [redirectTarget, router]);

    return <p>Signing you in...</p>;
}