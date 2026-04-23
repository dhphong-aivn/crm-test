import { LEAD_STATUS_LABELS, LEAD_STATUS_STYLES } from "@/lib/constants";
import type { LeadStatus } from "@/lib/types/database";
import { cn } from "@/lib/utils";

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const style = LEAD_STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium ring-1",
        style.bg,
        style.text,
        style.ring,
      )}
    >
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}
