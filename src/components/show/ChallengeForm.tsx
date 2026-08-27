import { useState, type FormEvent } from "react";

type Submission = { name: string; link: string; note: string };

/**
 * Placeholder submit handler — wire your existing auth/backend in here.
 * The UI does not need to change when you do.
 */
async function submitChallenge(_values: Submission): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
}

const ChallengeForm = () => {
  const [values, setValues] = useState<Submission>({ name: "", link: "", note: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const set = (key: keyof Submission) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    await submitChallenge(values);
    setStatus("done");
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-medium tracking-wide uppercase">
            Your name
          </label>
          <input
            id="name"
            required
            value={values.name}
            onChange={set("name")}
            placeholder="Ada Lovelace"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="link" className="mb-1 block text-xs font-medium tracking-wide uppercase">
            Project link
          </label>
          <input
            id="link"
            type="url"
            required
            value={values.link}
            onChange={set("link")}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="note" className="mb-1 block text-xs font-medium tracking-wide uppercase">
          Short note
        </label>
        <textarea
          id="note"
          required
          rows={3}
          value={values.note}
          onChange={set("note")}
          placeholder="What did you build, and what broke along the way?"
          className={inputClass}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Submit entry"}
        </button>
        {status === "done" && (
          <p className="text-sm text-muted-foreground">
            Placeholder only — submissions will be handled by your existing auth/backend.
          </p>
        )}
      </div>
    </form>
  );
}

export default ChallengeForm;