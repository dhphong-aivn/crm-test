"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInAction, type LoginState } from "@/app/login/actions";

const initialState: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-full bg-terracotta text-ivory font-medium text-sm shadow-sm hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <span className="material-symbols-outlined animate-spin text-[18px]">
            progress_activity
          </span>
          <span>Đang đăng nhập…</span>
        </>
      ) : (
        <span>Đăng nhập</span>
      )}
    </button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-charcoal-warm ml-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="ban@congty.com"
          className="w-full bg-white border border-border-warm rounded-2xl py-3 px-4 text-near-black focus:ring-2 focus:ring-focus-blue focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-charcoal-warm ml-1"
        >
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full bg-white border border-border-warm rounded-2xl py-3 px-4 text-near-black focus:ring-2 focus:ring-focus-blue focus:border-transparent outline-none transition-all"
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

      <SubmitButton />

      <p className="text-xs text-stone-gray text-center pt-2 leading-relaxed">
        Tài khoản được cấp bởi quản trị viên. Liên hệ nếu bạn chưa có quyền
        truy cập.
      </p>
    </form>
  );
}
