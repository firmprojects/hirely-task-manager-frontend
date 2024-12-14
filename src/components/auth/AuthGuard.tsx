import { useAuth } from "@/contexts/auth-context";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && location.pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}
