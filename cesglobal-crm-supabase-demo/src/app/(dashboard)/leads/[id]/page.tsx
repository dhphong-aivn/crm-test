import Link from "next/link";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { DeleteLeadButton } from "@/components/leads/delete-lead-button";
import { InteractionTimeline } from "@/components/interactions/interaction-timeline";
import { InteractionModal } from "@/components/interactions/interaction-modal";
import { LEAD_SOURCE_LABELS } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/current-user";
import type { Interaction, Lead } from "@/lib/types/database";
import { formatDateVn, getInitials } from "@/lib/utils";

export const dynamic = "force-dynamic";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const me = await getCurrentUser();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle<Lead>();

  if (!lead) notFound();

  const { data: interactions } = await supabase
    .from("interactions")
    .select("*")
    .eq("lead_id", id)
    .order("occurred_at", { ascending: false })
    .returns<Interaction[]>();

  return (
    <>
      <Topbar
        title="Chi tiết Lead"
        userEmail={me.email}
        userName={me.fullName}
        avatarUrl={me.avatarUrl}
      />

      <div className="sticky top-[73px] z-30 bg-parchment border-b border-border-cream px-6 py-3 flex justify-between items-center flex-wrap gap-3">
        <Link
          href="/leads"
          className="flex items-center gap-2 text-olive-gray hover:text-near-black transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
          <span className="text-[15px] font-medium">Danh sách Leads</span>
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/leads/${id}/edit`}
            className="px-5 py-2 bg-warm-sand text-near-black rounded-full text-[14px] font-medium ring-shadow hover:bg-border-cream transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Sửa
          </Link>
          <DeleteLeadButton leadId={id} />
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full p-6 md:p-10 space-y-10 pb-24">
        <section className="bg-ivory whisper-shadow rounded-[32px] border border-border-cream p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-parchment flex items-center justify-center ring-2 ring-border-warm">
                <span className="font-headline text-4xl md:text-5xl font-medium text-terracotta">
                  {getInitials(lead.full_name)}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-4 min-w-0">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="font-headline text-3xl md:text-4xl font-medium text-near-black break-words">
                  {lead.full_name}
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <LeadStatusBadge status={lead.status} />
                  <span className="px-3 py-1 bg-warm-sand text-charcoal-warm text-[12px] font-medium rounded-full uppercase tracking-wider">
                    {LEAD_SOURCE_LABELS[lead.source]}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-olive-gray">
                <InfoLine icon="call" value={lead.phone} />
                <InfoLine icon="mail" value={lead.email ?? "—"} />
                <InfoLine
                  icon="calendar_today"
                  value={`Ngày tạo: ${formatDateVn(lead.created_at)}`}
                />
                {lead.location ? (
                  <InfoLine icon="location_on" value={lead.location} />
                ) : null}
                {lead.position ? (
                  <InfoLine icon="work" value={lead.position} />
                ) : null}
              </div>
            </div>
          </div>

          {lead.notes ? (
            <div className="mt-10 pt-8 border-t border-border-warm">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-terracotta">
                  description
                </span>
                <h3 className="font-headline text-xl font-medium">
                  Ghi chú ban đầu
                </h3>
              </div>
              <p className="text-olive-gray leading-relaxed font-headline italic opacity-80 whitespace-pre-wrap">
                &ldquo;{lead.notes}&rdquo;
              </p>
            </div>
          ) : null}
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center px-2 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-terracotta">
                history
              </span>
              <h3 className="font-headline text-2xl font-medium">
                Lịch sử tương tác
              </h3>
              <span className="px-2 py-0.5 bg-warm-sand text-charcoal-warm text-xs font-medium rounded-full ml-1">
                {(interactions ?? []).length}
              </span>
            </div>
            <InteractionModal leadId={id} />
          </div>

          <InteractionTimeline interactions={interactions ?? []} />
        </section>
      </main>
    </>
  );
}

function InfoLine({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="material-symbols-outlined text-stone-gray shrink-0">
        {icon}
      </span>
      <span className="text-[16px] truncate">{value}</span>
    </div>
  );
}
