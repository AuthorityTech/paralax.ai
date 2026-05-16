import { formatPostShareDate, formatPostShareMainTags, POST_SHARE_COLORS } from "@/lib/postShare";

interface PostShareCardProps {
  date: string;
  tags?: string[];
}

export default function PostShareCard({ date, tags }: PostShareCardProps) {
  const shareDate = formatPostShareDate(date);
  const shareTags = formatPostShareMainTags(tags);

  return (
    <div
      className="relative mb-12 aspect-[1200/630] w-full overflow-hidden rounded-[4px] border border-nothing-border text-[#171717]"
      style={{ backgroundColor: POST_SHARE_COLORS.background }}
      aria-label={`Paralax intelligence card: ${shareTags} · ${shareDate}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 18% 18%, ${POST_SHARE_COLORS.accentSoft}, transparent 28%), radial-gradient(circle at 80% 78%, ${POST_SHARE_COLORS.accentFaint}, transparent 34%)`,
        }}
      />
      <div className="absolute left-[7%] right-[7%] top-[13%] h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, ${POST_SHARE_COLORS.line}, transparent)` }} />
      <div className="absolute bottom-[16%] left-[7%] right-[7%] h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, ${POST_SHARE_COLORS.line}, transparent)` }} />
      <div className="absolute -right-[8%] -top-[20%] h-[62%] w-[42%] rounded-full border" style={{ borderColor: POST_SHARE_COLORS.line }} />
      <div className="absolute -bottom-[28%] -left-[10%] h-[58%] w-[38%] rounded-full border" style={{ borderColor: POST_SHARE_COLORS.lineSoft }} />
      <div className="absolute inset-x-[9%] bottom-[20%] flex justify-between opacity-45">
        {Array.from({ length: 36 }).map((_, idx) => (
          <span key={idx} className="h-2 w-px" style={{ backgroundColor: idx === 17 ? POST_SHARE_COLORS.accent : POST_SHARE_COLORS.tick }} />
        ))}
      </div>
      <div className="absolute inset-y-[22%] left-[20%] right-[20%] flex flex-col items-center justify-center text-center">
        <p className="font-mono text-[clamp(0.46rem,0.7vw,0.58rem)] font-medium uppercase tracking-[0.18em]" style={{ color: POST_SHARE_COLORS.muted }}>
          Paralax Intel
        </p>
        <div className="my-4 h-px w-10" style={{ backgroundColor: POST_SHARE_COLORS.accent }} />
        <p className="max-w-full text-balance font-display text-[clamp(0.9rem,1.75vw,1.55rem)] font-medium leading-tight tracking-[-0.005em]">
          {shareTags}
        </p>
        <p className="mt-4 font-mono text-[clamp(0.48rem,0.72vw,0.62rem)] font-medium uppercase tracking-[0.08em]" style={{ color: POST_SHARE_COLORS.muted }}>
          {shareDate}
        </p>
      </div>
    </div>
  );
}
