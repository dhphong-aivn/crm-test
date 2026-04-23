import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar | CRM Pro",
  description: "Lịch làm việc và sự kiện liên quan đến khách hàng",
};

export default async function CalendarPage() {
  const supabase = await createSupabaseServerClient();

  // Auth guard (dashboard layout handles this too, belt-and-suspenders)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch events for ±3 months (wide window so navigation works client-side)
  const from = new Date();
  from.setMonth(from.getMonth() - 2);
  from.setDate(1);
  from.setHours(0, 0, 0, 0);

  const to = new Date();
  to.setMonth(to.getMonth() + 4);
  to.setDate(0); // last day of that month
  to.setHours(23, 59, 59, 999);

  const [{ data: events }, { data: leads }] = await Promise.all([
    supabase
      .from("calendar_events")
      .select("*")
      .gte("start_at", from.toISOString())
      .lte("start_at", to.toISOString())
      .order("start_at"),
    supabase
      .from("leads")
      .select("id, full_name")
      .order("full_name"),
  ]);

  return (
    <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 bg-parchment min-h-screen">
      <CalendarGrid
        initialEvents={events ?? []}
        leads={leads ?? []}
      />
    </main>
  );
}
