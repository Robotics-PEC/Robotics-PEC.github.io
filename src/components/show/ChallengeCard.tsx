import { Instagram, CheckCircle2 } from "lucide-react";
import { TechTalkDetails } from "@/types";
import { useState } from "react";
import { createTechTalkSubmission } from "@/lib/supabase/actions/tech-talk-submissions.actions";
import DinoSubmitOverlay from "@/components/DinoSubmitOverlay";
import {
  DynamicForm,
  FormConfigKey,
  SectionKey,
  FieldConfigKey,
  FieldType,
  SubmitConfigKey,
  type FormConfig,
} from "@/lib/form-builder";

const ChallengeCard = ({showConfig} : {showConfig: TechTalkDetails}) => {
  const { challenge, episodeNumber } = showConfig;

  const [submitting, setSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formConfig: FormConfig = {
    [FormConfigKey.SECTIONS]: [
      {
        [SectionKey.FIELDS]: [
          {
            [FieldConfigKey.NAME]: "name",
            [FieldConfigKey.LABEL]: "Your Name",
            [FieldConfigKey.TYPE]: FieldType.TEXT,
            [FieldConfigKey.PLACEHOLDER]: "Enter your full name",
            [FieldConfigKey.REQUIRED]: true,
          },
          {
            [FieldConfigKey.NAME]: "link",
            [FieldConfigKey.LABEL]: "Post Link (Instagram / LinkedIn / X)",
            [FieldConfigKey.TYPE]: FieldType.URL,
            [FieldConfigKey.PLACEHOLDER]: "https://www.instagram.com/p/...",
            [FieldConfigKey.REQUIRED]: true,
          },
        ],
      },
    ],
    [FormConfigKey.SUBMIT]: {
      [SubmitConfigKey.LABEL]: "Submit Challenge Entry",
      [SubmitConfigKey.LOADING_LABEL]: "Submitting...",
      [SubmitConfigKey.CLASS_NAME]: "w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors",
    },
    [FormConfigKey.CLASS_NAME]: "space-y-4",
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      setHasError(false);
      setShowOverlay(true);

      await createTechTalkSubmission({
        name: String(values.name || "").trim(),
        episodeNumber,
        link: String(values.link || "").trim(),
      });

      setSubmitting(false);
      setSubmitted(true);
    } catch (err: any) {
      setSubmitting(false);
      setHasError(true);
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    if (!hasError) {
      setSubmitted(true);
    }
  };

  return (
    <>
      {showOverlay && (
        <DinoSubmitOverlay
          submitting={submitting}
          hasError={hasError}
          onClose={handleCloseOverlay}
          title={submitting ? "Submitting your entry…" : hasError ? "Submission failed" : "Challenge entry submitted!"}
          description={submitting ? "Please wait while we record your challenge entry." : hasError ? "Something went wrong. Please close and try again." : "We've recorded your post link successfully."}
        />
      )}

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

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Submission Form via DynamicForm */}
          <div className="rounded-xl border border-border bg-background p-5 sm:p-6">
            <h3 className="font-display text-2xl text-foreground">Submit Your Entry</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Share your details and post link below for Episode #{episodeNumber}.
            </p>

            {submitted ? (
              <div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                <h4 className="mt-2 font-semibold text-foreground">Submission Received!</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Thank you for submitting your entry. Keep an eye out for features!
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-primary hover:underline"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <DynamicForm
                  config={formConfig}
                  onSubmit={handleFormSubmit}
                />
              </div>
            )}
          </div>

          {/* Instagram Share Card */}
          <div className="flex flex-col justify-center rounded-xl border border-border bg-background p-5 sm:p-6">
            <h3 className="font-display text-2xl text-foreground">Share on Socials</h3>
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
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 w-fit"
            >
              <Instagram className="h-4 w-4" />
              Tag @robotics.society
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default ChallengeCard;
