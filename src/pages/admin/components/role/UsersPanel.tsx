"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  PAGE_SIZE,
  assignRole,
  fetchUsers,
  type AppUser,
  type Role,
} from "@/lib/roles";
import RoleAccordion from "./RoleAccordion";
import UserRow from "./UserRow";
import { errorMessage } from "./RolesPanel";

const ALL_ROLES = "__all__";

export default function UsersPanel({ roles }: { roles: Role[] }) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>(ALL_ROLES);
  const [grouped, setGrouped] = useState(false);

  const [page, setPage] = useState(0);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const requestId = useRef(0);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const result = await fetchUsers({
        page,
        search,
        roleId: roleFilter === ALL_ROLES ? null : roleFilter,
      });
      if (id !== requestId.current) return;
      setUsers(result.users);
      setTotal(result.total);
    } catch (error) {
      if (id === requestId.current) toast.error(errorMessage(error, "Could not load users"));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    if (!grouped) void load();
  }, [grouped, load]);

  async function changeRole(user: AppUser, roleId: string) {
    const previous = user.role;
    const next = roles.find((r) => r.id === roleId) ?? null;
    setSavingId(user.id);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, role: next ? { id: next.id, name: next.name, slug: next.slug } : null }
          : u,
      ),
    );
    try {
      await assignRole(user.id, roleId);
      toast.success(`${user.full_name ?? user.email} is now ${next?.name}`);
    } catch (error) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: previous } : u)));
      toast.error(errorMessage(error, "Could not change role"));
    } finally {
      setSavingId(null);
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeLabel = useMemo(() => {
    if (total === 0) return "No users";
    const from = page * PAGE_SIZE + 1;
    const to = Math.min(total, (page + 1) * PAGE_SIZE);
    return `${from}–${to} of ${total}`;
  }, [page, total]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-56 flex-1 space-y-1.5">
          <Label htmlFor="user-search">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="user-search"
              className="pl-9"
              placeholder="Name or email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Role</Label>
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ROLES}>All roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <label className="flex h-10 items-center gap-2 text-sm">
          <Switch checked={grouped} onCheckedChange={setGrouped} />
          Group by role
        </label>
      </div>

      {grouped ? (
        <RoleAccordion
          roles={roleFilter === ALL_ROLES ? roles : roles.filter((r) => r.id === roleFilter)}
          allRoles={roles}
          search={search}
        />
      ) : (
        <div className="rounded-lg border">
          <ScrollArea className="h-[560px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Change role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}

                {!loading && users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      No users match your filters.
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      roles={roles}
                      disabled={savingId === user.id}
                      onChangeRole={(roleId) => changeRole(user, roleId)}
                    />
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
              {loading ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="size-3 animate-spin" /> Loading
                </span>
              ) : (
                rangeLabel
              )}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Page {page + 1} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous page"
                disabled={page === 0 || loading}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Next page"
                disabled={page + 1 >= pageCount || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
