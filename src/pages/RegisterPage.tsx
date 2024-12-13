import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details to create your account"
    >
      <div className="space-y-6">
        <RegisterForm />
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?
          </p>
          <Button variant="link" onClick={() => navigate("/login")}>
            Login here
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}