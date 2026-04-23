"use client";

import { useEffect, useRef, useActionState, startTransition } from "react";
import { cn } from "@/lib/utils";
import {
  EVENT_TYPES,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_ICONS,
} from "@/lib/constants";
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
  type CalendarEventFormState,
} from "@/app/(dashboard)/calendar/actions";
import type { CalendarEvent } from "@/lib/types/database";

// ── Types ─────────────────────────────────────────────────────────────────────

type Lead = { id: string; full_name: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  /** If provided → edit mode. If null → create mode. */
  event: CalendarEvent | null;
  /** Pre-filled date when clicking a day cell (YYYY-MM-DD) */
  defaultDate?: string;
  leads: Lead[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function toLocalDatetimeValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultDatetimeForDate(date?: string): string {
  if (!date) {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    return toLocalDatetimeValue(now.toISOString());
  }
  return `${date}T09:00`;
}

const INIT_STATE: CalendarEventFormState = { error: null };

// ── Component ─────────────────────────────────────────────────────────────────

export function EventModal({ isOpen, onClose, event, defaultDate, leads }: Props) {
  const isEdit = !!event;

  // Bind update action to event id when in edit mode
  const boundUpdate = isEdit
    ? updateEventAction.bind(null, event.id)
    : createEventAction;

  const [state, formAction, isPending] = useActionState(boundUpdate, INIT_STATE);

  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open / close <dialog>
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen) {
      el.showModal();
    } else {
      el.close();
    }
  }, [isOpen]);

  // Close on success (error === null after a submit)
  const prevPendingRef = useRef(false);
  useEffect(() => {
    if (prevPendingRef.current && !isPending && !state.error) {
      onClose();
    }
    prevPendingRef.current = isPending;
  }, [isPending, state.error, onClose]);

  // Close when clicking outside the dialog box
  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  async function handleDelete() {
    if (!event) return;
    if (!confirm(`Xoá sự kiện "${event.title}"?`)) return;
    startTransition(async () => {
      await deleteEventAction(event.id);
      onClose();
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="backdrop:bg-black/40 rounded-2xl shadow-2xl p-0 w-full max-w-lg mx-auto mt-20 border border-border-cream"
    >
      <form action={formAction} className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-cream">
          <h2 className="font-headline text-[18px] font-semibold text-near-black">
            {isEdit ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-warm-silver hover:text-near-black hover:bg-warm-sand transition-colors"
          >
            <span className="material-symbols-outlined !text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
          {/* Error banner */}
          {state.error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              <span className="material-symbols-outlined !text-[16px]">error</span>
              {state.error}
            </div>
          )}

          {/* Title */}
          <Field label="Tiêu đề sự kiện *" error={state.fieldErrors?.title}>
            <input
              name="title"
              required
              defaultValue={event?.title ?? ""}
              placeholder="VD: Demo sản phẩm với khách hàng"
              className={inputCls(!!state.fieldErrors?.title)}
            />
          </Field>

          {/* Event type */}
          <Field label="Loại sự kiện *" error={state.fieldErrors?.type}>
            <div className="grid grid-cols-5 gap-2">
              {EVENT_TYPES.map((t) => (
                <TypeOption key={t} type={t} defaultChecked={event?.type === t || (!event && t === "meeting")} />
              ))}
            </div>
            {/* Hidden select for form submission */}
            <input type="hidden" name="type" id="type-hidden" />
          </Field>

          {/* Lead */}
          <Field label="Khách hàng liên quan">
            <select
              name="lead_id"
              defaultValue={event?.lead_id ?? ""}
              className={inputCls(false)}
            >
              <option value="">— Không chọn —</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.full_name}
                </option>
              ))}
            </select>
          </Field>

          {/* Start */}
          <Field label="Thời gian bắt đầu *" error={state.fieldErrors?.start_at}>
            <input
              name="start_at"
              type="datetime-local"
              required
              defaultValue={
                event ? toLocalDatetimeValue(event.start_at) : defaultDatetimeForDate(defaultDate)
              }
              className={inputCls(!!state.fieldErrors?.start_at)}
            />
          </Field>

          {/* End */}
          <Field label="Thời gian kết thúc">
            <input
              name="end_at"
              type="datetime-local"
              defaultValue={toLocalDatetimeValue(event?.end_at)}
              className={inputCls(false)}
            />
          </Field>

          {/* All day */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              name="all_day"
              type="checkbox"
              value="true"
              defaultChecked={event?.all_day ?? false}
              className="w-4 h-4 rounded accent-terracotta"
            />
            <span className="text-sm text-near-black">Cả ngày</span>
          </label>

          {/* Notes */}
          <Field label="Ghi chú">
            <textarea
              name="notes"
              rows={3}
              defaultValue={event?.notes ?? ""}
              placeholder="Nội dung trao đổi, agenda, ..."
              className={cn(inputCls(false), "resize-none")}
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border-cream bg-ivory rounded-b-2xl">
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined !text-[16px]">delete</span>
              Xoá
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-olive-gray hover:bg-warm-sand transition-colors"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-terracotta text-ivory hover:bg-terracotta/90 transition-colors disabled:opacity-60"
            >
              {isPending && (
                <span className="material-symbols-outlined !text-[14px] animate-spin">
                  progress_activity
                </span>
              )}
              {isEdit ? "Lưu thay đổi" : "Tạo sự kiện"}
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-near-black">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function TypeOption({
  type,
  defaultChecked,
}: {
  type: (typeof EVENT_TYPES)[number];
  defaultChecked: boolean;
}) {
  return (
    <label className="flex flex-col items-center gap-1 cursor-pointer group">
      <input
        type="radio"
        name="type"
        value={type}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <div
        className={cn(
          "w-full flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-xl border-2 text-[11px] font-medium transition-all",
          "border-border-cream text-warm-silver",
          "peer-checked:border-terracotta peer-checked:bg-terracotta/10 peer-checked:text-terracotta",
          "group-hover:border-terracotta/40",
        )}
      >
        <span className="material-symbols-outlined !text-[18px]">
          {EVENT_TYPE_ICONS[type]}
        </span>
        {EVENT_TYPE_LABELS[type]}
      </div>
    </label>
  );
}

const inputCls = (hasError: boolean) =>
  cn(
    "w-full px-3 py-2.5 rounded-xl border text-sm text-near-black bg-white outline-none transition-colors",
    "placeholder:text-warm-silver",
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-border-cream focus:border-terracotta",
  );
