import { cn } from "@/lib/utils";
import { EVENT_TYPE_ICONS, EVENT_TYPE_LABELS, EVENT_TYPE_STYLES } from "@/lib/constants";
import type { CalendarEvent } from "@/lib/types/database";

type Props = {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
};

function formatTime(iso: string, allDay: boolean): string {
  if (allDay) return "";
  return new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function EventItem({ event, onClick }: Props) {
  const style = EVENT_TYPE_STYLES[event.type];
  const time  = formatTime(event.start_at, event.all_day);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      title={EVENT_TYPE_LABELS[event.type]}
      className={cn(
        "w-full text-left flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium leading-tight truncate",
        "transition-opacity hover:opacity-80 cursor-pointer",
        style.bg,
        style.text,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", style.dot)} />
      {!event.all_day && time && (
        <span className="opacity-70 shrink-0">{time}</span>
      )}
      <span className="truncate">{event.title}</span>
      <span className="material-symbols-outlined !text-[10px] shrink-0 opacity-60">
        {EVENT_TYPE_ICONS[event.type]}
      </span>
    </button>
  );
}
