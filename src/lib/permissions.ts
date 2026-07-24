import { Session } from "next-auth";

export const PERMISSIONS = {
  MANAGE_POSTS: "GERENCIAR_POSTS",
  MANAGE_PAGES: "GERENCIAR_PAGINAS",
  MANAGE_DOCUMENTS: "GERENCIAR_DOCUMENTOS",
  MANAGE_CMS: "GERENCIAR_CMS",
  MANAGE_USERS: "GERENCIAR_USUARIOS",
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = typeof PERMISSIONS[PermissionKey];

export function isAdmin(session: Session | null): boolean {
  if (!session?.user) return false;
  return session.user.role === "ADMIN";
}

export function hasPermission(
  session: Session | null,
  permission: PermissionValue | string
): boolean {
  if (!session?.user) return false;
  if (session.user.role === "ADMIN") return true;

  const userPermissions = (session.user as any).permissoes || [];
  return Array.isArray(userPermissions) && userPermissions.includes(permission);
}
