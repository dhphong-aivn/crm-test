import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { LeadFilters } from "@/components/leads/lead-filters";
import { LeadTable } from "@/components/leads/lead-table";
import { LeadPagination } from "@/components/leads/lead-pagination";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { LEADS_PAGE_SIZE, LEAD_STATUSES } from "@/lib/constants";
import type { Lead, LeadStatus } from "@/lib/types/database";

export const dynamic = "force-dynamic";

type LeadsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const { q, status, page: pageParam } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const me = await getCurrentUser();

  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const from = (page - 1) * LEADS_PAGE_SIZE;
  const to = from + LEADS_PAGE_SIZE - 1;

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status && LEAD_STATUSES.includes(status as LeadStatus)) {
    query = query.eq("status", status as LeadStatus);
  }

  if (q && q.trim()) {
    // Search across name / phone / email (simple OR — escape commas to be safe)
    const term = q.trim().replace(/,/g, " ");
    query = query.or(
      `full_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`,
    );
  }

  const { data: leads, count } = await query.returns<Lead[]>();

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/leads?${qs}` : "/leads";
  };

  return (
    <>
      <Topbar
        title="Leads"
        userEmail={me.email}
        userName={me.fullName}
        avatarUrl={me.avatarUrl}
      />

      <div className="px-6 md:px-8 py-4 flex items-center gap-4 flex-wrap">
        <LeadFilters />
        <Link
          href="/leads/new"
          className="flex items-center gap-2 bg-terracotta text-ivory px-5 py-2 rounded-full font-medium transition-transform active:scale-95 shadow-[0_0_0_1px_#c96442] text-sm ml-auto"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>Thêm Lead</span>
        </Link>
      </div>

      <section className="px-6 md:px-8 pb-8">
        <div className="bg-white border border-border-cream rounded-2xl shadow-whisper overflow-hidden">
          <LeadTable leads={leads ?? []} />
          <LeadPagination
            page={page}
            pageSize={LEADS_PAGE_SIZE}
            total={count ?? 0}
            buildHref={buildHref}
          />
        </div>
      </section>

      <section className="px-6 md:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-near-black rounded-2xl p-6 text-ivory flex items-center justify-between border border-dark-surface">
            <div className="max-w-md">
              <h3 className="font-headline text-2xl mb-2">
                Lead Conversion Intelligence
              </h3>
              <p className="text-warm-silver text-sm leading-relaxed mb-4">
                Theo dõi tỷ lệ chuyển đổi và nguồn khách hàng hiệu quả nhất để
                tối ưu chiến lược tiếp cận.
              </p>
              <Link
                href="/reports"
                className="text-coral text-sm font-semibold flex items-center gap-1 hover:underline"
              >
                Xem báo cáo chi tiết{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="hidden lg:block opacity-20 rotate-12">
              <span className="material-symbols-outlined !text-8xl text-terracotta">
                auto_graph
              </span>
            </div>
          </div>
          <div className="bg-terracotta rounded-2xl p-6 text-ivory border border-[#9d4324] shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <span className="material-symbols-outlined !text-3xl">bolt</span>
              <span className="text-[10px] uppercase tracking-[2px] font-bold py-1 px-2 bg-[#9d4324] rounded-full">
                Pro Tip
              </span>
            </div>
            <h3 className="font-headline text-xl mb-2">Theo đuổi bền bỉ</h3>
            <p className="text-[#f2f1ea] text-sm leading-relaxed">
              Lead ở trạng thái &ldquo;Đang tư vấn&rdquo; quá 7 ngày thường cần
              một lần tiếp cận lại — đừng để cơ hội nguội.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
