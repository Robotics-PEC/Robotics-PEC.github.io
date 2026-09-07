import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import PageSection from "@/components/layout/PageSection";
import ApplicationForm from "@/components/ApplicationForm";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/supabase/supabase";
import { getFeatureFlagByName } from "@/lib/supabase/actions/flags.actions";
import { getApplicantByUserId, linkApplicantToUser } from "@/lib/supabase/actions/applicants.actions";
import FeatureDisabled from "@/components/FeatureDisabled";
import { ApplicantType } from "@/types";
import { ResultDashboard } from "@/components/apply/ResultDashboard";

export default function ApplyPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Feature flags
    const [isFormActive, setIsFormActive] = useState(false);
    const [areResultsPublished, setAreResultsPublished] = useState(false);
    
    const [checksComplete, setChecksComplete] = useState(false);
    const [applicant, setApplicant] = useState<ApplicantType | null>(null);

    // Walk-in linking states
    const [walkinSid, setWalkinSid] = useState("");
    const [isLinking, setIsLinking] = useState(false);
    const [walkinAttempted, setWalkinAttempted] = useState(false);

    useEffect(() => {
        let active = true;

        const checkSessionAndFlags = async () => {
            try {
                // Fetch session and feature flags in parallel to optimize latency
                const [sessionRes, formFlag, resultsFlag] = await Promise.all([
                    client.auth.getSession(),
                    getFeatureFlagByName("recruitment-application-2026"),
                    getFeatureFlagByName("interview-results-2026")
                ]);

                if (!active) return;

                const session = sessionRes.data.session;
                const loggedIn = !!session;
                setIsLoggedIn(loggedIn);

                const resultsOut = resultsFlag?.isEnabled || false;
                setAreResultsPublished(resultsOut);
                setIsFormActive(formFlag?.isEnabled || false);

                const previewMode = router.query.preview as string;
                if (loggedIn && (previewMode === "accepted" || previewMode === "rejected")) {
                    // If in preview mode, instantly show the preview screen using session details
                    setApplicant({
                        id: "preview-id",
                        userId: session.user.id,
                        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "Panelist Name",
                        email: session.user.email || "",
                        phone: "",
                        sid: "",
                        isWalkin: false,
                        status: previewMode as "accepted" | "rejected",
                        createdAt: new Date().toISOString(),
                    } as ApplicantType);
                    return;
                }

                // If logged in and results are out, fetch their status
                if (loggedIn && resultsOut) {
                    let applicantData = await getApplicantByUserId(session.user.id);
                    
                    if (!applicantData) {
                        // Attempt auto-link for Walk-Ins
                        const email = session.user.email || "";
                        const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "";
                        const sidMatch = fullName.match(/\b(\d{8})\b/) || email.match(/\b(\d{8})\b/);
                        
                        if (sidMatch) {
                            const potentialSid = sidMatch[1];
                            applicantData = await linkApplicantToUser(potentialSid, session.user.id);
                        }
                    }
                    
                    setApplicant(applicantData);
                }
            } catch (error) {
                console.error("Failed to fetch feature flags or applicant:", error);
            } finally {
                setLoading(false);
                setChecksComplete(true);
            }
        };

        if (router.isReady) {
            void checkSessionAndFlags();
        }

        return () => { active = false; };
    }, [router.isReady, router.query]);

    if (loading || !checksComplete) {
        return (
            <section className="py-24">
                <PageSection title="Join Robotics Society" subtitle="Checking your status...">
                    <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 text-center shadow-sm">
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                </PageSection>
            </section>
        );
    }

    if (!isLoggedIn) {
        return (
          <section className="py-24">
            <PageSection title="Join Robotics Society" subtitle="You must be logged in to view your application status.">
              <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-semibold">Login Required</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please log in with your PEC account to proceed.
                </p>
                <Button className="mt-6" onClick={() => router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`)}>
                  Login
                </Button>
              </div>
            </PageSection>
          </section>
        );
    }

    // RESULTS VIEW
    if (areResultsPublished) {
        if (!applicant) {
            if (walkinAttempted) {
                // Show rejection screen as per user request #3
                return (
                    <section className="py-24">
                        <PageSection title="Interview Results" subtitle="You did not apply this time.">
                            <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 text-center shadow-sm">
                                <p className="text-gray-600 mb-4">
                                    We couldn't find your interview results in our system. You can still attend the workshops and other various events to join the society later by contacting a core member.
                                </p>
                            </div>
                        </PageSection>
                    </section>
                );
            }

            return (
                <section className="py-24">
                    <PageSection title="Interview Results" subtitle="Looks like you were a Walk-In applicant or your account isn't linked.">
                        <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 text-center shadow-sm">
                            <p className="text-sm text-muted-foreground mb-6">
                                Please enter your Student ID (SID) to link your application and view your result.
                            </p>
                            <div className="flex gap-4 flex-col sm:flex-row items-center justify-center">
                                <input 
                                    type="text" 
                                    placeholder="Enter your SID (e.g. 24105001)"
                                    className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-xs w-full text-black"
                                    value={walkinSid}
                                    onChange={(e) => setWalkinSid(e.target.value)}
                                />
                                <Button 
                                    onClick={async () => {
                                        if (!walkinSid.trim()) return;
                                        setIsLinking(true);
                                        const { data: { session } } = await client.auth.getSession();
                                        if (session) {
                                            const linkedApp = await linkApplicantToUser(walkinSid, session.user.id);
                                            if (linkedApp) {
                                                setApplicant(linkedApp);
                                            } else {
                                                setWalkinAttempted(true);
                                            }
                                        }
                                        setIsLinking(false);
                                    }}
                                    disabled={isLinking}
                                >
                                    {isLinking ? "Checking..." : "Check Status"}
                                </Button>
                            </div>
                        </div>
                    </PageSection>
                </section>
            );
        }

        const isAccepted = applicant.status === "accepted";
        const isRejected = applicant.status === "rejected";

        if (!isAccepted && !isRejected) {
            return (
                <section className="py-24">
                    <PageSection title="Interview Results" subtitle="Your result is still pending.">
                        <div className="mx-auto max-w-3xl rounded-xl border bg-white p-12 text-center shadow-sm">
                            <p className="text-lg font-medium text-gray-800">Your application is still under review.</p>
                            <p className="text-sm text-muted-foreground mt-2">Please check back later.</p>
                        </div>
                    </PageSection>
                </section>
            );
        }

        return <ResultDashboard applicant={applicant} />;
    }

    // NORMAL APPLICATION FORM VIEW
    return (
        <section className="py-24">
            <PageSection
                title="Join Robotics Society"
                subtitle="Apply to become a member of the Robotics Society at PEC."
            >
                {isFormActive ? <ApplicationForm /> : <FeatureDisabled />}
            </PageSection>
        </section>
    );
}