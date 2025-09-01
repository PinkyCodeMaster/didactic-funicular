import { useState, useEffect } from 'react';
import { authClient } from '../lib/auth-client';
import { hasHigherOrEqualRole } from '../../../backend/src/lib/permissions';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface PermissionCheck {
  [resource: string]: string[];
}

export function usePermissions() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.user) {
          setUser(session.user as User);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  /**
   * Check if the current user has specific permissions
   */
  const hasPermission = async (permissions: PermissionCheck): Promise<boolean> => {
    if (!user) return false;

    try {
      const result = await authClient.admin.hasPermission({
        permissions,
      });
      return result || false;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  };

  /**
   * Check if the current user has a specific role or higher
   */
  const hasRole = (requiredRole: string): boolean => {
    if (!user?.role) return false;
    return hasHigherOrEqualRole(user.role, requiredRole);
  };

  /**
   * Check if the current user can perform admin actions
   */
  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  /**
   * Check if the current user is a manager or higher
   */
  const isManager = (): boolean => {
    return hasRole('manager');
  };

  /**
   * Check if the current user is a founder
   */
  const isFounder = (): boolean => {
    return user?.role === 'founder';
  };

  /**
   * Check role-based permissions without server call
   */
  const checkRolePermission = (permissions: PermissionCheck, role?: string): boolean => {
    const targetRole = role || user?.role;
    if (!targetRole) return false;

    try {
      return authClient.admin.checkRolePermission({
        permissions,
        role: targetRole,
      });
    } catch (error) {
      console.error('Error checking role permissions:', error);
      return false;
    }
  };

  /**
   * Get user's role with fallback
   */
  const getUserRole = (): string => {
    return user?.role || 'customer';
  };

  /**
   * Check if user can manage other users
   */
  const canManageUsers = (): boolean => {
    return checkRolePermission({
      user: ['list', 'update']
    });
  };

  /**
   * Check if user can create content
   */
  const canCreateContent = (): boolean => {
    return checkRolePermission({
      content: ['create']
    });
  };

  /**
   * Check if user can view analytics
   */
  const canViewAnalytics = (): boolean => {
    return checkRolePermission({
      analytics: ['view']
    });
  };

  /**
   * Check if user can manage system settings
   */
  const canManageSystem = (): boolean => {
    return checkRolePermission({
      system: ['configure']
    });
  };

  /**
   * Check if user can manage billing
   */
  const canManageBilling = (): boolean => {
    return checkRolePermission({
      billing: ['manage']
    });
  };

  /**
   * Check if user can impersonate other users
   */
  const canImpersonate = (): boolean => {
    return checkRolePermission({
      user: ['impersonate']
    });
  };

  /**
   * Check if user can ban other users
   */
  const canBanUsers = (): boolean => {
    return checkRolePermission({
      user: ['ban']
    });
  };

  /**
   * Get role display name with proper formatting
   */
  const getRoleDisplayName = (role?: string): string => {
    const targetRole = role || user?.role || 'customer';
    return targetRole.charAt(0).toUpperCase() + targetRole.slice(1);
  };

  /**
   * Get role color for UI display
   */
  const getRoleColor = (role?: string): string => {
    const targetRole = role || user?.role;
    switch (targetRole) {
      case 'founder': return 'purple';
      case 'manager': return 'blue';
      case 'admin': return 'green';
      case 'employee': return 'yellow';
      case 'customer': return 'gray';
      default: return 'gray';
    }
  };

  return {
    user,
    loading,
    hasPermission,
    hasRole,
    isAdmin,
    isManager,
    isFounder,
    checkRolePermission,
    getUserRole,
    canManageUsers,
    canCreateContent,
    canViewAnalytics,
    canManageSystem,
    canManageBilling,
    canImpersonate,
    canBanUsers,
    getRoleDisplayName,
    getRoleColor,
  };
}