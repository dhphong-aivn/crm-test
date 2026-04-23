"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
} from "@/lib/constants";
import type { Lead } from "@/lib/types/database";
import type { LeadFormState } from "@/app/(dashboard)/leads/actions";

const initialState: LeadFormState = { error: null };

type LeadFormProps = {
  mode: "create" | "edit";
  lead?: Lead;
  action: (
    state: LeadFormState,
    formData: FormData,
  ) => Promise<LeadFormState>;
  cancelHref: string;
};

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-8 py-3 rounded-full bg-terracotta text-ivory font-medium shadow-sm hover:opacity-95 active:scale-95 transition-all disabled:opacity-60"
    >
      {pending
        ? "Đang lưu…"
        : mode === "create"
          ? "Lưu khách hàng"
          : "Cập nhật"}
    </button>
  );
}

export function LeadForm({ mode, lead, action, cancelHref }: LeadFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <Field
        label="Tên khách hàng"
        name="full_name"
        required
        defaultValue={lead?.full_name}
        placeholder="Nguyễn Văn A"
        error={state.fieldErrors?.full_name}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Số điện thoại"
          name="phone"
          type="tel"
          required
          defaultValue={lead?.phone}
          placeholder="090 123 4567"
          error={state.fieldErrors?.phone}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          optional
          defaultValue={lead?.email ?? ""}
          placeholder="email@example.com"
          error={state.fieldErrors?.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Nguồn khách hàng"
          name="source"
          defaultValue={lead?.source ?? "facebook"}
          options={LEAD_SOURCES.map((s) => ({
            value: s,
            label: LEAD_SOURCE_LABELS[s],
          }))}
        />
        <SelectField
          label="Trạng thái"
          name="status"
          defaultValue={lead?.status ?? "new"}
          options={LEAD_STATUSES.map((s) => ({
            value: s,
            label: LEAD_STATUS_LABELS[s],
          }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Chức vụ / Công ty"
          name="position"
          optional
          defaultValue={lead?.position ?? ""}
          placeholder="Tech Lead @ ABC Corp"
        />
        <Field
          label="Địa điểm"
          name="location"
          optional
          defaultValue={lead?.location ?? ""}
          placeholder="Quận 1, TP. Hồ Chí Minh"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal-warm ml-1">
          Ghi chú
        </label>
        <textarea
          name="notes"
          rows={4}
          defaultValue={lead?.notes ?? ""}
          placeholder="Nhập thêm chi tiết về nhu cầu khách hàng…"
          className="w-full bg-white border border-border-warm rounded-2xl py-3 px-4 text-near-black focus:ring-2 focus:ring-focus-blue focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      {state.error ? (
        <div className="flex items-start gap-2 px-4 py-3 bg-[#fdf2f2] text-error-crimson rounded-2xl border border-[#fbd5d5] text-sm">
          <span className="material-symbols-outlined text-[18px] mt-0.5">
            error
          </span>
          <span>{state.error}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-4 pt-6 mt-4 border-t border-border-cream">
        <Link
          href={cancelHref}
          className="px-8 py-3 rounded-full border border-border-warm text-charcoal-warm font-medium hover:bg-warm-sand transition-all"
        >
          Hủy
        </Link>
        <SubmitButton mode={mode} />
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  optional = false,
  defaultValue,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  defaultValue?: string | null;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-charcoal-warm ml-1">
        {label}{" "}
        {required ? (
          <span className="text-error-crimson">*</span>
        ) : optional ? (
          <span className="text-stone-gray text-xs">(Tùy chọn)</span>
        ) : null}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full bg-white border border-border-warm rounded-2xl py-3 px-4 text-near-black focus:ring-2 focus:ring-focus-blue focus:border-transparent outline-none transition-all placeholder:italic placeholder:text-warm-silver"
      />
      {error ? (
        <p className="text-xs text-error-crimson ml-1">{error}</p>
      ) : null}
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-charcoal-warm ml-1">
        {label}
      </label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="form-select w-full bg-white border border-border-warm rounded-2xl py-3 px-4 text-near-black focus:ring-2 focus:ring-focus-blue outline-none transition-all cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
