"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { EventItem } from "@/components/calendar/event-item";
import { EventModal } from "@/components/calendar/event-modal";
import type { CalendarEvent } from "@/lib/types/database";

// ── Types ─────────────────────────────────────────────────────────────────────

type Lead = { id: string; full_name: string };

type Props = {
  initialEvents: CalendarEvent[];
  leads: Lead[];
};

// ── Constants ─────────────────────────────────────────────────────────────────

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTHS_VI = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns YYYY-MM-DD string in local time */
function toLocalDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Returns YYYY-MM-DD of a CalendarEvent's start_at in local time */
function eventLocalDate(event: CalendarEvent): string {
  return toLocalDate(new Date(event.start_at));
}

// ── CalendarGrid ──────────────────────────────────────────────────────────────

export function CalendarGrid({ initialEvents, leads }: Props) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed

  // Modal state
  const [modalOpen, setModalOpen]       = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate]   = useState<string | undefined>(undefined);

  // Navigation
  function goToPrev() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function goToNext() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }
  function goToToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }

  // Build grid days
  const { days, startOffset } = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    // Monday=0 offset (JS: 0=Sun,1=Mon,...,6=Sat → shift)
    const rawDow = firstDay.getDay(); // 0=Sun
    const startOffset = rawDow === 0 ? 6 : rawDow - 1; // Mon-based
    const daysInMonth = lastDay.getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { days, startOffset };
  }, [year, month]);

  // Group events by local date string
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of initialEvents) {
      const dateKey = eventLocalDate(ev);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(ev);
    }
    // Sort each day's events by start_at
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    }
    return map;
  }, [initialEvents]);

  // Handlers
  function openCreate(dateStr: string) {
    setSelectedEvent(null);
    setSelectedDate(dateStr);
    setModalOpen(true);
  }
  function openEdit(ev: CalendarEvent) {
    setSelectedEvent(ev);
    setSelectedDate(undefined);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(undefined);
  }

  const todayStr = toLocalDate(today);

  // Grid cells: padding + actual days
  const totalCells = startOffset + days.length;
  const rows = Math.ceil(totalCells / 7);

  return (
    <>
      {/* ── Calendar header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-2xl font-semibold text-near-black">
            {MONTHS_VI[month]}, {year}
          </h1>
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1 rounded-lg text-sm font-medium border border-border-cream text-warm-silver hover:text-near-black hover:bg-warm-sand transition-colors"
          >
            Hôm nay
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrev}
            className="p-2 rounded-lg hover:bg-warm-sand text-olive-gray hover:text-near-black transition-colors"
            aria-label="Tháng trước"
          >
            <span className="material-symbols-outlined !text-[20px]">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="p-2 rounded-lg hover:bg-warm-sand text-olive-gray hover:text-near-black transition-colors"
            aria-label="Tháng sau"
          >
            <span className="material-symbols-outlined !text-[20px]">chevron_right</span>
          </button>
          <button
            type="button"
            onClick={() => openCreate(todayStr)}
            className="flex items-center gap-1.5 ml-2 px-4 py-2 rounded-xl bg-terracotta text-ivory text-sm font-semibold hover:bg-terracotta/90 transition-colors"
          >
            <span className="material-symbols-outlined !text-[16px]">add</span>
            Tạo sự kiện
          </button>
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-border-cream rounded-2xl overflow-hidden shadow-sm">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border-cream">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-2.5 text-center text-[12px] font-semibold text-warm-silver uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div
          className="grid grid-cols-7"
          style={{ gridTemplateRows: `repeat(${rows}, minmax(100px, 1fr))` }}
        >
          {/* Leading empty cells */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`pre-${i}`} className="border-b border-r border-border-cream bg-stone-50/50" />
          ))}

          {/* Day cells */}
          {days.map((day) => {
            const pad = (n: number) => String(n).padStart(2, "0");
            const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
            const isToday = dateStr === todayStr;
            const dayEvents = eventsByDate[dateStr] ?? [];
            const col = (startOffset + day - 1) % 7; // 0=Mon … 6=Sun
            const isWeekend = col >= 5;

            return (
              <div
                key={day}
                onClick={() => openCreate(dateStr)}
                className={cn(
                  "border-b border-r border-border-cream p-1.5 flex flex-col gap-0.5 cursor-pointer group transition-colors",
                  "hover:bg-warm-sand/30",
                  isWeekend && "bg-stone-50/40",
                )}
              >
                {/* Day number */}
                <div className="flex items-center justify-between px-0.5 mb-0.5">
                  <span
                    className={cn(
                      "text-[13px] font-semibold w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                      isToday
                        ? "bg-terracotta text-ivory"
                        : "text-near-black group-hover:text-terracotta",
                    )}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] text-warm-silver">
                      {dayEvents.length} SK
                    </span>
                  )}
                </div>

                {/* Events (show max 3, then +N more) */}
                {dayEvents.slice(0, 3).map((ev) => (
                  <EventItem key={ev.id} event={ev} onClick={openEdit} />
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-warm-silver px-1.5">
                    +{dayEvents.length - 3} sự kiện
                  </span>
                )}
              </div>
            );
          })}

          {/* Trailing empty cells to complete the last row */}
          {Array.from({
            length: rows * 7 - totalCells,
          }).map((_, i) => (
            <div key={`post-${i}`} className="border-b border-r border-border-cream bg-stone-50/50" />
          ))}
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      <EventModal
        isOpen={modalOpen}
        onClose={closeModal}
        event={selectedEvent}
        defaultDate={selectedDate}
        leads={leads}
      />
    </>
  );
}
