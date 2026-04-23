import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập • CRM Pro",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center bg-parchment px-4 py-12">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl font-medium text-terracotta tracking-tight">
            CRM Pro
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-gray mt-2">
            Sales Intelligence
          </p>
        </div>

        <div className="bg-ivory border border-border-cream rounded-[32px] p-8 md:p-10 whisper-shadow">
          <div className="mb-8">
            <h2 className="font-headline text-2xl font-medium text-near-black leading-tight">
              Chào mừng trở lại.
            </h2>
            <p className="text-sm text-olive-gray mt-2 leading-relaxed">
              Đăng nhập để tiếp tục quản lý hành trình khách hàng của bạn.
            </p>
          </div>
          <LoginForm next={next ?? "/"} />
        </div>

        <p className="text-center text-xs text-stone-gray mt-8 italic font-headline">
          &ldquo;Sự tận tâm trong từng chi tiết là chìa khóa của niềm tin.&rdquo;
        </p>
      </div>
    </main>
  );
}
