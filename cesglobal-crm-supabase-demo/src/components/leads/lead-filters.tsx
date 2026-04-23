"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/constants";

export function LeadFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(params.get("q") ?? "");
  const status = params.get("status") ?? "all";

  // Debounce search updates
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (search.trim()) next.set("q", search.trim());
      else next.delete("q");
      next.delete("page");
      startTransition(() => {
        router.replace(`/leads?${next.toString()}`, { scroll: false });
      });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function onStatusChange(value: string) {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete("status");
    else next.set("status", value);
    next.delete("page");
    startTransition(() => {
      router.replace(`/leads?${next.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex-1 max-w-2xl flex items-center gap-3">
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-gray">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm tên, SĐT, email…"
          className="w-full bg-ivory border border-border-warm rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-focus-blue focus:border-focus-blue outline-none transition-all placeholder:text-warm-silver"
        />
      </div>
      <div className="relative">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="form-select bg-warm-sand text-charcoal-warm border-none rounded-full py-2 pl-4 pr-10 text-sm font-medium focus:ring-1 focus:ring-focus-blue cursor-pointer"
        >
          <option value="all">Tất cả trạng thái</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
