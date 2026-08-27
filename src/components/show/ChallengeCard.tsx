import { TechTalkDetails } from "@/types";
import ChallengeForm  from "./ChallengeForm";

const ChallengeCard = ({showConfig} : {showConfig: TechTalkDetails}) => {
  const { challenge } = showConfig;

  return (
    <section id="challenge" className="rounded-2xl border border-border bg-card p-6 sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <span className="inline-flex items-center rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Week {challenge.week} challenge
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            {challenge.title}
          </h2>
          <div
            className="mt-4 text-base leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: challenge.brief }}
          />
          <p className="mt-6 text-sm text-foreground">
            Deadline: <span className="text-primary">{challenge.deadline}</span>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-5 sm:p-6">
          <h3 className="font-display text-2xl text-foreground">Submit your entry</h3>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">
            Entries are reviewed live on the next episode.
          </p>
          <ChallengeForm />
        </div>
      </div>
    </section>
  );
}

export default ChallengeCard;