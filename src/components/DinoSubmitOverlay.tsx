import { useEffect, useRef, useState } from "react";

import run1 from "@/assets/run1.png";
import run2 from "@/assets/run2.png";
import run3 from "@/assets/run3.png";
import run4 from "@/assets/run4.png";
import run5 from "@/assets/run5.png";
import run6 from "@/assets/run6.png";
import run7 from "@/assets/run7.png";
import run8 from "@/assets/run8.png";
import dead1 from "@/assets/dead1.png";
import dead2 from "@/assets/dead2.png";
import dead3 from "@/assets/dead3.png";
import dead4 from "@/assets/dead4.png";
import dead5 from "@/assets/dead5.png";
import dead6 from "@/assets/dead6.png";
import dead7 from "@/assets/dead7.png";
import dead8 from "@/assets/dead8.png";
import rockImg from "@/assets/rock1.png";
import groundImg from "@/assets/ground.png";

const RUN_SRCS = [run1, run2, run3, run4, run5, run6, run7, run8].map(
  (f) => (f as unknown as { src: string }).src
);
const DEAD_SRCS = [dead1, dead2, dead3, dead4, dead5, dead6, dead7, dead8].map(
  (f) => (f as unknown as { src: string }).src
);
const GROUND_SRC = (groundImg as unknown as { src: string }).src;
const ROCK_SRC = (rockImg as unknown as { src: string }).src;

const RUN_FRAME_MS = 80;
const DEAD_FRAME_MS = 90;

type Phase = "running" | "dying" | "done";

interface Props {
  submitting: boolean;
  onClose: () => void;
  hasError?: boolean;
  title?: string;
  description?: string;
}

export default function DinoSubmitOverlay({
  submitting,
  onClose,
  hasError = false,
  title = "Submitting your application…",
  description = "Please wait while we process your details.",
}: Props) {
  const [assetsReady, setAssetsReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("running");
  const [runFrame, setRunFrame] = useState(0);
  const [deadFrame, setDeadFrame] = useState(0);
  const [rockX, setRockX] = useState(110);
  const [groundX, setGroundX] = useState(0);

  const rafRef = useRef<number | null>(null);
  const lastRunRef = useRef<number>(0);
  const lastDeadRef = useRef<number>(0);
  const lastGroundRef = useRef<number>(0);
  const phaseRef = useRef<Phase>("running");

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Preload all sprite assets before starting animation
  useEffect(() => {
    let cancelled = false;
    const allSrcs = [...RUN_SRCS, ...DEAD_SRCS, GROUND_SRC, ROCK_SRC];

    Promise.all(
      allSrcs.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          })
      )
    ).then(() => {
      if (!cancelled) setAssetsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Trigger death when submission finishes — snap rock to dino position first
  useEffect(() => {
    if (!submitting && phase === "running") {
      if (hasError) {
        // If there's an error, skip the death animation and go straight to done
        setPhase("done");
        phaseRef.current = "done";
      } else {
        // Snap rock to dino (dino is at left-16 = ~16% of container)
        setRockX(18);
        // Short delay so the snap is visible before death animation plays
        const t = setTimeout(() => {
          setPhase("dying");
          phaseRef.current = "dying";
        }, 150);
        return () => clearTimeout(t);
      }
    }
  }, [submitting, hasError, phase]);

  // Animation loop — only starts once assets are preloaded
  useEffect(() => {
    if (!assetsReady) return;

    const loop = (ts: number) => {
      const p = phaseRef.current;

      if (p === "running") {
        if (ts - lastGroundRef.current > 16) {
          setGroundX((x) => (x - 4) % 400);
          lastGroundRef.current = ts;
        }
        if (ts - lastRunRef.current > RUN_FRAME_MS) {
          setRunFrame((f) => (f + 1) % RUN_SRCS.length);
          lastRunRef.current = ts;
        }
        setRockX((x) => {
          const next = x - 0.35;
          return next < -15 ? 110 : next;
        });
      }

      if (p === "dying") {
        if (ts - lastDeadRef.current > DEAD_FRAME_MS) {
          setDeadFrame((f) => {
            const next = f + 1;
            if (next >= DEAD_SRCS.length) {
              phaseRef.current = "done";
              setPhase("done");
              return f;
            }
            return next;
          });
          lastDeadRef.current = ts;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [assetsReady]);

  const isRunning = phase === "running";
  const isDying = phase === "dying";
  const isDone = phase === "done";

  const sprite = isDying || isDone
    ? DEAD_SRCS[Math.min(deadFrame, DEAD_SRCS.length - 1)]
    : RUN_SRCS[runFrame];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border bg-white shadow-2xl overflow-hidden">

        {/* ── Scene ─────────────────────────────────────── */}
        <div className="relative h-40 bg-[#F6F6F7] overflow-hidden select-none">
          {!assetsReady ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-sm text-slate-400 animate-pulse">Loading…</span>
            </div>
          ) : (
            <>
              {/* Scrolling ground */}
              <div
                className="absolute bottom-0 left-0 flex"
                style={{ transform: `translateX(${groundX}px)` }}
              >
                {[0, 1, 2].map((i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={GROUND_SRC} alt="" className="h-10 object-cover" style={{ minWidth: "400px" }} draggable={false} />
                ))}
              </div>

              {/* Dino sprite */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sprite}
                alt="dino"
                className="absolute bottom-10 left-16 h-16 w-auto object-contain"
                style={{ imageRendering: "pixelated" }}
                draggable={false}
              />

              {/* Rock — only during running */}
              {isRunning && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ROCK_SRC}
                  alt=""
                  className="absolute bottom-10 h-10 w-auto object-contain"
                  style={{ left: `${rockX}%`, imageRendering: "pixelated" }}
                  draggable={false}
                />
              )}
            </>
          )}
        </div>

        {/* ── Text ──────────────────────────────────────── */}
        <div className="p-6 text-center">
          {(isRunning || isDying) && (
            <>
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <span className="inline-block h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="inline-block h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="inline-block h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </>
          )}

          {isDone && !hasError && (
            <>
              <div className="flex items-center justify-center mb-3">
                <div className="rounded-full bg-green-100 p-2">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-semibold text-slate-800">Application submitted successfully!</h3>
              <p className="mt-1 text-sm text-muted-foreground">We&apos;ll review your application and get back to you soon.</p>
              <button
                onClick={onClose}
                className="mt-5 w-full rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2 text-sm font-medium text-slate-700 transition-colors"
              >
                Close
              </button>
            </>
          )}

          {isDone && hasError && (
            <>
              <div className="flex items-center justify-center mb-3">
                <div className="rounded-full bg-red-100 p-2">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-semibold text-slate-800">Submission failed</h3>
              <p className="mt-1 text-sm text-muted-foreground">Something went wrong. Please close this and try again.</p>
              <button
                onClick={onClose}
                className="mt-5 w-full rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2 text-sm font-medium text-slate-700 transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
