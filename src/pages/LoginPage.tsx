import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <div className="space-y-6">
        <LoginForm />
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?
          </p>
          <Button variant="link" onClick={() => navigate("/register")}>
            Create an account
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}