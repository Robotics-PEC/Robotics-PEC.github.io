import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import PageSection from "@/components/layout/PageSection";
import ApplicationForm from "@/components/ApplicationForm";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/supabase/supabase";

export default function ApplyPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        let active = true;

        const checkSession = async () => {
            const {
                data: { session },
            } = await client.auth.getSession();

            if (!active) return;

            setIsLoggedIn(!!session);
            setLoading(false);
        };

        void checkSession();

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <section className="py-24">
                <PageSection
                    title="Join Robotics Society"
                    subtitle="Checking your login status..."
                >
                    <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 text-center shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Checking your account...
                        </p>
                    </div>
                </PageSection>
            </section>
        );
    }

    if (!isLoggedIn) {
        return (
            <section className="py-24">
                <PageSection
                    title="Join Robotics Society"
                    subtitle="You must be logged in to submit an application."
                >
                    <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 text-center shadow-sm">
                        <h2 className="text-xl font-semibold">
                            Login Required
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Please log in with your PEC account before
                            accessing the registration form.
                        </p>

                        <Button
                            className="mt-6"
                            onClick={() => router.push("/login")}
                        >
                            Login
                        </Button>
                    </div>
                </PageSection>
            </section>
        );
    }

    return (
        <section className="py-24">
            <PageSection
                title="Join Robotics Society"
                subtitle="Apply to become a member of the Robotics Society at PEC."
            >
                <ApplicationForm />
            </PageSection>
        </section>
    );
}