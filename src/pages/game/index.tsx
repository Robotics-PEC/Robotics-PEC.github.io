import { useState, useRef, useEffect } from "react";
import fpPromise from "@fingerprintjs/fingerprintjs";
import DinoGame, { preloadDinoAssets } from "./DinoGame";
import FeedbackForm, { FeedbackData } from "@/components/FeedbackForm";
import { useAuthRole } from "@/lib/useAuthRole";
import NotFound from "@/pages/404";
import { client } from "@/lib/supabase/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function GamePage() {
  const { role, loading: roleLoading } = useAuthRole();
  const isPanelist = role && (role.slug === "admin" || role.slug.includes("panel"));
  
  const [isGameEnabled, setIsGameEnabled] = useState<boolean | null>(null);
  const [isResultsPublished, setIsResultsPublished] = useState<boolean | null>(null);
  const [branchLeaderboard, setBranchLeaderboard] = useState<any[]>([]);
  const [isToggling, setIsToggling] = useState(false);
  const [isTogglingResults, setIsTogglingResults] = useState(false);

  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [branchTop10, setBranchTop10] = useState<Record<string, any[]>>({});
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [needsCooldown, setNeedsCooldown] = useState<boolean>(false);
  const [isReturningUser, setIsReturningUser] = useState<boolean>(false);
  const [gameKey, setGameKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPreparingGame, setIsPreparingGame] = useState<boolean>(false);
  const [assetsReady, setAssetsReady] = useState<boolean>(false);
  const [assetLoadError, setAssetLoadError] = useState<boolean>(false);
  
  const leaderboardRef = useRef<HTMLDivElement>(null);

  const fetchLeaderboardData = async (currentDeviceId: string) => {
    try {
      const res = await fetch("/api/game/leaderboard");
      if (res.ok) {
        const data = await res.json();
        if (data && data.top50) {
          setLeaderboard(data.top50);
        }
        if (data && data.allBranches) {
          setBranchLeaderboard(data.allBranches);
        }
        if (data && typeof data.isGameEnabled === "boolean") {
          setIsGameEnabled(data.isGameEnabled);
        }
        if (data && typeof data.isResultsPublished === "boolean") {
          setIsResultsPublished(data.isResultsPublished);
        }
        if (data && data.branchTop10) {
          setBranchTop10(data.branchTop10);
        }
        
        // 3. Check if user already played
        if (data && data.allDeviceIds && data.allDeviceIds.includes(currentDeviceId)) {
          setNeedsCooldown(true);
          setIsReturningUser(true);
          const localFeedback = localStorage.getItem("rpec_dino_fb_v2");
          if (localFeedback) {
            setFeedbackData(JSON.parse(localFeedback));
          }
        }
      }
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    }
  };

  useEffect(() => {
    if (feedbackData) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [feedbackData]);

  useEffect(() => {
    if (
      isLoading ||
      roleLoading ||
      isGameEnabled === false
    ) {
      return;
    }

    let cancelled = false;

    const prepareAssets = async () => {
      setAssetLoadError(false);

      try {
        await preloadDinoAssets();

        if (!cancelled) {
          setAssetsReady(true);
        }
      } catch (error) {
        console.error(
          "Failed to preload Dino assets:",
          error,
        );

        if (!cancelled) {
          setAssetsReady(false);
          setAssetLoadError(true);
        }
      }
    };

    void prepareAssets();

    return () => {
      cancelled = true;
    };
  }, [
    isLoading,
    roleLoading,
    isGameEnabled,
  ]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const init = async () => {
      try {
        // 1. Generate fingerprint
        const fp = await fpPromise.load();
        const result = await fp.get();
        const currentDeviceId = result.visitorId;
        setDeviceId(currentDeviceId);

        // 2. Failsafe: check localStorage first!
        try {
          const localFeedback = localStorage.getItem("rpec_dino_fb_v2");
          if (localFeedback) {
            setFeedbackData(JSON.parse(localFeedback));
            setNeedsCooldown(true);
          }
        } catch {}

        // 3. Fetch initial leaderboard and verify against Google Sheets
        await fetchLeaderboardData(currentDeviceId);

        // 4. Setup fast polling with Jitter to prevent stampedes (10s + up to 5s random delay)
        const pollLeaderboard = async () => {
          await fetchLeaderboardData(currentDeviceId);
          const jitterMs = Math.floor(Math.random() * 5000);
          timeoutId = setTimeout(pollLeaderboard, 10000 + jitterMs);
        };
        
        // Start the polling cycle
        timeoutId = setTimeout(pollLeaderboard, 10000 + Math.floor(Math.random() * 5000));

      } catch (err) {
        console.error("Failed to init game data", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const scrollToLeaderboard = () => {
    leaderboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGameOver = async (score: number) => {
    if (!deviceId) return;
    if (!feedbackData && !isReturningUser) return;

    // Use actual feedback data if we have it, otherwise just send the bare minimum for the backend to update the score
    const payload = feedbackData ? {
      ...feedbackData,
      deviceId,
      score,
      timestamp: new Date().toISOString(),
    } : {
      deviceId,
      score,
      timestamp: new Date().toISOString(),
      sid: "returning_user", // Fallback SID so Google Apps Script doesn't complain about undefined
      name: "Returning User", // These will be completely ignored by Google Apps Script anyway!
      branch: "Returning",
    };

    console.log("Game Over! Securing and sending payload to backend...");
    
    // OPTIMISTIC UPDATE: Instantly put user's score on the board locally
    setLeaderboard((prev) => {
      // Try to find their real name from the existing leaderboard if they didn't have local feedbackData
      const existingPlayer = prev.find(p => p.deviceId === deviceId);
      const optimisticPlayer = {
        ...payload,
        name: feedbackData?.name || existingPlayer?.name || "You (Updating...)",
        branch: feedbackData?.branch || existingPlayer?.branch || "Updating..."
      };
      
      // Remove any existing entry for this device ID first to prevent duplicates
      const filteredPrev = prev.filter(p => p.deviceId !== deviceId);
      const newLeaderboard = [...filteredPrev, optimisticPlayer].sort((a, b) => b.score - a.score);
      return newLeaderboard.slice(0, 50); // keep top 50
    });

    // Instantly lock out, UNLESS it's the exempt testing SID
    if (feedbackData?.sid !== "24106969") {
      setNeedsCooldown(true);
      try { localStorage.setItem("rpec_dino_played_v2", "true"); } catch{}
    }
    
    scrollToLeaderboard();

    // Send payload in the background
    try {
      await fetch("/api/game/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log("Successfully securely saved score!");
    } catch (error) {
      console.error("Failed to securely send data:", error);
    }
  };

  const handlePlayAgain = () => {
    setNeedsCooldown(true);
    setGameKey(k => k + 1);
  };

  const handleToggleGame = async () => {
    setIsToggling(true);
    try {
      const { data: { session } } = await client.auth.getSession();
      
      const res = await fetch("/api/game/toggle", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`
        },
        body: JSON.stringify({ enabled: !isGameEnabled })
      });
      if (res.ok) {
        setIsGameEnabled(!isGameEnabled);
      } else {
        console.error("Toggle failed with status:", res.status);
      }
    } catch (err) {
      console.error("Failed to toggle game", err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleToggleResults = async () => {
    setIsTogglingResults(true);
    try {
      const { data: { session } } = await client.auth.getSession();
      
      const res = await fetch("/api/game/toggle", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`
        },
        body: JSON.stringify({ action: "toggleResults", resultsPublished: !isResultsPublished })
      });
      if (res.ok) {
        setIsResultsPublished(!isResultsPublished);
      } else {
        console.error("Toggle results failed with status:", res.status);
      }
    } catch (err) {
      console.error("Failed to toggle results", err);
    } finally {
      setIsTogglingResults(false);
    }
  };

  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-[#F6F6F7] flex items-center justify-center p-4">
        <div className="text-slate-500 animate-pulse">Loading Game Data...</div>
      </div>
    );
  }

  const AdminControls = () => {
    if (!isPanelist || isGameEnabled === null) return null;
    return (
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-3">
        <button 
          onClick={handleToggleGame}
          disabled={isToggling}
          className={`px-6 py-2 rounded-full font-bold text-white shadow-lg transition-opacity ${isToggling ? 'opacity-50' : ''} ${isGameEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isToggling ? "Toggling..." : isGameEnabled ? "Disable Game Globally" : "Enable Game Globally"}
        </button>
        {isGameEnabled === false && (
          <button 
            onClick={handleToggleResults}
            disabled={isTogglingResults}
            className={`px-6 py-2 rounded-full font-bold text-white shadow-lg transition-opacity ${isTogglingResults ? 'opacity-50' : ''} ${isResultsPublished ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isTogglingResults ? "Toggling..." : isResultsPublished ? "Hide Results View" : "Publish Results View"}
          </button>
        )}
      </div>
    );
  };

  // Handle disabled game states
  if (isGameEnabled === false) {
    if (isResultsPublished) {
      return (
        <div className="min-h-screen bg-slate-50 relative">
          <AdminControls />
          <ResultsView branchTop10={branchTop10} />
        </div>
      );
    } else {
      if (!isPanelist) {
        return <NotFound />;
      }
      // Panelist: game is disabled, results not yet published — show holding screen with controls
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
          <AdminControls />
          <div className="text-center max-w-md mt-16">
            <div className="text-blue-600 font-mono text-xs tracking-[0.3em] uppercase mb-4 border border-blue-200 bg-blue-50 px-4 py-1.5 rounded-full inline-block">
              [ PANELIST VIEW ]
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Game is Disabled</h2>
            <p className="text-slate-500 text-sm">Results are not published yet. Use the controls above to publish results when ready.</p>
          </div>
        </div>
      );
    }
  }



  if (!feedbackData && !isReturningUser) {
    return (
      <div className="min-h-screen bg-[#F6F6F7] flex flex-col items-center justify-center p-4 relative">
        <AdminControls />
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border p-6 md:p-8 mt-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Play Dino Run</h1>
            <p className="text-slate-500">Please provide your feedback first to unlock the game!</p>
          </div>
          <FeedbackForm
            isPreparingGame={isPreparingGame}
            onContinue={async (data: FeedbackData) => {
              setIsPreparingGame(true);
              setAssetLoadError(false);

              try {
                await preloadDinoAssets();
                setAssetsReady(true);
                setFeedbackData(data);
              } catch (error) {
                console.error(
                  "Dino assets are not ready:",
                  error,
                );
                setAssetLoadError(true);
              } finally {
                setIsPreparingGame(false);
              }
            }}
          />

          {assetLoadError && (
            <div
              role="alert"
              className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              The game assets could not be loaded. Please press Continue again.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!assetsReady) {
    return (
      <div className="min-h-screen bg-[#061820] flex flex-col items-center justify-center p-4 text-white">
        <div className="text-center">
          <div className="text-xl font-semibold tracking-wide">
            {assetLoadError
              ? "Game assets could not be loaded"
              : "Preparing the game..."}
          </div>
          <p className="mt-2 text-sm text-white/60">
            {assetLoadError
              ? "Please refresh the page and try again."
              : "Please wait a moment while the game is prepared."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061820] flex flex-col items-center">
      <AdminControls />
      <div className="w-full relative">
        <DinoGame key={gameKey} onGameOver={handleGameOver} needsCooldown={needsCooldown} onPlayAgain={handlePlayAgain} />
        
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={scrollToLeaderboard}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur transition-colors"
          >
            See Leaderboard ↓
          </button>
        </div>
      </div>

      <LeaderboardSection leaderboard={leaderboard} branchTop10={branchTop10} leaderboardRef={leaderboardRef} />
      <BranchLeaderboardSection branchLeaderboard={branchLeaderboard} />
    </div>
  );
}

function ResultsView({ branchTop10 }: { branchTop10: Record<string, any[]> }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Extract the #1 player from each branch
  const winners = Object.entries(branchTop10)
    .map(([branchName, players]) => {
      return {
        branch: branchName,
        player: players[0] // The top player is always index 0 because it's sorted in the backend
      };
    })
    .filter(w => w.player) // Make sure a player exists
    .sort((a, b) => b.player.score - a.player.score); // Sort winners globally

  const topWinner = winners.length > 0 ? winners[0] : null;
  const [featuredBranch, setFeaturedBranch] = useState<string | null>(null);

  useEffect(() => {
    if (winners.length > 0 && !featuredBranch) {
      setFeaturedBranch(winners[0].branch);
    }
  }, [winners, featuredBranch]);

  useEffect(() => {
    if (currentSlide === 0) {
      const timer = setTimeout(() => setCurrentSlide(1), 5000);
      return () => clearTimeout(timer);
    } else if (currentSlide === 1) {
      const timer = setTimeout(() => setCurrentSlide(2), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  const featuredWinner = winners.find(w => w.branch === featuredBranch) || topWinner;
  const gridWinners = winners.filter(w => w.branch !== featuredBranch);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center overflow-hidden font-sans relative">
      {/* Background Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_10%,transparent_100%)] pointer-events-none z-0"></div>

      <AnimatePresence mode="wait">
        {currentSlide === 0 && (
          <motion.div 
            key="slide0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl text-center z-10 w-full min-h-[80vh]"
          >
            <div className="text-blue-600 font-mono text-sm tracking-[0.3em] uppercase mb-8 border border-blue-200 bg-blue-50/50 px-4 py-1.5 rounded-full inline-block">
              [ SYSTEM INITIALIZATION ]
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              We engineered this challenge to test your absolute limits.
            </h2>
            <button onClick={() => setCurrentSlide(2)} className="mt-12 text-slate-400 hover:text-blue-600 font-mono text-sm tracking-wider transition-colors">
              &gt; SKIP_SEQUENCE
            </button>
          </motion.div>
        )}

        {currentSlide === 1 && (
          <motion.div 
            key="slide1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl text-center z-10 w-full min-h-[80vh]"
          >
            <div className="text-blue-600 font-mono text-sm tracking-[0.3em] uppercase mb-8 border border-blue-200 bg-blue-50/50 px-4 py-1.5 rounded-full inline-block">
              [ DATA COMPILED ]
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Hundreds played.
              <br/><span className="text-blue-600">But a few conquered.</span>
            </h2>
            <p className="text-slate-500 text-xl mt-6 tracking-wide">
              It is time to reveal the Grand Champions of each branch.
            </p>
            <button onClick={() => setCurrentSlide(2)} className="mt-12 text-slate-400 hover:text-blue-600 font-mono text-sm tracking-wider transition-colors">
              &gt; SKIP_SEQUENCE
            </button>
          </motion.div>
        )}

        {currentSlide === 2 && (
          <motion.div 
            key="slide2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col items-center z-10"
          >
            <div className="text-center mb-16 relative w-full">
              <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full"></div>
              <h1 className="relative text-5xl md:text-7xl font-extrabold text-slate-900 mb-4 tracking-tight drop-shadow-sm">
                GRAND CHAMPIONS
              </h1>
              <p className="relative text-xl md:text-2xl text-blue-600 font-mono tracking-widest uppercase font-semibold">The Best of Each Branch</p>
            </div>

            {featuredWinner && (
              <motion.div 
                layoutId={`card-${featuredWinner.branch}`}
                className="w-full max-w-4xl bg-white border border-blue-200 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col mb-16 group"
              >
                {/* Cool swirling blue light border effect via a massive pseudo-element that spins behind a mask */}
                <div className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(59,130,246,0.3)_360deg)] animate-[spin_4s_linear_infinite] pointer-events-none transition-opacity duration-500"></div>
                
                {/* The actual interior background that blocks the swirl from showing anywhere except the borders */}
                <div className="absolute inset-1 bg-white rounded-[22px] z-0"></div>

                {/* Tech Accents for the top card */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 z-0"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.div layoutId={`rank-${featuredWinner.branch}`} className="flex flex-wrap justify-center items-center gap-4 mb-8">
                    <span className="text-blue-700 bg-blue-50 font-mono text-sm tracking-widest uppercase px-3 py-1.5 rounded-lg border border-blue-100 font-semibold shadow-sm">
                      Global Rank #{featuredWinner.player.globalRank}
                    </span>
                    <span className="text-slate-300 font-mono text-sm hidden sm:inline">|</span>
                    <span className="text-slate-700 font-mono text-xl font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{featuredWinner.player.score.toLocaleString()} PTS</span>
                  </motion.div>
                  
                  <motion.h3 layoutId={`name-${featuredWinner.branch}`} className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
                    {featuredWinner.player.name}
                  </motion.h3>

                  {/* Easter Egg: Only show this specific lore for the true Global Rank #1 */}
                  {featuredWinner.player.globalRank === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 max-w-2xl w-full mb-8 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                      <div className="text-blue-600 font-mono text-xs tracking-[0.2em] uppercase mb-3 font-bold flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        [ SYSTEM ANOMALY DETECTED ]
                      </div>
                      <p className="text-slate-600 font-mono text-sm leading-relaxed">
                        &gt; LOG: This user found a matrix exploit to achieve this score. <br/>
                        &gt; STATUS: Genius enough to execute it. Absolute Respect.
                      </p>
                    </motion.div>
                  )}
                  
                  <div className="mt-4 pt-8 border-t border-slate-100 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <motion.p layoutId={`branch-${featuredWinner.branch}`} className="text-lg font-bold text-slate-600 uppercase tracking-widest flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]"></span>
                      {featuredWinner.branch}
                    </motion.p>
                    
                    <div className="text-slate-400 font-mono text-xs tracking-[0.2em]">
                      [ DATA VERIFIED ]
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {gridWinners.map((winner) => (
                <motion.div 
                  key={winner.branch}
                  layoutId={`card-${winner.branch}`}
                  onClick={() => setFeaturedBranch(winner.branch)}
                  className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors"></div>
                  
                  <motion.div layoutId={`rank-${winner.branch}`} className="flex items-center justify-between mb-6 relative z-10">
                    <span className="text-slate-500 font-mono text-xs tracking-widest uppercase bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      Global #{winner.player.globalRank}
                    </span>
                    <span className="text-blue-600 font-bold font-mono text-xl">{winner.player.score.toLocaleString()}</span>
                  </motion.div>
                  
                  <motion.h3 layoutId={`name-${winner.branch}`} className="text-2xl font-bold text-slate-900 mb-2 relative z-10 truncate" title={winner.player.name}>
                    {winner.player.name}
                  </motion.h3>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100 relative z-10">
                    <motion.p layoutId={`branch-${winner.branch}`} className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {winner.branch}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </div>

            {winners.length === 0 && (
              <div className="text-slate-400 font-mono text-lg animate-pulse mt-12">[ NO DATA_FOUND ]</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Extracted Leaderboard UI into a small component so we can reuse it easily
function LeaderboardSection({ leaderboard, branchTop10, leaderboardRef }: { leaderboard: any[], branchTop10: Record<string, any[]>, leaderboardRef: any }) {
  const [selectedBranch, setSelectedBranch] = useState<string>("Overall");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const branches = ["Overall", ...Object.keys(branchTop10).sort()];
  const isFiltered = selectedBranch !== "Overall";
  const displayData = isFiltered ? (branchTop10[selectedBranch] || []) : leaderboard;

  return (
    <div 
      ref={leaderboardRef} 
      className="w-full max-w-4xl px-4 py-16"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            🏆 {isFiltered ? selectedBranch : 'Top Players Leaderboard'}
          </h2>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span className="hidden sm:inline">{selectedBranch === 'Overall' ? 'All Branches' : selectedBranch}</span>
              <span className="sm:hidden">Filter</span>
              <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                {branches.length <= 1 ? (
                  <div className="px-4 py-3 text-sm text-slate-400 animate-pulse">Fetching branches...</div>
                ) : (
                  branches.map((branch) => (
                    <button
                      key={branch}
                      onClick={() => {
                        setSelectedBranch(branch);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedBranch === branch ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      {branch === 'Overall' ? '🌐 Overall (Top 50)' : branch}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          {displayData.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-4">
              <div className="text-6xl mb-2 opacity-50">🦖</div>
              <p className="text-xl font-medium text-slate-600">{isFiltered ? 'No players from this branch yet!' : 'Be the first one to play!'}</p>
              <p className="text-sm text-slate-400">{isFiltered ? 'Be the first to represent your branch.' : 'The leaderboard is currently waiting for challengers.'}</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm z-10">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Rank</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Name</th>
                  <th scope="col" className="px-6 py-4 font-semibold">{isFiltered ? 'Global Rank' : 'Branch'}</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayData.map((player: any, index: number) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-slate-50 transition-colors ${index < 3 ? 'bg-slate-50/50' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {index === 0 ? '🥇 1st' : index === 1 ? '🥈 2nd' : index === 2 ? '🥉 3rd' : `#${index + 1}`}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {player.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {isFiltered ? `#${player.globalRank} overall` : player.branch}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-right">
                      {player.score.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function BranchLeaderboardSection({ branchLeaderboard }: { branchLeaderboard: any[] }) {
  return (
    <div className="w-full max-w-4xl px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            🏛️ Top Branches Leaderboard
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          {branchLeaderboard.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-4">
              <div className="text-6xl mb-2 opacity-50">🏛️</div>
              <p className="text-xl font-medium text-slate-600">No branch data yet!</p>
              <p className="text-sm text-slate-400">Play the game to put your branch on the map.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Rank</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Branch</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {branchLeaderboard.map((b, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-slate-50 transition-colors ${index < 3 ? 'bg-slate-50/50' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {index === 0 ? '🥇 1st' : index === 1 ? '🥈 2nd' : index === 2 ? '🥉 3rd' : `#${index + 1}`}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {b.branch}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-right">
                      {b.totalScore.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}