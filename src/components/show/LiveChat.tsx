import { TechTalkDetails } from "@/types";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const LiveChat = ({showConfig} : {showConfig: TechTalkDetails}) => {
  const [host, setHost] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setHost(window.location.hostname);
  }, []);

  const videoId = showConfig.currentVideoId;

  console.log(`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${host}`);

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-[#0f0f0f] transition-all duration-300 ${isCollapsed ? 'h-[60px]' : 'h-[420px] lg:h-full lg:min-h-[520px]'}`}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
        <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
          Live comments
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto h-8 w-8 text-white hover:bg-white/10"
          aria-label={isCollapsed ? "Expand chat" : "Collapse chat"}
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <>
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
        </>
      )}
    </div>
  );
}

export default LiveChat;
