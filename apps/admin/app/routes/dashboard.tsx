import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/dashboard";
import { useAuth } from "~/hooks/use-auth";
import { usePermissions } from "~/hooks/usePermissions";
import { AdminDashboard } from "~/components/admin-dashboard";
import { Alert, AlertDescription } from "~/components/ui/alert";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard - Oakford" },
    { name: "description", content: "Comprehensive admin dashboard for user and system management" },
  ];
}

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { isAdmin, loading: permissionsLoading, getUserRole, getRoleDisplayName } = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100 mx-auto"></div>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  // Check if user has admin permissions
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Alert variant="destructive">
            <AlertDescription>
              Access denied. You need admin privileges to access this dashboard.
              <br />
              Current role: {getRoleDisplayName()}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="border-b bg-white dark:bg-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Welcome back, {user?.name || user?.email} ({getRoleDisplayName()})
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <AdminDashboard />
    </div>
  );
}