import type { Interaction } from "@/lib/types/database";
import {
  INTERACTION_TYPE_ICONS,
  INTERACTION_TYPE_LABELS,
} from "@/lib/constants";
import { relativeDateVn } from "@/lib/utils";

export function InteractionTimeline({
  interactions,
}: {
  interactions: Interaction[];
}) {
  if (interactions.length === 0) {
    return (
      <div className="bg-ivory rounded-2xl border border-border-cream p-10 text-center">
        <span className="material-symbols-outlined text-4xl text-warm-silver">
          history
        </span>
        <h4 className="font-headline text-lg font-medium mt-3 text-near-black">
          Chưa có tương tác nào
        </h4>
        <p className="text-sm text-olive-gray mt-1">
          Thêm ghi chú tương tác đầu tiên để bắt đầu theo dõi hành trình của
          khách hàng.
        </p>
      </div>
    );
  }

  return (
    <div className="relative ml-4 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-warm-sand">
      {interactions.map((it) => (
        <div key={it.id} className="relative pl-10">
          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-warm-sand ring-4 ring-parchment flex items-center justify-center">
            <span className="material-symbols-outlined text-[14px] text-terracotta">
              {INTERACTION_TYPE_ICONS[it.type]}
            </span>
          </div>
          <div className="bg-ivory ring-shadow rounded-2xl p-6">
            <div className="flex justify-between items-start mb-3 gap-4">
              <div className="min-w-0">
                <h4 className="font-medium text-near-black">{it.title}</h4>
                <p className="text-[12px] text-stone-gray mt-0.5">
                  <span className="inline-block px-2 py-0.5 bg-parchment rounded-full text-[10px] uppercase tracking-widest font-semibold text-terracotta mr-2">
                    {INTERACTION_TYPE_LABELS[it.type]}
                  </span>
                  {relativeDateVn(it.occurred_at)}
                  {it.duration_minutes
                    ? ` • ${it.duration_minutes} phút`
                    : ""}
                </p>
              </div>
            </div>
            {it.content ? (
              <p className="text-olive-gray text-[15px] leading-relaxed">
                {it.content}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
