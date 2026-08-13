"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { loginWithGoogle } from "@/lib/supabase/actions/auth.actions";
import { getImagesFromFolder } from "@/lib/supabase/actions/storage.actions";
import { client } from "@/lib/supabase/supabase";
import { useRouter } from "next/router";
import { sanitizeRedirectPath } from "@/lib/utils";

const Login: NextPage = () => {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  const redirectTarget = useMemo(() => {
    if (!router.isReady) {
      return "/";
    }

    const query = router.asPath.split("?")[1] ?? "";
    const redirectValue = new URLSearchParams(query).get("redirect");
    return sanitizeRedirectPath(redirectValue);
  }, [router.asPath, router.isReady]);

  useEffect(() => {
    const loadImages = async () => {
      const images = await getImagesFromFolder("hero");
      setHeroImages(images);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const checkSession = async () => {
      const { data: { session } } = await client.auth.getSession();

      if (session) {
        router.replace(redirectTarget);
        return;
      }

      setCheckingSession(false);
    };

    void checkSession();
  }, [redirectTarget, router]);

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages]);

  const currentImage = heroImages[currentIndex];

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-slate-200/50 blur-3xl" />
        <div className="absolute bottom-0 right-[-6rem] h-96 w-96 rounded-full bg-slate-100 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600 shadow-sm">
              PEC Robotics
            </div>

            <div className="max-w-xl space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Welcome to Robotics Society
              </h1>

              <p className="max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
                Sign in to verify your account.
              </p>
            </div>

            <div className="mt-10 max-w-md space-y-5">
              <button
                type="button"
                onClick={() => void loginWithGoogle(redirectTarget)}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-xl hover:shadow-slate-950/20 active:translate-y-0"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition group-hover:scale-105">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.35 12.23c0-.79-.07-1.55-.22-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
                      fill="#34A853"
                    />
                    <path
                      d="M6.54 13.6a5.86 5.86 0 0 1 0-3.75V7.32H3.3a9.75 9.75 0 0 0 0 8.81l3.24-2.53Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.82c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 2.91 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.82l3.24 2.53C7.31 7.54 9.46 5.82 12 5.82Z"
                      fill="#EA4335"
                    />
                  </svg>
                </span>
                Continue with Google
              </button>

              <p className="text-xs leading-5 text-slate-400">
                By continuing, you agree to our{" "}
                <a href="#" className="font-medium text-slate-600 transition hover:text-slate-950 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-slate-600 transition hover:text-slate-950 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>

          <div className="relative min-h-[24rem] overflow-hidden bg-white lg:min-h-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.05),_transparent_36%),linear-gradient(180deg,_rgba(255,255,255,0.9),_rgba(248,250,252,0.95))]" />
            <div className="absolute inset-0 p-4 sm:p-6 lg:p-8">
              <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100 p-3 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
                <AnimatePresence mode="wait">
                  {currentImage ? (
                    <motion.div
                      key={currentImage}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="relative h-full overflow-hidden rounded-[1.5rem]"
                    >
                      <Image
                        src={currentImage}
                        alt="Robotics society gallery image"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />

                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex h-full items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-slate-100 to-slate-200"
                    >
                      <div className="grid w-full max-w-md gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                        <div className="h-72 rounded-[1.5rem] bg-gradient-to-br from-slate-300/60 via-slate-200 to-white" />
                        <div className="grid gap-4">
                          <div className="h-32 rounded-[1.25rem] bg-white" />
                          <div className="h-32 rounded-[1.25rem] bg-slate-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;