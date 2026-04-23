import { cn } from "@/lib/utils";

type Tone = "hot" | "active" | "success" | "muted";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: string;
  tone: Tone;
  hint?: string;
};

const TONES: Record<
  Tone,
  {
    iconBg: string;
    iconColor: string;
    accentBar: string;
    badge?: string;
    badgeText?: string;
    hintColor: string;
    hintIcon: string;
  }
> = {
  hot: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentBar: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    badgeText: "HOT",
    hintColor: "text-emerald-600",
    hintIcon: "notifications_active",
  },
  active: {
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    accentBar: "bg-sky-400",
    hintColor: "text-stone-gray",
    hintIcon: "trending_up",
  },
  success: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accentBar: "bg-emerald-400",
    hintColor: "text-emerald-600",
    hintIcon: "check_circle",
  },
  muted: {
    iconBg: "bg-[#f1f0ed]",
    iconColor: "text-stone-gray",
    accentBar: "bg-warm-silver",
    hintColor: "text-stone-gray",
    hintIcon: "info",
  },
};

export function StatCard({ label, value, icon, tone, hint }: StatCardProps) {
  const t = TONES[tone];
  return (
    <div className="relative bg-ivory rounded-2xl ring-shadow whisper-shadow hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.09)] transition-all duration-200 overflow-hidden cursor-default">
      {/* Accent bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl", t.accentBar)} />

      <div className="pl-7 pr-6 py-6">
        <div className="flex items-start justify-between mb-5">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", t.iconBg)}>
            <span className={cn("material-symbols-outlined !text-[20px]", t.iconColor)}>
              {icon}
            </span>
          </div>
          {t.badgeText && (
            <span className={cn("text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full", t.badge)}>
              {t.badgeText}
            </span>
          )}
        </div>

        <p className="text-[12px] font-semibold text-stone-gray uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="font-headline text-[2.5rem] font-medium text-near-black tabular-nums leading-none">
          {value}
        </p>

        {hint && (
          <div className={cn("mt-4 pt-3 border-t border-border-cream flex items-center gap-1.5 text-[12px] font-medium", t.hintColor)}>
            <span className="material-symbols-outlined !text-[14px]">{t.hintIcon}</span>
            <span>{hint}</span>
          </div>
        )}
      </div>
    </div>
  );
}
