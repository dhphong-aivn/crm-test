import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentLeadsTable } from "@/components/dashboard/recent-leads-table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/current-user";
import Link from "next/link";
import { LEAD_STATUSES } from "@/lib/constants";
import type { Lead, LeadStatus } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const me = await getCurrentUser();

  // Status counts (4 parallel count queries — cheap, avoids group-by client-side)
  const countPromises = LEAD_STATUSES.map((status) =>
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", status),
  );
  const counts = await Promise.all(countPromises);
  const statusCounts = LEAD_STATUSES.reduce<Record<LeadStatus, number>>(
    (acc, status, i) => {
      acc[status] = counts[i].count ?? 0;
      return acc;
    },
    { new: 0, consulting: 0, won: 0, rejected: 0 },
  );

  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<Lead[]>();

  const firstName = (me.fullName || me.email || "bạn").split(" ").pop();

  return (
    <>
      <Topbar
        userEmail={me.email}
        userName={me.fullName}
        avatarUrl={me.avatarUrl}
      />

      <section className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-10 pb-24">
        <header>
          <h1 className="text-3xl md:text-4xl font-semibold text-near-black leading-tight mb-2 tracking-tight">
            Xin chào, {firstName}.
          </h1>
          <p className="text-olive-gray max-w-2xl leading-relaxed">
            Chào mừng bạn trở lại. Dưới đây là tóm tắt hoạt động bán hàng của
            bạn.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Mới"
            value={statusCounts.new}
            icon="new_releases"
            tone="hot"
            hint={
              statusCounts.new > 0 ? "Cần liên hệ sớm" : "Chưa có lead mới"
            }
          />
          <StatCard
            label="Đang tư vấn"
            value={statusCounts.consulting}
            icon="forum"
            tone="active"
            hint={
              statusCounts.consulting > 0
                ? `${statusCounts.consulting} lead đang theo đuổi`
                : "Không có phiên tư vấn"
            }
          />
          <StatCard
            label="Đã mua"
            value={statusCounts.won}
            icon="shopping_cart_checkout"
            tone="success"
            hint={statusCounts.won > 0 ? "Ghi nhận thành công" : "—"}
          />
          <StatCard
            label="Từ chối"
            value={statusCounts.rejected}
            icon="block"
            tone="muted"
            hint={
              statusCounts.rejected > 0
                ? `${statusCounts.rejected} lead đã đóng`
                : "Chưa có từ chối"
            }
          />
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <h2 className="text-xl font-semibold text-near-black whitespace-nowrap tracking-tight">
                Leads mới nhất
              </h2>
              <span className="shrink-0 px-2.5 py-0.5 bg-warm-sand text-charcoal-warm text-[12px] font-semibold rounded-full tabular-nums">
                {(recentLeads ?? []).length.toString().padStart(2, "0")}
              </span>
            </div>
            <Link
              href="/leads"
              className="shrink-0 text-[13px] font-semibold text-terracotta hover:opacity-75 transition-opacity flex items-center gap-1"
            >
              Xem tất cả
              <span className="material-symbols-outlined !text-[15px]">arrow_forward</span>
            </Link>
          </div>
          <RecentLeadsTable leads={recentLeads ?? []} />
        </div>
      </section>
    </>
  );
}
