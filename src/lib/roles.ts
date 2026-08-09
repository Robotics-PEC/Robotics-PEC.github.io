import { client } from "./supabase/supabase";

/**
 * The pages an admin can grant to a role.
 * This is the single source of truth: the permission checklist in the admin UI
 * and the runtime route guard both read from here.
 */
export const PAGES: { path: string; label: string; group?: string }[] = [
  { path: "/", label: "Home" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/settings", label: "Settings", group: "Account" },
  { path: "/admin", label: "Admin", group: "Admin" },
  { path: "/admin/roles", label: "Admin · Roles", group: "Admin" },
];

export const PAGE_SIZE = 25;

export type Role = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_default: boolean;
  is_system: boolean;
  created_at: string;
};

export type AppUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  role: Pick<Role, "id" | "name" | "slug"> | null;
};

export type UserPage = {
  users: AppUser[];
  total: number;
};

export type UserQuery = {
  page: number;
  search?: string;
  roleId?: string | null;
  pageSize?: number;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ----------------------------------------------------------------- roles */

export async function fetchRoles(): Promise<Role[]> {
  const { data, error } = await client
    .from("roles")
    .select("id, name, slug, description, is_default, is_system, created_at")
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Role[];
}

/** { [roleId]: memberCount } — one cheap head-count per role. */
export async function fetchRoleCounts(roles: Role[]): Promise<Record<string, number>> {
  const entries = await Promise.all(
    roles.map(async (role) => {
      const { count, error } = await client
        .from("user_roles")
        .select("id", { count: "exact", head: true })
        .eq("role_id", role.id);
      if (error) throw error;
      return [role.id, count ?? 0] as const;
    }),
  );
  return Object.fromEntries(entries);
}

export async function createRole(input: { name: string; description?: string }) {
  const { data, error } = await client
    .from("roles")
    .insert({
      name: input.name.trim(),
      slug: slugify(input.name),
      description: input.description?.trim() || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Role;
}

export async function updateRole(
  id: string,
  patch: { name?: string; description?: string | null },
) {
  const { data, error } = await client
    .from("roles")
    .update({
      ...(patch.name ? { name: patch.name.trim() } : {}),
      ...(patch.description !== undefined
        ? { description: patch.description?.trim() || null }
        : {}),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Role;
}

export async function deleteRole(id: string) {
  const { error } = await client.from("roles").delete().eq("id", id);
  if (error) throw error;
}

/* ----------------------------------------------------------- page rules */

export async function fetchRoleRoutes(roleId: string): Promise<string[]> {
  const { data, error } = await client
    .from("role_routes")
    .select("path")
    .eq("role_id", roleId);
  if (error) throw error;
  return (data ?? []).map((row: { path: string }) => row.path);
}

export async function setRoleRoutes(roleId: string, paths: string[]) {
  const { error: delError } = await client
    .from("role_routes")
    .delete()
    .eq("role_id", roleId);
  if (delError) throw delError;

  if (paths.length === 0) return;

  const { error } = await client
    .from("role_routes")
    .insert(paths.map((path) => ({ role_id: roleId, path })));
  if (error) throw error;
}

/* ----------------------------------------------------------------- users */

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  user_roles:
    | { role_id: string; roles: { id: string; name: string; slug: string } | null }[]
    | { role_id: string; roles: { id: string; name: string; slug: string } | null }
    | null;
};

function toAppUser(row: ProfileRow): AppUser {
  const link = Array.isArray(row.user_roles) ? row.user_roles[0] : row.user_roles;
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    avatar_url: row.avatar_url,
    created_at: row.created_at,
    role: link?.roles ?? null,
  };
}

/**
 * Server-side paginated user list. Never loads the whole table — safe for
 * tens of thousands of members.
 */
export async function fetchUsers({
  page,
  search,
  roleId,
  pageSize = PAGE_SIZE,
}: UserQuery): Promise<UserPage> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const embed = roleId
    ? "user_roles!inner(role_id, roles(id, name, slug))"
    : "user_roles(role_id, roles(id, name, slug))";

  let query = client
    .from("profiles")
    .select(`id, email, full_name, avatar_url, created_at, ${embed}`, {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (roleId) query = query.eq("user_roles.role_id", roleId);

  const term = search?.trim();
  if (term) {
    const safe = term.replace(/[%,()]/g, "");
    query = query.or(`email.ilike.%${safe}%,full_name.ilike.%${safe}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    users: ((data ?? []) as unknown as ProfileRow[]).map(toAppUser),
    total: count ?? 0,
  };
}

export async function assignRole(userId: string, roleId: string) {
  const { error } = await client
    .from("user_roles")
    .upsert({ user_id: userId, role_id: roleId }, { onConflict: "user_id" });
  if (error) throw error;
}

/* ------------------------------------------------------------ current me */

export async function fetchMyRole(): Promise<{
  role: Role | null;
  routes: string[];
}> {
  const { data: auth } = await client.auth.getUser();
  const user = auth.user;
  if (!user) return { role: null, routes: [] };

  const { data, error } = await client
    .from("user_roles")
    .select("roles(id, name, slug, description, is_default, is_system, created_at)")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;

  let role = ((data as { roles: Role | null } | null)?.roles ?? null) as Role | null;

  // No row yet (e.g. user created before the trigger) → fall back to default.
  if (!role) {
    const { data: fallback } = await client
      .from("roles")
      .select("id, name, slug, description, is_default, is_system, created_at")
      .eq("is_default", true)
      .maybeSingle();
    role = (fallback as Role | null) ?? null;
    if (role) await assignRole(user.id, role.id).catch(() => undefined);
  }

  if (!role) return { role: null, routes: [] };

  const routes = await fetchRoleRoutes(role.id);
  return { role, routes };
}

export function isAllowed(routes: string[], path: string) {
  const clean = path.split("?")[0]!.replace(/\/+$/, "") || "/";
  return routes.some((route) => {
    const r = route.replace(/\/+$/, "") || "/";
    return clean === r || clean.startsWith(`${r}/`);
  });
}
