import Link from "next/link";
import { cn } from "@/lib/utils";

type LeadPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  buildHref: (page: number) => string;
};

export function LeadPagination({
  page,
  pageSize,
  total,
  buildHref,
}: LeadPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible =
    totalPages <= 5
      ? pages
      : pages.filter(
          (p) =>
            p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1),
        );

  return (
    <div className="px-6 py-4 bg-ivory border-t border-border-cream flex items-center justify-between flex-wrap gap-3">
      <p className="text-sm text-olive-gray">
        Hiển thị{" "}
        <span className="font-semibold text-near-black">
          {from}-{to}
        </span>{" "}
        /{" "}
        <span className="font-semibold text-near-black">{total}</span>{" "}
        kết quả
      </p>
      <div className="flex gap-2 items-center">
        <PaginationButton
          disabled={page <= 1}
          href={buildHref(page - 1)}
          ariaLabel="Trang trước"
          icon="chevron_left"
        />
        {visible.map((p, idx) => {
          const prev = visible[idx - 1];
          const gap = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-2">
              {gap ? (
                <span className="text-stone-gray text-sm px-1">…</span>
              ) : null}
              <Link
                href={buildHref(p)}
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full transition-colors text-sm",
                  p === page
                    ? "bg-white text-near-black border border-terracotta shadow-sm"
                    : "bg-ivory text-olive-gray border border-border-warm hover:bg-warm-sand",
                )}
              >
                {p}
              </Link>
            </span>
          );
        })}
        <PaginationButton
          disabled={page >= totalPages}
          href={buildHref(page + 1)}
          ariaLabel="Trang sau"
          icon="chevron_right"
        />
      </div>
    </div>
  );
}

function PaginationButton({
  disabled,
  href,
  ariaLabel,
  icon,
}: {
  disabled: boolean;
  href: string;
  ariaLabel: string;
  icon: string;
}) {
  const className = cn(
    "flex items-center justify-center w-9 h-9 rounded-full border transition-colors",
    disabled
      ? "bg-warm-sand text-warm-silver border-ring-warm cursor-not-allowed pointer-events-none opacity-50"
      : "bg-ivory text-olive-gray border-border-warm hover:bg-warm-sand",
  );
  if (disabled) {
    return (
      <span aria-label={ariaLabel} className={className}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </span>
    );
  }
  return (
    <Link aria-label={ariaLabel} href={href} className={className}>
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </Link>
  );
}
