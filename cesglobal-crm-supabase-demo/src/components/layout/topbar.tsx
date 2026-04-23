import Link from "next/link";
import { getInitials } from "@/lib/utils";

type TopbarProps = {
  title?: string;
  userEmail: string;
  userName?: string | null;
  avatarUrl?: string | null;
};

export function Topbar({ title, userEmail, userName, avatarUrl }: TopbarProps) {
  const displayName = userName?.trim() || userEmail;
  const initials = getInitials(displayName);

  return (
    <header className="sticky top-0 z-40 w-full flex items-center gap-3 px-6 py-3.5 bg-ivory/90 backdrop-blur-sm border-b border-border-cream">
      {/* Mobile: hamburger + brand */}
      <div className="md:hidden flex items-center gap-2">
        <button
          type="button"
          aria-label="Menu"
          className="p-2 -ml-1 text-olive-gray hover:text-near-black hover:bg-warm-sand rounded-xl transition-colors"
        >
          <span className="material-symbols-outlined !text-[22px]">menu</span>
        </button>
        <span className="font-headline text-lg font-medium text-near-black">CRM Pro</span>
      </div>

      {title && (
        <h2 className="hidden md:block font-headline text-xl font-medium text-near-black tracking-tight">
          {title}
        </h2>
      )}

      {/* Search */}
      <div className="hidden md:flex relative flex-1 max-w-xs ml-2">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-gray !text-[18px]">
          search
        </span>
        <input
          type="search"
          placeholder="Tìm kiếm lead…"
          className="w-full pl-9 pr-4 py-2 bg-warm-sand border border-transparent rounded-xl text-[13px] placeholder:text-warm-silver focus:bg-ivory focus:border-ring-warm focus:ring-2 focus:ring-focus-blue/20 outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Add Lead CTA */}
        <Link
          href="/leads/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-terracotta text-ivory rounded-xl text-[13px] font-semibold hover:bg-coral active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined !text-[17px]">add</span>
          <span className="hidden sm:inline">Thêm Lead</span>
        </Link>

        <div className="flex items-center gap-1 ml-1 pl-3 border-l border-border-cream">
          {/* Notifications */}
          <button
            type="button"
            aria-label="Thông báo"
            className="relative p-2 text-olive-gray hover:text-near-black hover:bg-warm-sand rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined !text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta rounded-full border-2 border-ivory" />
          </button>

          {/* Settings */}
          <button
            type="button"
            aria-label="Cài đặt"
            className="p-2 text-olive-gray hover:text-near-black hover:bg-warm-sand rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined !text-[20px]">settings</span>
          </button>

          {/* Avatar */}
          <button
            type="button"
            title={displayName}
            className="ml-1 w-8 h-8 rounded-xl overflow-hidden bg-warm-sand ring-1 ring-border-cream flex items-center justify-center hover:ring-2 hover:ring-terracotta/30 transition-all"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-headline text-[12px] font-semibold text-terracotta">
                {initials}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
