"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import type { AppUser, Role } from "@/lib/roles";

function initials(user: AppUser) {
  const source = user?.fullName || user?.email || "?";
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export default function UserRow({
  user,
  roles,
  disabled,
  onChangeRole,
  showRoleBadge = true,
}: {
  user: AppUser;
  roles: Role[];
  disabled?: boolean;
  onChangeRole: (roleId: string) => void;
  showRoleBadge?: boolean;
}) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            {user?.avatarUrl && <AvatarImage src={user?.avatarUrl} alt="" />}
            <AvatarFallback className="text-xs">{initials(user)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.fullName ?? "Unnamed user"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </TableCell>

      {showRoleBadge && (
        <TableCell className="hidden md:table-cell">
          <Badge variant={user?.role?.slug === "admin" ? "default" : "secondary"}>
            {user?.role?.name ?? "No role"}
          </Badge>
        </TableCell>
      )}

      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
        {new Date(user?.created_At).toLocaleDateString()}
      </TableCell>

      <TableCell className="w-44 text-right">
        <Select
          value={user?.role?.id ?? undefined}
          disabled={disabled}
          onValueChange={onChangeRole}
        >
          <SelectTrigger className="ml-auto w-40" aria-label={`Role for ${user?.email ?? user?.id}`}>
            <SelectValue placeholder="Assign role" />
          </SelectTrigger>
          <SelectContent>
            {roles?.map((role) => (
              <SelectItem key={role?.id} value={role?.id}>
                {role?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
}
