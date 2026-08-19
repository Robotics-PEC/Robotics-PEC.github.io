import { useState, useRef, useEffect } from "react";
import fpPromise from "@fingerprintjs/fingerprintjs";
import DinoGame from "./DinoGame";
import FeedbackForm, { FeedbackData } from "@/components/FeedbackForm";

export default function GamePage() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [alreadyPlayed, setAlreadyPlayed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const leaderboardRef = useRef<HTMLDivElement>(null);

  const fetchLeaderboardData = async (currentDeviceId: string) => {
    try {
      const res = await fetch("/api/game/leaderboard");
      if (res.ok) {
        const data = await res.json();
        if (data && data.top50) {
          setLeaderboard(data.top50);
        }
        
        // If Google Sheets says we played, save to local storage as fallback
        if (data && data.allDeviceIds && data.allDeviceIds.includes(currentDeviceId)) {
          setAlreadyPlayed(true);
          try { localStorage.setItem("hasPlayedDinoGame", "true"); } catch(e){}
        }
      }
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    }
  };

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
          const localPlayed = localStorage.getItem("hasPlayedDinoGame");
          if (localPlayed === "true") {
            setAlreadyPlayed(true);
          }
        } catch(e){}

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
    if (!feedbackData || !deviceId) return;

    const payload = {
      ...feedbackData,
      deviceId, // Attach deviceId here
      score,
      timestamp: new Date().toISOString(),
    };

    console.log("Game Over! Securing and sending payload to backend...");
    
    // OPTIMISTIC UPDATE: Instantly put user's score on the board locally
    setLeaderboard((prev) => {
      const newLeaderboard = [...prev, payload].sort((a, b) => b.score - a.score);
      return newLeaderboard.slice(0, 50); // keep top 50
    });

    // Instantly lock out, UNLESS it's the exempt testing SID
    if (feedbackData.sid !== "24106969") {
      setAlreadyPlayed(true);
      try { localStorage.setItem("hasPlayedDinoGame", "true"); } catch(e){}
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F6F7] flex items-center justify-center p-4">
        <div className="text-slate-500 animate-pulse">Loading Game Data...</div>
      </div>
    );
  }

  // If they have already played, skip straight to the leaderboard view without rendering the game or form.
  if (alreadyPlayed) {
    return (
      <div className="min-h-screen bg-[#F6F6F7] flex flex-col items-center py-16">
        <div className="w-full max-w-4xl px-4 mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center shadow-sm">
            <h2 className="text-xl font-bold text-amber-800 mb-2">You've Already Played!</h2>
            <p className="text-amber-700">Thanks for participating. Each device is only allowed one submission. Here is how you stack up against everyone else!</p>
          </div>
        </div>
        <LeaderboardSection leaderboard={leaderboard} leaderboardRef={leaderboardRef} />
      </div>
    );
  }

  if (!feedbackData) {
    return (
      <div className="min-h-screen bg-[#F6F6F7] flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Play Dino Run</h1>
            <p className="text-slate-500">Please provide your feedback first to unlock the game!</p>
          </div>
          <FeedbackForm 
            onContinue={(data: FeedbackData) => {
              setFeedbackData(data);
            }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061820] flex flex-col items-center">
      <div className="w-full relative">
        <DinoGame onGameOver={handleGameOver} />
        
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={scrollToLeaderboard}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur transition-colors"
          >
            See Leaderboard ↓
          </button>
        </div>
      </div>

      <LeaderboardSection leaderboard={leaderboard} leaderboardRef={leaderboardRef} />
    </div>
  );
}

// Extracted Leaderboard UI into a small component so we can reuse it easily
function LeaderboardSection({ leaderboard, leaderboardRef }: { leaderboard: any[], leaderboardRef: any }) {
  return (
    <div 
      ref={leaderboardRef} 
      className="w-full max-w-4xl px-4 py-16"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            🏆 Top Players Leaderboard
          </h2>
        </div>
        
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p>Loading real scores from Google Sheets...</p>
              <p className="text-sm mt-2">The dummy data has been removed.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm z-10">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Rank</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Name</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Branch</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.map((player, index) => (
                  <tr 
                    key={player.deviceId || index} 
                    className={`hover:bg-slate-50 transition-colors ${index < 3 ? 'bg-slate-50/50' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {index === 0 ? '🥇 1st' : index === 1 ? '🥈 2nd' : index === 2 ? '🥉 3rd' : `#${index + 1}`}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {player.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {player.branch}
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