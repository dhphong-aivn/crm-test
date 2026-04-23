import Link from "next/link";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { LeadForm } from "@/components/leads/lead-form";
import { updateLeadAction } from "@/app/(dashboard)/leads/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/current-user";
import type { Lead } from "@/lib/types/database";

export const dynamic = "force-dynamic";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditLeadPage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const me = await getCurrentUser();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle<Lead>();

  if (!lead) notFound();

  const boundUpdate = updateLeadAction.bind(null, id);

  return (
    <>
      <Topbar
        title="Chỉnh sửa Lead"
        userEmail={me.email}
        userName={me.fullName}
        avatarUrl={me.avatarUrl}
      />

      <main className="flex-1 p-6 md:p-12 flex flex-col items-center pb-24">
        <div className="w-full max-w-[600px] mb-8">
          <Link
            href={`/leads/${id}`}
            className="text-terracotta hover:underline flex items-center gap-2 text-sm font-medium mb-4"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Leads / {lead.full_name} / Chỉnh sửa
          </Link>
          <h1 className="font-headline text-3xl md:text-4xl font-medium text-near-black tracking-tight">
            Chỉnh sửa khách hàng
          </h1>
          <p className="text-olive-gray mt-2 font-headline italic opacity-80">
            Cập nhật thông tin mới nhất để giữ hồ sơ luôn chính xác.
          </p>
        </div>

        <div className="w-full max-w-[600px] bg-ivory rounded-[32px] border border-border-cream p-8 md:p-10 shadow-whisper">
          <LeadForm
            mode="edit"
            lead={lead}
            action={boundUpdate}
            cancelHref={`/leads/${id}`}
          />
        </div>
      </main>
    </>
  );
}
