"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  LEAD_STATUSES,
  LEAD_SOURCES,
} from "@/lib/constants";
import type {
  LeadInsert,
  LeadStatus,
  LeadSource,
  LeadUpdate,
} from "@/lib/types/database";

export type LeadFormState = {
  error: string | null;
  fieldErrors?: Partial<Record<keyof LeadInsert, string>>;
};

function parse(formData: FormData) {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const statusRaw = String(formData.get("status") ?? "new") as LeadStatus;
  const sourceRaw = String(formData.get("source") ?? "other") as LeadSource;
  const position = String(formData.get("position") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const status = LEAD_STATUSES.includes(statusRaw) ? statusRaw : "new";
  const source = LEAD_SOURCES.includes(sourceRaw) ? sourceRaw : "other";

  return { full_name, phone, email, status, source, position, location, notes };
}

function validate(data: ReturnType<typeof parse>): LeadFormState | null {
  const fieldErrors: LeadFormState["fieldErrors"] = {};
  if (!data.full_name) fieldErrors.full_name = "Bắt buộc nhập tên khách hàng";
  if (!data.phone) fieldErrors.phone = "Bắt buộc nhập số điện thoại";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    fieldErrors.email = "Email không hợp lệ";
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Vui lòng kiểm tra lại thông tin.", fieldErrors };
  }
  return null;
}

export async function createLeadAction(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const data = parse(formData);
  const invalid = validate(data);
  if (invalid) return invalid;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Phiên đã hết hạn. Đăng nhập lại." };

  const insert: LeadInsert = { ...data, owner_id: user.id };
  const { data: created, error } = await supabase
    .from("leads")
    .insert(insert)
    .select("id")
    .single();

  if (error || !created) {
    return { error: `Không thể tạo lead: ${error?.message ?? "unknown"}` };
  }

  revalidatePath("/");
  revalidatePath("/leads");
  redirect(`/leads/${created.id}`);
}

export async function updateLeadAction(
  id: string,
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const data = parse(formData);
  const invalid = validate(data);
  if (invalid) return invalid;

  const supabase = await createSupabaseServerClient();
  const update: LeadUpdate = data;

  const { error } = await supabase
    .from("leads")
    .update(update)
    .eq("id", id);

  if (error) {
    return { error: `Không thể cập nhật: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  redirect(`/leads/${id}`);
}

export async function deleteLeadAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/leads");
  redirect("/leads");
}
