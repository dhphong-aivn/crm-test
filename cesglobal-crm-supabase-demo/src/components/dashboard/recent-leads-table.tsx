import Link from "next/link";
import type { Lead } from "@/lib/types/database";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { getInitials, relativeDateVn } from "@/lib/utils";

// Deterministic avatar color from name string
const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
  "bg-indigo-100 text-indigo-700",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function RecentLeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="bg-ivory rounded-2xl ring-shadow whisper-shadow p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-warm-sand flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl text-stone-gray">inbox</span>
        </div>
        <h3 className="font-headline text-xl font-medium mb-1">Chưa có lead nào</h3>
        <p className="text-sm text-stone-gray mb-6 max-w-xs mx-auto leading-relaxed">
          Bắt đầu hành trình bằng cách thêm khách hàng đầu tiên của bạn.
        </p>
        <Link
          href="/leads/new"
          className="inline-flex items-center gap-2 bg-terracotta text-ivory px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Thêm Lead đầu tiên
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory rounded-2xl ring-shadow whisper-shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-cream bg-[#f7f6f0]">
              <th className="px-6 py-3.5 text-[11px] uppercase tracking-widest font-semibold text-stone-gray">
                Tên khách hàng
              </th>
              <th className="px-6 py-3.5 text-[11px] uppercase tracking-widest font-semibold text-stone-gray">
                Số điện thoại
              </th>
              <th className="px-6 py-3.5 text-[11px] uppercase tracking-widest font-semibold text-stone-gray">
                Trạng thái
              </th>
              <th className="px-6 py-3.5 text-[11px] uppercase tracking-widest font-semibold text-stone-gray">
                Ngày tạo
              </th>
              <th className="px-6 py-3.5 text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-cream">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-warm-sand/40 transition-colors duration-150 group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 ${avatarColor(lead.full_name)}`}
                    >
                      {getInitials(lead.full_name)}
                    </div>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="font-medium text-near-black hover:text-terracotta transition-colors text-[14px]"
                    >
                      {lead.full_name}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 text-olive-gray text-[14px] tabular-nums">
                  {lead.phone}
                </td>
                <td className="px-6 py-4">
                  <LeadStatusBadge status={lead.status} />
                </td>
                <td className="px-6 py-4 text-stone-gray text-[13px]">
                  {relativeDateVn(lead.created_at)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/leads/${lead.id}`}
                    aria-label="Xem chi tiết"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-warm-silver hover:text-near-black hover:bg-warm-sand transition-all"
                  >
                    <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
