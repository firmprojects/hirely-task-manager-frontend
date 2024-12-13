import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && router.pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}
