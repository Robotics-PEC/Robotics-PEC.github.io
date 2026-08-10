"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { PAGE_SIZE, assignRole, fetchUsers, type AppUser, type Role } from "@/lib/roles";
import UserRow from "./UserRow";
import { errorMessage } from "./RolesPanel";

/** Users grouped inside a collapsible section per role, lazily paginated. */
export default function RoleAccordion({
  roles,
  allRoles,
  search,
}: {
  roles: Role[];
  allRoles: Role[];
  search: string;
}) {
  const [open, setOpen] = useState<string[]>([]);

  return (
    <Accordion type="multiple" value={open} onValueChange={setOpen} className="rounded-lg border">
      {roles?.map((role) => (
        <AccordionItem key={role.id} value={role.id} className="px-4">
          <AccordionTrigger className="gap-2">
            <span className="flex items-center gap-2 text-sm font-medium">
              {role?.name}
              {role?.isDefault && <Badge variant="secondary">Default</Badge>}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {open.includes(role?.id) && (
              <RoleGroup role={role} allRoles={allRoles} search={search} />
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
      {roles?.length === 0 && (
        <p className="px-4 py-6 text-sm text-muted-foreground">No roles to show.</p>
      )}
    </Accordion>
  );
}

function RoleGroup({
  role,
  allRoles,
  search,
}: {
  role: Role;
  allRoles: Role[];
  search: string;
}) {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(
    async (nextPage: number, append: boolean) => {
      setLoading(true);
      try {
        const result = await fetchUsers({ page: nextPage, search, roleId: role.id });
        setUsers((prev) => (append ? [...prev, ...result.users] : result.users));
        setTotal(result.total);
        setPage(nextPage);
      } catch (error) {
        toast.error(errorMessage(error, `Could not load ${role.name} members`));
      } finally {
        setLoading(false);
      }
    },
    [role.id, role.name, search],
  );

  useEffect(() => {
    void load(0, false);
  }, [load]);

  async function changeRole(user: AppUser, roleId: string) {
    const previous = users;
    setSavingId(user.id);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setTotal((t) => Math.max(0, t - 1));
    try {
      await assignRole(user.id, roleId);
      const next = allRoles.find((r) => r.id === roleId);
      toast.success(`${user.fullName ?? user.email} moved to ${next?.name}`);
    } catch (error) {
      setUsers(previous);
      setTotal((t) => t + 1);
      toast.error(errorMessage(error, "Could not change role"));
    } finally {
      setSavingId(null);
    }
  }

  const hasMore = users.length < total;

  return (
    <div className="space-y-3 pb-2">
      <p className="text-xs text-muted-foreground">
        {total} member{total === 1 ? "" : "s"}
      </p>

      <div className="max-h-[420px] overflow-y-auto rounded-md border">
        <Table>
          <TableBody>
            {loading && users.length === 0 &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={3}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-6 text-center text-sm text-muted-foreground">
                  No members in this role.
                </TableCell>
              </TableRow>
            )}

            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                roles={allRoles}
                showRoleBadge={false}
                disabled={savingId === user.id}
                onChangeRole={(roleId) => changeRole(user, roleId)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => void load(page + 1, true)}
        >
          {loading && <Loader2 className="mr-1.5 size-4 animate-spin" />}
          Load {Math.min(PAGE_SIZE, total - users.length)} more
        </Button>
      )}
    </div>
  );
}
