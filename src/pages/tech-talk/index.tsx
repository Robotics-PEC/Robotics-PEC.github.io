import StreamPlayer  from "@/components/show/StreamPlayer";
import LiveChat  from "@/components/show/LiveChat";
import  ChallengeCard  from "@/components/show/ChallengeCard";
import DinoSubmitOverlay from "@/components/DinoSubmitOverlay";
import { useEffect, useState } from "react";
import { getTechTalkDetails } from "@/lib/supabase/actions/tech-talk.actions";
import { getFeatureFlagByName } from "@/lib/supabase/actions/flags.actions";
import { TechTalkDetails } from "@/types";
import { VideoOff } from "lucide-react";


const TechTalkPage = () => {

    const [showConfig, setShowConfig] = useState<TechTalkDetails | null>(null);
    const [challengeEnabled, setChallengeEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const [talkShowDetails, challengeFlag] = await Promise.all([
                getTechTalkDetails("The Talk Show"),
                getFeatureFlagByName("tech-talk-challenge")
            ]);

            if(talkShowDetails) {
                setShowConfig(talkShowDetails);
            }
            if(challengeFlag) {
                setChallengeEnabled(challengeFlag.isEnabled);
            }

            setLoading(false);
        }

        fetch();
    }, []);

    if(loading) {
        return (
            <DinoSubmitOverlay
                submitting
                onClose={() => {}}
                title="Loading the talk show…"
                description="Fetching the latest stream details."
            />
        )
    }

    if(!showConfig) {
        return (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 text-center lg:min-h-[520px]">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <VideoOff className="h-8 w-8 text-muted-foreground" />
                </div>

                <h2 className="text-xl font-semibold text-foreground">
                    No livestream right now
                </h2>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    The show isn't live at the moment. Check back when the next
                    episode goes live!
                </p>
            </div>
        )
    }

    return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
        {showConfig.showName}
        </h1>

        <section className="grid gap-6 lg:grid-cols-[1.9fr_1fr]">
        <StreamPlayer showConfig={showConfig}/>
        <LiveChat showConfig={showConfig}/>
        </section>

        {challengeEnabled && <ChallengeCard showConfig={showConfig}/>}
    </main>
    );
}

export default TechTalkPage;
