import { useCallback, useEffect, useState } from "react";
import { fetchMyRole, isAllowed, type Role } from "./roles";
import { client } from "./supabase/supabase";

export type AuthRoleState = {
  loading: boolean;
  userId: string | null;
  role: Role | null;
  routes: string[];
  isAdmin: boolean;
  can: (path: string) => boolean;
  refresh: () => Promise<void>;
};

/**
 * Current user's role + allowed pages. Falls back to the default role
 * (Member) when the user has no row yet.
 */
export function useAuthRole(): AuthRoleState {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [routes, setRoutes] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.auth.getUser();
      setUserId(data.user?.id ?? null);
      if (!data.user) {
        setRole(null);  
        setRoutes([]);
        return;
      }
      const result = await fetchMyRole();
      setRole(result.role);
      setRoutes(result.routes);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const { data: sub } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void load();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  return {
    loading,
    userId,
    role,
    routes,
    isAdmin: role?.slug === "admin",
    can: (path: string) => isAllowed(routes, path),
    refresh: load,
  };
}

/**
 * Google sign-in helper.
 *   signInWithGoogle("/dashboard")
 */
export async function signInWithGoogle(redirectPath = "/") {
  const { error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}${redirectPath}` },
  });
  if (error) throw error;
}
