import { Instagram } from "lucide-react";
import { TechTalkDetails } from "@/types";

const ChallengeCard = ({showConfig} : {showConfig: TechTalkDetails}) => {
  const { challenge } = showConfig;

  return (
    <section id="challenge" className="rounded-2xl border border-border bg-card p-6 sm:p-10">
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

      <div className="mt-8 rounded-xl border border-border bg-background p-5 sm:p-6">
        <h3 className="font-display text-2xl text-foreground">Share your submission</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Post your submission as an Instagram story and tag{" "}
          <a
            href="https://www.instagram.com/robotics.society/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            @robotics.society
          </a>{" "}
          so we can feature it on the next episode!
        </p>
        <a
          href="https://www.instagram.com/robotics.society/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Instagram className="h-4 w-4" />
          Tag @robotics.society
        </a>
      </div>
    </section>
  );
}

export default ChallengeCard;