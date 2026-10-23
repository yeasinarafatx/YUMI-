import Link from "next/link";
import { Sparkles } from "lucide-react";

interface AnnouncementBarProps {
  ticker?: {
    is_active?: boolean;
    primary_text?: string;
    secondary_text?: string;
    speed_seconds?: number;
  } | null;
  text?: string | null;
}

export function AnnouncementBar({ ticker, text }: AnnouncementBarProps) {
  // If explicitly disabled by admin, hide completely
  if (ticker && ticker.is_active === false) {
    return null;
  }

  // Get announcements from admin settings
  const primary = ticker?.primary_text?.trim() || text?.trim();
  const secondary = ticker?.secondary_text?.trim();

  // If no text is configured, do not render
  if (!primary && !secondary) {
    return null;
  }

  const messages: string[] = [];
  if (primary) messages.push(primary);
  if (secondary) messages.push(secondary);

  return (
    <div className="relative overflow-hidden bg-accent text-on-accent border-b border-white/10 group select-none py-2">
      <Link href="/shop" className="block focus:outline-none" aria-label="Announcement">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] group-hover:[animation-play-state:paused]">
          {/* Repeat messages 4 times to fill any wide screen smoothly */}
          {[...messages, ...messages, ...messages, ...messages].map((msg, idx) => (
            <div key={idx} className="flex items-center gap-3 px-8 shrink-0">
              <Sparkles size={11} className="text-gold shrink-0 animate-pulse" />
              <span className="text-[0.6875rem] font-medium tracking-wider text-cream">
                {msg}
              </span>
              <span className="text-white/30 text-xs ml-3" aria-hidden="true">✦</span>
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}
