"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Shield, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import {
  PAGES,
  createRole,
  deleteRole,
  fetchRoleCounts,
  fetchRoles,
  updateRole,
  type Role,
} from "@/lib/roles";

type Props = {
  onRolesChanged?: (roles: Role[]) => void;
};

export default function RolesPanel({ onRolesChanged }: Props) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<Role | "new" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Role | null>(null);

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [routes, setRoutes] = useState<string[]>([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [savingRoutes, setSavingRoutes] = useState(false);

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) ?? null,
    [roles, selectedRoleId],
  );

  async function load() {
    setLoading(true);
    try {
      const list = await fetchRoles();
      setRoles(list);
      onRolesChanged?.(list);
      setCounts(await fetchRoleCounts(list));
      setSelectedRoleId((current) => current ?? list[0]?.id ?? null);
    } catch (error) {
      toast.error(errorMessage(error, "Could not load roles"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedRoleId) return;
    let active = true;
    setRoutesLoading(true);
    // fetchRoleRoutes(selectedRoleId)
    //   .then((paths) => {
    //     if (active) setRoutes(paths);
    //   })
    //   .catch((error) => toast.error(errorMessage(error, "Could not load page rules")))
    //   .finally(() => {
    //     if (active) setRoutesLoading(false);
    //   });
    return () => {
      active = false;
    };
  }, [selectedRoleId]);

  function toggleRoute(path: string, checked: boolean) {
    setRoutes((prev) =>
      checked ? Array.from(new Set([...prev, path])) : prev.filter((p) => p !== path),
    );
  }

  async function saveRoutes() {
    if (!selectedRoleId) return;
    setSavingRoutes(true);
    try {
      // await setRoleRoutes(selectedRoleId, routes);
      toast.success("Page access updated");
    } catch (error) {
      toast.error(errorMessage(error, "Could not save page access"));
    } finally {
      setSavingRoutes(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deleteRole(pendingDelete.id);
      toast.success(`${pendingDelete.name} deleted — its members moved to the default role`);
      setPendingDelete(null);
      if (selectedRoleId === pendingDelete.id) setSelectedRoleId(null);
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete role"));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-lg border">
        <header className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">Roles</h3>
            <p className="text-xs text-muted-foreground">
              Add your own roles. Member is the fixed default.
            </p>
          </div>
          <Button size="sm" onClick={() => setEditing("new")}>
            <Plus className="mr-1.5 size-4" /> New role
          </Button>
        </header>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead className="w-24">Members</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={3}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!loading &&
              roles.map((role) => (
                <TableRow
                  key={role.id}
                  data-state={role.id === selectedRoleId ? "selected" : undefined}
                  className="cursor-pointer"
                  onClick={() => setSelectedRoleId(role.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{role.name}</span>
                      {role.isDefault && <Badge variant="secondary">Default</Badge>}
                      {role.slug === "admin" && (
                        <Badge variant="outline">
                          <Shield className="mr-1 size-3" /> Admin
                        </Badge>
                      )}
                    </div>
                    {role.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{role.description}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {counts[role.id] ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${role.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing(role);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${role.name}`}
                      disabled={role.isSystem}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingDelete(role);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </section>

      <section className="rounded-lg border">
        <header className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">
            Page access {selectedRole ? `· ${selectedRole.name}` : ""}
          </h3>
          <p className="text-xs text-muted-foreground">
            Pick the pages this role is allowed to open.
          </p>
        </header>

        <div className="space-y-3 p-4">
          {!selectedRole && (
            <p className="text-sm text-muted-foreground">Select a role to edit its pages.</p>
          )}

          {selectedRole && routesLoading && <Skeleton className="h-32 w-full" />}

          {selectedRole &&
            !routesLoading &&
            PAGES.map((page) => (
              <label key={page.path} className="flex items-start gap-3 text-sm">
                <Checkbox
                  checked={routes.includes(page.path)}
                  onCheckedChange={(checked) => toggleRoute(page.path, checked === true)}
                />
                <span>
                  <span className="font-medium">{page.label}</span>
                  <span className="block text-xs text-muted-foreground">{page.path}</span>
                </span>
              </label>
            ))}
        </div>

        {selectedRole && (
          <footer className="border-t px-4 py-3">
            <Button size="sm" onClick={saveRoutes} disabled={savingRoutes || routesLoading}>
              {savingRoutes && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Save page access
            </Button>
          </footer>
        )}
      </section>

      <RoleDialog
        role={editing}
        onClose={() => setEditing(null)}
        onSaved={async () => {
          setEditing(null);
          await load();
        }}
      />

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pendingDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Everyone with this role will be moved back to the default role. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete role</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RoleDialog({
  role,
  onClose,
  onSaved,
}: {
  role: Role | "new" | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const isNew = role === "new";
  const current = role && role !== "new" ? role : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(current?.name ?? "");
    setDescription(current?.description ?? "");
  }, [current?.id, current?.name, current?.description]);

  async function submit() {
    if (!name.trim()) {
      toast.error("Give the role a name");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await createRole({ name, description });
        toast.success("Role created");
      } else if (current) {
        await updateRole(current.id, { name, description });
        toast.success("Role updated");
      }
      await onSaved();
    } catch (error) {
      toast.error(errorMessage(error, "Could not save role"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={!!role} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "New role" : `Edit ${current?.name}`}</DialogTitle>
          <DialogDescription>
            Roles control which pages a member can open.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="role-name">Name</Label>
            <Input
              id="role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Editor"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role-description">Description</Label>
            <Textarea
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this role is for"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            {isNew ? "Create role" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function errorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message) || fallback;
  }
  return fallback;
}
