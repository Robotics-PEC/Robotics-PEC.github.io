import { TechTalkDetails } from "@/types";

const StreamPlayer = ({showConfig} : {showConfig: TechTalkDetails}) => {
  const src = `https://www.youtube.com/embed/live_stream?channel=${showConfig.channelId}&autoplay=0`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_0_60px_-20px_var(--color-primary)]">
      <div className="aspect-video w-full bg-black">
        <iframe
          src={src}
          title={`${showConfig.showName} live stream`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Auto-tunes to the channel&rsquo;s current live stream. If we&rsquo;re off air, you&rsquo;ll
          see the next scheduled episode.
        </p>
        <a
          href={showConfig.channelUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}

export default StreamPlayer;