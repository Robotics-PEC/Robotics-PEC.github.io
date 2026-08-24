"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchRoles, type Role as RolesEditor } from "@/lib/roles";
import { useAuthRole } from "@/lib/useAuthRole";
import RolesPanel from "./role/RolesPanel";
import UsersPanel from "./role/UsersPanel";

/**
 * Drop-in tab for your existing admin page:
 *
 *   import Role from "@/components/admin/Role";
 *   ...
 *   <TabsContent value="roles"><Role /></TabsContent>
 */
const RolesEditor = () => {
  const { loading, isAdmin } = useAuthRole();
  const [roles, setRoles] = useState<RolesEditor[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchRoles()
      .then(setRoles)
      .catch(() => undefined);
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border py-16 text-center">
        <ShieldAlert className="size-6 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Admins only</h3>
        <p className="text-sm text-muted-foreground">
          You don&apos;t have permission to manage roles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Roles &amp; permissions</h2>
        <p className="text-sm text-muted-foreground">
          Define roles, choose which pages each role can open, and assign roles to members.
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles &amp; access</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <UsersPanel roles={roles} />
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <RolesPanel onRolesChanged={setRoles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RolesEditor;