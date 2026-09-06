"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApplicantType } from "@/types";
import { TiltCard } from "@/components/ui/TiltCard";
import { useScrambleText } from "@/hooks/useScrambleText";
import { XCircle } from "lucide-react";

// --- CYBER DINO (Emerald / Accepted State) ---
const CyberDino = () => {
  return (
    <motion.div
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)] inline-block"
    >
      <svg 
        viewBox="0 0 24 24" 
        className="w-12 h-12 sm:w-14 sm:h-14"
        xmlns="http://www.w3.org/2000/svg" 
        shapeRendering="crispEdges" 
      >
        <defs>
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g fill="#1E293B">
          <rect x="14" y="2" width="7" height="1" />
          <rect x="14" y="3" width="8" height="1" />
          <rect x="14" y="4" width="9" height="1" />
          <rect x="14" y="5" width="9" height="1" />
          <rect x="14" y="6" width="4" height="1" />
          <rect x="14" y="7" width="5" height="1" />
          <rect x="13" y="8" width="4" height="1" />
          <rect x="10" y="9" width="6" height="1" />
          <rect x="8" y="10" width="7" height="1" />
          <rect x="6" y="11" width="9" height="1" />
          <rect x="4" y="12" width="11" height="1" />
          <rect x="2" y="13" width="13" height="1" />
          <rect x="2" y="14" width="12" height="1" />
          <rect x="2" y="15" width="10" height="1" />
          <rect x="16" y="0" width="1" height="2" />
          <rect x="17" y="1" width="1" height="1" />
          <rect x="6" y="16" width="3" height="2" />
          <rect x="11" y="16" width="3" height="2" />
          <rect x="15" y="10" width="3" height="1" />
          <rect x="17" y="11" width="1" height="1" />
        </g>
        <g fill="#10b981" filter="url(#neonGlow)">
          <rect x="15" y="3" width="4" height="1" />
          <rect x="10" y="11" width="2" height="2" />
          <rect x="16" y="0" width="1" height="1" fill="#FF0055" />
        </g>
        <g fill="#10b981" opacity="0.9" filter="url(#neonGlow)">
          <rect x="6.5" y="18" width="2" height="2" />
          <rect x="11.5" y="18" width="2" height="2" />
        </g>
        <g fill="#10b981" opacity="0.4">
          <rect x="7" y="20" width="1" height="2" />
          <rect x="12" y="20" width="1" height="2" />
          <rect x="7" y="22" width="1" height="1" opacity="0.5" />
          <rect x="12" y="22" width="1" height="1" opacity="0.5" />
        </g>
      </svg>
    </motion.div>
  );
};

// --- MALFUNCTION DINO (Rose Red / Rejected State) ---
const MalfunctionDino = () => {
  return (
    <motion.div
      // Sputtering, glitchy animation
      animate={{ 
        opacity: [1, 1, 0.8, 1, 0.3, 1, 1],
        x: [0, 0, -1, 1, -2, 2, 0]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "circInOut" }}
      className="relative z-10 drop-shadow-[0_0_8px_rgba(225,29,72,0.5)] inline-block"
    >
      <svg 
        viewBox="0 0 24 24" 
        className="w-10 h-10 sm:w-12 sm:h-12"
        xmlns="http://www.w3.org/2000/svg" 
        shapeRendering="crispEdges" 
        style={{ transform: "scaleX(-1)" }} // Flipped to face inward
      >
        <defs>
          <filter id="neonRedGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g fill="#1E293B">
          <rect x="14" y="2" width="7" height="1" />
          <rect x="14" y="3" width="8" height="1" />
          <rect x="14" y="4" width="9" height="1" />
          <rect x="14" y="5" width="9" height="1" />
          <rect x="14" y="6" width="4" height="1" />
          <rect x="14" y="7" width="5" height="1" />
          <rect x="13" y="8" width="4" height="1" />
          <rect x="10" y="9" width="6" height="1" />
          <rect x="8" y="10" width="7" height="1" />
          <rect x="6" y="11" width="9" height="1" />
          <rect x="4" y="12" width="11" height="1" />
          <rect x="2" y="13" width="13" height="1" />
          <rect x="2" y="14" width="12" height="1" />
          <rect x="2" y="15" width="10" height="1" />
          <rect x="16" y="0" width="1" height="2" />
          <rect x="17" y="1" width="1" height="1" />
          <rect x="6" y="16" width="3" height="2" />
          <rect x="11" y="16" width="3" height="2" />
          <rect x="15" y="10" width="3" height="1" />
          <rect x="17" y="11" width="1" height="1" />
        </g>

        {/* Dimmer, damaged red neon accents */}
        <g fill="#e11d48" filter="url(#neonRedGlow)">
          {/* Smashed Visor Eye */}
          <rect x="15" y="3" width="2" height="1" />
          {/* Flickering Chest Power Core */}
          <rect x="10" y="11" width="2" height="2" opacity="0.5" />
        </g>
        
        {/* Ground shadow (since it's not floating) */}
        <rect x="4" y="19" width="12" height="1" fill="#cbd5e1" opacity="0.4" />

        {/* Animated Sparks flying off the broken antenna */}
        <g fill="#e11d48" filter="url(#neonRedGlow)">
           <motion.rect 
             animate={{ opacity: [0, 1, 0, 0], y: [0, -2, -4, -4], x: [0, 1, 2, 2] }} 
             transition={{ duration: 1.2, repeat: Infinity }} 
             x="18" y="-1" width="1" height="1" 
           />
           <motion.rect 
             animate={{ opacity: [0, 0, 1, 0], y: [0, 0, -2, -3], x: [0, 0, -1, -2] }} 
             transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} 
             x="16" y="-2" width="1" height="1" 
           />
        </g>
      </svg>
    </motion.div>
  );
};
// --------------------------------------------

const BOOT_SEQUENCE = [
  "INITIALIZING SYS.MODULE...",
  "ESTABLISHING SECURE CONNECTION...",
  "DECRYPTING APPLICANT PROFILE...",
  "VALIDATING CLEARANCE LEVEL...",
  "STATUS: GRANTED"
];

export const ResultDashboard = ({ applicant }: { applicant: ApplicantType }) => {
  const isAccepted = applicant.status === "accepted";
  const [mounted, setMounted] = useState(false);
  const [bootStep, setBootStep] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const [latency, setLatency] = useState(12);

  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setMounted(true);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= BOOT_SEQUENCE.length) {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 400); 
      } else {
        setBootStep(step);
      }
    }, 300);

    const latencyInterval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 15) + 8); 
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(latencyInterval);
    };
  }, []);

  const { displayText: scrambleTitle, isComplete: scrambleComplete } = useScrambleText(
    isAccepted ? "You've been Selected!" : "Not Selected this time",
    1800, 
    1200 
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden bg-white selection:bg-gray-200 text-gray-900 font-sans">
      
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />
      
      <AnimatePresence>
        {!bootComplete && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "anticipate" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white"
          >
            <div className="font-mono text-sm sm:text-base text-gray-800 space-y-2 text-left">
              {BOOT_SEQUENCE.slice(0, bootStep + 1).map((text, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-gray-400">[{i}]</span>
                  <span className={i === BOOT_SEQUENCE.length - 1 ? "text-emerald-600 font-bold" : ""}>
                    {text}
                  </span>
                </motion.div>
              ))}
              <motion.div 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.5 }} 
                className="w-3 h-5 bg-gray-800 mt-2"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white z-0 pointer-events-none" 
      />

      {/* HUD Elements (Top Left) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: bootComplete ? 1 : 0, x: bootComplete ? 0 : -20 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-8 flex flex-col gap-1 text-[10px] sm:text-xs font-mono text-gray-400 tracking-wider z-10 pointer-events-none hidden sm:flex"
      >
        <span className="animate-[glitch_4s_infinite]">[_SYS.STATUS::AUTHORIZED]</span>
        <span>[ID: {applicant.name.toUpperCase().replace(/\s+/g, '-').slice(0,12)}-73]</span>
        <span className="text-emerald-600/80">LATENCY: {latency}ms</span>
      </motion.div>

      {/* HUD Elements (Bottom Right) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: bootComplete ? 1 : 0, x: bootComplete ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-8 right-8 flex flex-col items-end gap-1 text-[10px] sm:text-xs font-mono text-gray-400 tracking-wider z-10 pointer-events-none hidden sm:flex"
      >
        <span>{new Date().toISOString().split('T')[0]}</span>
        <span>NODE: ALPHA-01</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>LINK_STABLE</span>
      </motion.div>

      {/* HUD Crosshairs */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: bootComplete ? 1 : 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200/50 origin-top"
        />
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: bootComplete ? 1 : 0 }}
          transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
          className="absolute top-1/2 left-0 right-0 h-px bg-gray-200/50 origin-left"
        />
      </div>

      <div className="relative z-20 w-full max-w-2xl mx-auto px-4" style={{ perspective: "1000px" }}>
        {bootComplete && (
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <TiltCard className="w-full">
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ 
                  type: "spring",
                  damping: 20,
                  stiffness: 200,
                }}
                className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-200/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 sm:p-12 text-center"
              >
                
                <motion.div
                  className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
                  animate={{ opacity: isHovering ? 1 : 0 }}
                  style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.04), transparent 40%)`
                  }}
                />

                <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite_linear] bg-gradient-to-r from-transparent via-white/40 to-transparent z-30 pointer-events-none mix-blend-overlay" />
                
                <div className="relative z-40 flex flex-col items-center gap-6">
                  
                  {/* Top Circle Icon Area */}
                  <motion.div
                    initial={{ rotate: -180, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.3 }}
                    className={`flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border shadow-[0_0_20px_rgba(0,0,0,0.05)] relative ${isAccepted ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-700'}`}
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 rounded-full border ${isAccepted ? 'border-emerald-400' : 'border-rose-400'}`}
                    />
                    
                    {isAccepted ? (
                      <CyberDino />
                    ) : (
                      <XCircle className="w-10 h-10 sm:w-12 sm:h-12 relative z-10" />
                    )}
                  </motion.div>

                  <div className="min-h-[48px]">
                    <h1 
                        className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isAccepted ? 'text-emerald-600 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-rose-700 drop-shadow-[0_0_8px_rgba(225,29,72,0.5)]'}`}
                        style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: "1.5" }}
                    >
                      {scrambleTitle}
                      {!scrambleComplete && <span className="animate-pulse ml-1 opacity-50">_</span>}
                    </h1>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="space-y-6 w-full"
                  >
                    {isAccepted ? (
                      <div className="space-y-4">
                        <p className="text-gray-600 leading-relaxed max-w-lg mx-auto text-lg" style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem" }}>
                          We are glad to accept you as a member of our society, let's build cool stuff together. 
                        </p>
                        <div className="pt-6 border-t border-gray-100 flex justify-center">
                          <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-4 py-1.5 text-xs font-mono text-emerald-700 ring-1 ring-inset ring-emerald-600/20 shadow-inner">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[ping_1s_infinite]" />
                            STATUS: ACTIVE MEMBER
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto" style={{ fontFamily: "'VT323', monospace", fontSize: "1.2rem" }}>
                          You will get further updates about upcoming workshops via website/whatsapp so stay tuned.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-600 leading-relaxed max-w-lg mx-auto" style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem" }}>
                          Your interview did not qualify but that doesn't mean you can't join! As long as you show enthusiasm towards the club and join in workshops and various events you can always apply again by consulting one of the core members. 
                        </p>
                        
                        {/* Injected Malfunction Dino for Rejected State */}
                        <div className="pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
                           <MalfunctionDino />
                           <p className="text-sm font-bold text-rose-800 tracking-widest uppercase" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}>
                             GAME OVER? NEVER.
                           </p>
                        </div>
                        
                      </div>
                    )}
                  </motion.div>

                </div>
              </motion.div>
            </TiltCard>
          </motion.div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes glitch {
          0%, 100% { transform: translate(0); text-shadow: none; }
          2% { transform: translate(-2px, 1px); text-shadow: 2px 0 rgba(16,185,129,0.5), -2px 0 rgba(16,185,129,0.5); }
          4% { transform: translate(2px, -1px); text-shadow: -2px 0 rgba(16,185,129,0.5), 2px 0 rgba(16,185,129,0.5); }
          6% { transform: translate(0); text-shadow: none; }
        }
      `}} />
    </div>
  );
};