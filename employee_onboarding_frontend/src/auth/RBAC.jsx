//
// Simple RBAC helper utilities
//

// PUBLIC_INTERFACE
export function hasRole(user, requiredRoles) {
  /** Determine if the user has any of the required roles. */
  if (!user || !Array.isArray(user.roles)) return false;
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return user.roles.some((r) => requiredRoles.includes(r));
}

// PUBLIC_INTERFACE
export function hasPermission(user, requiredPermissions) {
  /** Determine if the user has any of the required permissions. */
  if (!user || !Array.isArray(user.permissions)) return false;
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  return user.permissions.some((p) => requiredPermissions.includes(p));
}
