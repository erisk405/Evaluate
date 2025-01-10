// permissions.ts

// Define all possible permissions as a union type
export type AllPermissions = 
  | "view:projects"
  | "view:admin_projects"
  | "view:comments"
  | "create:comments"
  | "update:comments"
  | "delete:comments"

const ROLES = {
    admin: [
        "view:projects",
        "view:admin_projects",
        "view:comments",
        "create:comments",
        "update:comments",
        "delete:comments"
    ],
    user: [
        "view:projects",
        "view:projects_users",
        "view:comments"
    ]
} as const;

export type Role = keyof typeof ROLES
// Use AllPermissions instead of inferring from ROLES
export type Permission = AllPermissions;

export function hasPermission(
    user: { id: string; role: Role } | null | undefined,
    permission: Permission
): boolean {
    if (!user) return false;
    if (!ROLES[user.role]) return false;
    return ROLES[user.role].includes(permission as any);
}