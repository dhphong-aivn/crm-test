import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";

export type CurrentUser = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
};

/**
 * Fetch the signed-in user + their profile in a single call.
 * Throws if the user is not authenticated — intended for use inside routes
 * already protected by middleware + (dashboard)/layout.tsx.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: data?.full_name ?? null,
    avatarUrl: data?.avatar_url ?? null,
  };
}
