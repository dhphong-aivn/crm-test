"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EVENT_TYPES } from "@/lib/constants";
import type { EventType, CalendarEventInsert, CalendarEventUpdate } from "@/lib/types/database";

// ── Shared types ──────────────────────────────────────────────────────────────

export type CalendarEventFormState = {
  error: string | null;
  fieldErrors?: {
    title?: string;
    start_at?: string;
    type?: string;
  };
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function parse(formData: FormData) {
  const title    = String(formData.get("title")    ?? "").trim();
  const typeRaw  = String(formData.get("type")     ?? "meeting") as EventType;
  const start_at = String(formData.get("start_at") ?? "").trim();
  const end_at   = String(formData.get("end_at")   ?? "").trim() || null;
  const all_day  = formData.get("all_day") === "true";
  const notes    = String(formData.get("notes")    ?? "").trim() || null;
  const lead_id  = String(formData.get("lead_id")  ?? "").trim() || null;

  const type: EventType = EVENT_TYPES.includes(typeRaw) ? typeRaw : "meeting";

  return { title, type, start_at, end_at, all_day, notes, lead_id };
}

function validate(
  data: ReturnType<typeof parse>,
): CalendarEventFormState | null {
  const fieldErrors: CalendarEventFormState["fieldErrors"] = {};
  if (!data.title)    fieldErrors.title    = "Bắt buộc nhập tiêu đề";
  if (!data.start_at) fieldErrors.start_at = "Bắt buộc chọn thời gian bắt đầu";
  if (!data.type)     fieldErrors.type     = "Bắt buộc chọn loại sự kiện";
  return Object.keys(fieldErrors).length > 0
    ? { error: "Vui lòng kiểm tra lại thông tin.", fieldErrors }
    : null;
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export async function createEventAction(
  _prev: CalendarEventFormState,
  formData: FormData,
): Promise<CalendarEventFormState> {
  const data    = parse(formData);
  const invalid = validate(data);
  if (invalid) return invalid;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Phiên đã hết hạn. Đăng nhập lại." };

  const insert: CalendarEventInsert = { ...data, owner_id: user.id };
  const { error } = await supabase.from("calendar_events").insert(insert);

  if (error) {
    return { error: `Không thể tạo sự kiện: ${error.message}` };
  }

  revalidatePath("/calendar");
  return { error: null };
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

export async function updateEventAction(
  id: string,
  _prev: CalendarEventFormState,
  formData: FormData,
): Promise<CalendarEventFormState> {
  const data    = parse(formData);
  const invalid = validate(data);
  if (invalid) return invalid;

  const supabase = await createSupabaseServerClient();

  const update: CalendarEventUpdate = data;
  const { error } = await supabase
    .from("calendar_events")
    .update(update)
    .eq("id", id);

  if (error) {
    return { error: `Không thể cập nhật: ${error.message}` };
  }

  revalidatePath("/calendar");
  return { error: null };
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function deleteEventAction(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}
