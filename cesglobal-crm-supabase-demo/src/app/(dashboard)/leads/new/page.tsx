import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { LeadForm } from "@/components/leads/lead-form";
import { createLeadAction } from "@/app/(dashboard)/leads/actions";
import { getCurrentUser } from "@/lib/supabase/current-user";

export const dynamic = "force-dynamic";

export default async function NewLeadPage() {
  const me = await getCurrentUser();

  return (
    <>
      <Topbar
        title="Thêm Lead"
        userEmail={me.email}
        userName={me.fullName}
        avatarUrl={me.avatarUrl}
      />

      <main className="flex-1 p-6 md:p-12 flex flex-col items-center pb-24">
        <div className="w-full max-w-[600px] mb-8">
          <Link
            href="/leads"
            className="text-terracotta hover:underline flex items-center gap-2 text-sm font-medium mb-4"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Leads / Thêm khách hàng mới
          </Link>
          <h1 className="font-headline text-3xl md:text-4xl font-medium text-near-black tracking-tight">
            Thêm khách hàng mới
          </h1>
          <p className="text-olive-gray mt-2 font-headline italic opacity-80">
            Ghi lại thông tin chi tiết để bắt đầu hành trình tư vấn.
          </p>
        </div>

        <div className="w-full max-w-[600px] bg-ivory rounded-[32px] border border-border-cream p-8 md:p-10 shadow-whisper">
          <LeadForm
            mode="create"
            action={createLeadAction}
            cancelHref="/leads"
          />
        </div>

        <p className="mt-10 text-xs text-stone-gray text-center font-headline italic">
          &ldquo;Sự tận tâm trong từng chi tiết là chìa khóa của niềm
          tin.&rdquo;
        </p>
      </main>
    </>
  );
}
