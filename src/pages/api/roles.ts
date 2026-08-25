import {
    getAuthenticatedSupabaseClient,
} from "@/lib/supabase/supabase";
import { NextApiRequest, NextApiResponse } from "next";

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

const toAppUser = (
    row: ProfileRow
) => {
    const link = Array.isArray(
        row.userRoles
    )
        ? row.userRoles[0]
        : row.userRoles;

    return {
        id: row.id,
        email: row.email,
        fullName: row.fullName,
        avatarUrl: row.avatarUrl,
        created_At: row.created_At,
        role: link?.roles ?? null,
    };
};

const slugify = (name: string) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
};

const fetchRoles = async (req: NextApiRequest) => {
    const {
        data,
        error,
    } = await getAuthenticatedSupabaseClient(req)
        .from("roles")
        .select(
            "id, name, slug, description, isDefault, isSystem, created_at"
        )
        .order("isDefault", {
            ascending: false,
        })
        .order("name", {
            ascending: true,
        });

    if (error) throw error;

    return (data ?? []);
};

const fetchRoleCounts = async (
    roles: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        isDefault: boolean;
        isSystem: boolean;
        created_at: string;
    }[],
    req: NextApiRequest
) => {
    const entries = await Promise.all(
        roles.map(async (role) => {
            const {
                count,
                error,
            } = await getAuthenticatedSupabaseClient(req)
                .from("userRoles")
                .select("id", {
                    count: "exact",
                    head: true,
                })
                .eq("roleId", role.id);

            if (error) throw error;

            return [
                role.id,
                count ?? 0,
            ] as const;
        })
    );

    return Object.fromEntries(entries);
};

const createRole = async (
    input: {
        name: string;
        description?: string;
    },
    req: NextApiRequest
) => {
    const {
        data,
        error,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
            .from("roles")
            .insert({
                name:
                    input.name.trim(),

                slug:
                    slugify(
                        input.name
                    ),

                description:
                    input.description?.trim() ||
                    null,
            })
            .select()
            .single();

    if (error) throw error;

    return data;
};

const updateRole = async (
    id: string,
    patch: {
        name?: string;
        description?: string | null;
    },
    req: NextApiRequest
) => {
    const {
        data,
        error,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
            .from("roles")
            .update({
                ...(patch.name
                    ? {
                          name:
                              patch.name.trim(),
                      }
                    : {}),

                ...(patch.description !==
                undefined
                    ? {
                          description:
                              patch.description?.trim() ||
                              null,
                      }
                    : {}),
            })
            .eq("id", id)
            .select()
            .single();

    if (error) throw error;

    return data;
};

const deleteRole = async (
    id: string,
    req: NextApiRequest
) => {
    const {
        error,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
            .from("roles")
            .delete()
            .eq("id", id);

    if (error) throw error;

    // Original function returns undefined.
    return undefined;
};

const fetchUsers = async (
    queryData: {
        page: number;
        search?: string;
        roleId?: string | null;
        pageSize?: number;
    },
    req: NextApiRequest
) => {
    const {
        page,
        search,
        roleId,
        pageSize = 25,
    } = queryData;

    const from =
        page * pageSize;

    const to =
        from + pageSize - 1;

    const embed = roleId
        ? "userRoles!inner(roleId, roles(id, name, slug))"
        : "userRoles(roleId, roles(id, name, slug))";

    let query =
        getAuthenticatedSupabaseClient(req)
            .from("profiles")
            .select(
                `id, email, fullName, avatarUrl, created_At, ${embed}`,
                {
                    count: "exact",
                }
            )
            .order("created_At", {
                ascending: false,
            })
            .range(from, to);

    if (roleId) {
        query = query.eq(
            "userRoles.roleId",
            roleId
        );
    }

    const term =
        search?.trim();

    if (term) {
        const safe =
            term.replace(
                /[%,()]/g,
                ""
            );

        query = query.or(
            `email.ilike.%${safe}%,fullName.ilike.%${safe}%`
        );
    }

    const {
        data,
        error,
        count,
    } = await query;

    if (error) {
        throw error;
    }

    return {
        users: (
            (data ?? []) as unknown as ProfileRow[]
        ).map(toAppUser),

        total: count ?? 0,
    };
};

const assignRole = async (
    userId: string,
    roleId: string,
    req: NextApiRequest
) => {
    const {
        error,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
            .from("userRoles")
            .upsert(
                {
                    userId,
                    roleId,
                },
                {
                    onConflict:
                        "userId",
                }
            );

    if (error) throw error;

    // Original function returns undefined.
    return undefined;
};

const fetchMyRole = async (
    req: NextApiRequest
) => {
    const {
        data: auth,
    } =
        await getAuthenticatedSupabaseClient(
            req
        ).auth.getUser();

    const user =
        auth.user;

    if (!user) {
        return {
            role: null,
            routes: [],
        };
    }

    const {
        data,
        error,
    } =
        await getAuthenticatedSupabaseClient(
            req
        )
            .from("profiles")
            .select(
                "id, email, fullName, avatarUrl, created_At, " +
                "userRoles(roleId, roles(id, name, slug, description, isDefault, isSystem, created_at))"
            )
            .eq(
                "userId",
                user.id
            )
            .maybeSingle();

    if (error) {
        console.log(error);
        throw error;
    }

    const profile =
        data as any;

    const link =
        Array.isArray(
            profile?.userRoles
        )
            ? profile.userRoles[0]
            : profile?.userRoles;

    let role =
        link?.roles ??
        null;

    if (!role) {
        const {
            data: fallback,
        } =
            await getAuthenticatedSupabaseClient(
                req
            )
                .from("roles")
                .select(
                    "id, name, slug, description, isDefault, isSystem, created_at"
                )
                .eq(
                    "isDefault",
                    true
                )
                .maybeSingle();

        role =
            fallback ??
            null;

        if (
            role &&
            data
        ) {
            await assignRole(
                profile.id,
                role.id,
                req
            ).catch(
                () =>
                    undefined
            );
        }
    }

    if (!role) {
        return {
            role: null,
            routes: [],
        };
    }

    return {
        role,
        routes: [],
    };
};

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const {
            action,
        } = req.method === "GET"
            ? req.query
            : req.body;

        switch (req.method) {
            case "GET": {
                switch (action) {
                    case "roles": {
                        return res
                            .status(200)
                            .json(
                                await fetchRoles(req)
                            );
                    }

                    case "users": {
                        const page =
                            Number(
                                req.query
                                    .page
                            );

                        const search =
                            typeof req
                                .query
                                .search ===
                            "string"
                                ? req
                                      .query
                                      .search
                                : undefined;

                        const roleId =
                            typeof req
                                .query
                                .roleId ===
                            "string"
                                ? req
                                      .query
                                      .roleId
                                : null;

                        const pageSize =
                            req.query
                                .pageSize
                                ? Number(
                                      req.query
                                          .pageSize
                                  )
                                : 25;

                        return res
                            .status(200)
                            .json(
                                await fetchUsers(
                                    {
                                        page,
                                        search,
                                        roleId,
                                        pageSize,
                                    },
                                    req
                                )
                            );
                    }

                    case "my-role": {
                        return res
                            .status(200)
                            .json(
                                await fetchMyRole(
                                    req
                                )
                            );
                    }

                    default:
                        return res
                            .status(400)
                            .json({
                                error:
                                    "Invalid action",
                            });
                }
            }

            case "POST": {
                switch (action) {
                    case "role": {
                        const {
                            input,
                        } = req.body;

                        return res
                            .status(200)
                            .json(
                                await createRole(
                                    input,
                                    req
                                )
                            );
                    }

                    case "role-counts": {
                        const { roles } = req.body;
                    
                        if (!Array.isArray(roles)) {
                            return res.status(400).json({
                                error: "roles is required",
                            });
                        }
                    
                        const data =
                            await fetchRoleCounts(roles,req);
                    
                        return res
                            .status(200)
                            .json(data);
                    }

                    case "assign-role": {
                        const {
                            userId,
                            roleId,
                        } = req.body;

                        await assignRole(
                            userId,
                            roleId,
                            req
                        );

                        return res
                            .status(200)
                            .json(
                                null
                            );
                    }

                    default:
                        return res
                            .status(400)
                            .json({
                                error:
                                    "Invalid action",
                            });
                }
            }

            case "PUT": {
                if (
                    action ===
                    "role"
                ) {
                    const {
                        id,
                        patch,
                    } = req.body;

                    return res
                        .status(200)
                        .json(
                            await updateRole(
                                id,
                                patch,
                                req
                            )
                        );
                }

                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid action",
                    });
            }

            case "DELETE": {
                if (
                    action ===
                    "role"
                ) {
                    const {
                        id,
                    } = req.body;

                    await deleteRole(
                        id,
                        req
                    );

                    return res
                        .status(200)
                        .json(
                            null
                        );
                }

                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid action",
                    });
            }

            default: {
                res.setHeader(
                    "Allow",
                    [
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                    ]
                );

                return res
                    .status(405)
                    .json({
                        error:
                            `Method ${req.method} not allowed`,
                    });
            }
        }
    } catch (error) {
        console.error(error);

        return res
            .status(500)
            .json({
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            });
    }
};

export default handler;