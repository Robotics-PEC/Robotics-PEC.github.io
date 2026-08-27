import { TechTalkDetails } from "@/types";
import { useEffect, useState } from "react";

const LiveChat = ({showConfig} : {showConfig: TechTalkDetails}) => {
  const [host, setHost] = useState<string | null>(null);
  useEffect(() => {
    setHost(window.location.hostname);
  }, []);

  const videoId = showConfig.currentVideoId;

  console.log(`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${host}`);

  return (
    <div className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-[#0f0f0f] lg:h-full lg:min-h-[520px]">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
        <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
          Live comments
        </h2>
      </div>

      {videoId && host ? (
        <iframe
          src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${host}&dark_theme=1`}
          title="YouTube live chat"
          className="flex-1 w-full border-0"
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Chat opens when we go live. Comments come straight from YouTube.
          </p>
          <a
            href={showConfig.channelUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            referrerPolicy="origin"
          >
            Open on YouTube
          </a>
        </div>
      )}
    </div>
  );
}

export default LiveChat;