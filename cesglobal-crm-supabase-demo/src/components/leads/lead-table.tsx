import Link from "next/link";
import type { Lead } from "@/lib/types/database";
import { LEAD_SOURCE_LABELS } from "@/lib/constants";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { getInitials, formatDateVn } from "@/lib/utils";

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

export function LeadTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border-cream shadow-whisper p-16 text-center">
        <span className="material-symbols-outlined text-5xl text-warm-silver">
          group
        </span>
        <h3 className="font-headline text-2xl font-medium mt-4">
          Chưa có lead phù hợp
        </h3>
        <p className="text-sm text-olive-gray mt-2 mb-6">
          Thử thay đổi bộ lọc hoặc bắt đầu thêm khách hàng mới.
        </p>
        <Link
          href="/leads/new"
          className="inline-flex items-center gap-2 bg-terracotta text-ivory px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">
            person_add
          </span>
          Thêm Lead mới
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f7f6f0] border-b border-border-cream">
            <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-gray uppercase tracking-widest">
              Tên khách hàng
            </th>
            <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-gray uppercase tracking-widest">
              Số điện thoại
            </th>
            <th className="px-6 py-4 text-[11px] font-semibold text-stone-gray uppercase tracking-widest">
              Email
            </th>
            <th className="px-6 py-4 text-[11px] font-semibold text-stone-gray uppercase tracking-widest">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-[11px] font-semibold text-stone-gray uppercase tracking-widest">
              Nguồn
            </th>
            <th className="px-6 py-4 text-[11px] font-semibold text-stone-gray uppercase tracking-widest">
              Ngày tạo
            </th>
            <th className="px-6 py-4 text-[11px] font-semibold text-stone-gray uppercase tracking-widest text-right">
              Hành động
            </th>
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 ${avatarColor(lead.full_name)}`}>
                    {getInitials(lead.full_name)}
                  </div>
                  <div>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="font-medium text-near-black hover:text-terracotta transition-colors"
                    >
                      {lead.full_name}
                    </Link>
                    {lead.position ? (
                      <p className="text-xs text-stone-gray">{lead.position}</p>
                    ) : null}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-[14px] text-olive-gray">
                {lead.phone}
              </td>
              <td className="px-6 py-4 text-[14px] text-olive-gray">
                {lead.email ?? "—"}
              </td>
              <td className="px-6 py-4">
                <LeadStatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-4 text-[14px] text-olive-gray">
                {LEAD_SOURCE_LABELS[lead.source]}
              </td>
              <td className="px-6 py-4 text-[14px] text-olive-gray">
                {formatDateVn(lead.created_at)}
              </td>
              <td className="px-6 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/leads/${lead.id}`}
                    aria-label="Xem chi tiết"
                    title="Xem"
                    className="p-1.5 text-stone-gray hover:text-terracotta hover:bg-ivory rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility
                    </span>
                  </Link>
                  <Link
                    href={`/leads/${lead.id}/edit`}
                    aria-label="Chỉnh sửa"
                    title="Sửa"
                    className="p-1.5 text-stone-gray hover:text-terracotta hover:bg-ivory rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
