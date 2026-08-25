import { apiFetch } from "./supabase/supabase";

export const PAGES: {
    path: string;
    label: string;
    group?: string;
}[] = [
    {
        path: "/",
        label: "Home",
    },
    {
        path: "/dashboard",
        label: "Dashboard",
    },
    {
        path: "/settings",
        label: "Settings",
        group: "Account",
    },
    {
        path: "/admin",
        label: "Admin",
        group: "Admin",
    },
    {
        path: "/admin/roles",
        label: "Admin · Roles",
        group: "Admin",
    },
];

export const PAGE_SIZE = 25;

export type Role = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isDefault: boolean;
    isSystem: boolean;
    created_at: string;
};

export type AppUser = {
    id: string;
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
    created_At: string;
    role: Pick<
        Role,
        "id" | "name" | "slug"
    > | null;
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

export async function fetchRoles(): Promise<
    Role[]
> {
    const response =
        await apiFetch(
            "/api/roles?action=roles"
        );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    return response.json();
}

export async function fetchRoleCounts(
  roles: Role[]
): Promise<Record<string, number>> {
  const response = await apiFetch(
      "/api/roles",
      {
          method: "POST",
          body: JSON.stringify({
              action: "role-counts",
              roles,
          }),
      }
  );

  if (!response.ok) {
      throw new Error(
          await response.text()
      );
  }

  return response.json();
}

export async function createRole(
    input: {
        name: string;
        description?: string;
    }
) {
    const response =
        await apiFetch(
            "/api/roles",
            {
                method: "POST",

                body:
                    JSON.stringify({
                        action:
                            "role",

                        input,
                    }),
            }
        );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    return response.json();
}

export async function updateRole(
    id: string,
    patch: {
        name?: string;
        description?: string | null;
    }
) {
    const response =
        await apiFetch(
            "/api/roles",
            {
                method: "PUT",

                body:
                    JSON.stringify({
                        action:
                            "role",

                        id,

                        patch,
                    }),
            }
        );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    return response.json();
}

export async function deleteRole(
    id: string
) {
    const response =
        await apiFetch(
            "/api/roles",
            {
                method: "DELETE",

                body:
                    JSON.stringify({
                        action:
                            "role",

                        id,
                    }),
            }
        );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    /*
     * Original function returns
     * undefined on success.
     */
    return;
}

type ProfileRow = {
    id: string;
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
    created_At: string;
    userRoles:
        | {
              roleId: string;
              roles: {
                  id: string;
                  name: string;
                  slug: string;
              } | null;
          }[]
        | {
              roleId: string;
              roles: {
                  id: string;
                  name: string;
                  slug: string;
              } | null;
          }
        | null;
};

export async function fetchUsers({
    page,
    search,
    roleId,
    pageSize = PAGE_SIZE,
}: UserQuery): Promise<
    UserPage
> {
    const params =
        new URLSearchParams();

    params.set(
        "action",
        "users"
    );

    params.set(
        "page",
        String(page)
    );

    if (
        search !==
        undefined
    ) {
        params.set(
            "search",
            search
        );
    }

    if (
        roleId !==
            undefined &&
        roleId !== null
    ) {
        params.set(
            "roleId",
            roleId
        );
    }

    params.set(
        "pageSize",
        String(pageSize)
    );

    const response =
        await apiFetch(
            `/api/roles?${params.toString()}`
        );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    return response.json();
}

export async function assignRole(
    userId: string,
    roleId: string
) {
    const response =
        await apiFetch(
            "/api/roles",
            {
                method: "POST",

                body:
                    JSON.stringify({
                        action:
                            "assign-role",

                        userId,

                        roleId,
                    }),
            }
        );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    /*
     * Original function returns
     * undefined on success.
     */
    return;
}

export async function fetchMyRole(): Promise<{
    role: Role | null;
    routes: string[];
}> {
    const response =
        await apiFetch(
            "/api/roles?action=my-role"
        );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    return response.json();
}

export function isAllowed(
    routes: string[],
    path: string
) {
    const clean =
        path
            .split("?")[0]!
            .replace(
                /\/+$/,
                ""
            ) || "/";

    return routes.some(
        (route) => {
            const r =
                route.replace(
                    /\/+$/,
                    ""
                ) || "/";

            return (
                clean === r ||
                clean.startsWith(
                    `${r}/`
                )
            );
        }
    );
}