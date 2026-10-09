import type { UserProps } from "../lib/interfaces";

export const isAdminRole = (role?: string | null): boolean =>
  !!role && role.toLowerCase().includes("admin");

export const isAdminUser = (user?: UserProps | null, role?: string | null): boolean =>
  isAdminRole(role) || user?.is_admin === 1;
