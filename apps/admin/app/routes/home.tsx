import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useAuth } from "~/hooks/use-auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Oakford Admin" },
    { name: "description", content: "Oakford Admin Panel" },
  ];
}

export default function Home() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100 mx-auto"></div>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
