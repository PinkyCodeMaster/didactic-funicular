import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * Define all available permissions for different resources
 * This creates a comprehensive permission system for the platform
 */
export const statement = {
  // Extend default admin permissions
  ...defaultStatements,
  
  // User management permissions
  user: ["create", "list", "update", "delete", "ban", "unban", "impersonate", "set-role", "set-password"],
  
  // Session management permissions
  session: ["list", "revoke", "delete"],
  
  // Content management permissions
  content: ["create", "read", "update", "delete", "publish", "moderate"],
  
  // Analytics and reporting permissions
  analytics: ["view", "export", "configure"],
  
  // System administration permissions
  system: ["configure", "backup", "restore", "maintenance"],
  
  // Financial permissions
  billing: ["view", "manage", "export"],
  
  // Support permissions
  support: ["view", "respond", "escalate", "close"],
  
  // Project management permissions
  project: ["create", "read", "update", "delete", "assign", "manage"],
  
  // Team management permissions
  team: ["create", "read", "update", "delete", "invite", "remove"],
} as const;

// Create the access control instance
const ac = createAccessControl(statement);

/**
 * FOUNDER ROLE
 * - Highest level access
 * - Can do everything across all resources
 * - Ultimate system administrator
 */
export const founder = ac.newRole({
  // Full admin permissions
  ...adminAc.statements,
  
  // Complete user management
  user: ["create", "list", "update", "delete", "ban", "unban", "impersonate", "set-role", "set-password"],
  
  // Complete session management
  session: ["list", "revoke", "delete"],
  
  // Full content control
  content: ["create", "read", "update", "delete", "publish", "moderate"],
  
  // Full analytics access
  analytics: ["view", "export", "configure"],
  
  // Complete system administration
  system: ["configure", "backup", "restore", "maintenance"],
  
  // Full billing access
  billing: ["view", "manage", "export"],
  
  // Complete support access
  support: ["view", "respond", "escalate", "close"],
  
  // Full project management
  project: ["create", "read", "update", "delete", "assign", "manage"],
  
  // Complete team management
  team: ["create", "read", "update", "delete", "invite", "remove"],
});

/**
 * MANAGER ROLE
 * - High level access but limited system administration
 * - Can manage users, content, and projects
 * - Cannot access system configuration or billing
 */
export const manager = ac.newRole({
  // Limited admin permissions (no user creation/deletion)
  user: ["list", "update", "ban", "unban", "set-role"],
  session: ["list", "revoke"],
  
  // Full content management
  content: ["create", "read", "update", "delete", "publish", "moderate"],
  
  // Analytics viewing and exporting
  analytics: ["view", "export"],
  
  // Full support access
  support: ["view", "respond", "escalate", "close"],
  
  // Full project management
  project: ["create", "read", "update", "delete", "assign", "manage"],
  
  // Full team management
  team: ["create", "read", "update", "delete", "invite", "remove"],
});

/**
 * ADMIN ROLE
 * - Standard administrative access
 * - Can manage users and content
 * - Limited system access
 */
export const admin = ac.newRole({
  // Basic admin permissions
  user: ["list", "update", "ban", "unban"],
  session: ["list", "revoke"],
  
  // Content management (no deletion)
  content: ["create", "read", "update", "publish", "moderate"],
  
  // Analytics viewing
  analytics: ["view"],
  
  // Support access
  support: ["view", "respond", "close"],
  
  // Project management (no deletion)
  project: ["create", "read", "update", "assign"],
  
  // Team viewing and updating
  team: ["read", "update", "invite"],
});

/**
 * EMPLOYEE ROLE
 * - Standard employee access
 * - Can manage their own content and projects
 * - Limited user management
 */
export const employee = ac.newRole({
  // Very limited user permissions
  user: ["list"],
  
  // Content creation and editing
  content: ["create", "read", "update"],
  
  // Basic support access
  support: ["view", "respond"],
  
  // Project participation
  project: ["read", "update"],
  
  // Team viewing
  team: ["read"],
});

/**
 * CUSTOMER ROLE
 * - Basic customer access
 * - Can view content and manage their own account
 * - No administrative permissions
 */
export const customer = ac.newRole({
  // Only view content
  content: ["read"],
  
  // Can create support tickets
  support: ["view"],
  
  // Can view projects they're involved in
  project: ["read"],
  
  // Can view team information
  team: ["read"],
});

// Export the access control instance
export { ac };

// Export role hierarchy for easy reference
export const roleHierarchy = {
  founder: 5,
  manager: 4,
  admin: 3,
  employee: 2,
  customer: 1,
} as const;

// Helper function to check if a role has higher or equal permissions than another
export function hasHigherOrEqualRole(userRole: string, requiredRole: string): boolean {
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  return userLevel >= requiredLevel;
}

// Helper function to get all roles with equal or lower permissions
export function getRolesWithLowerPermissions(role: string): string[] {
  const currentLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;
  return Object.entries(roleHierarchy)
    .filter(([_, level]) => level <= currentLevel)
    .map(([roleName]) => roleName);
}