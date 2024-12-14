import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export function RegisterPage() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleRegister = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered successfully:", userCredential.user);
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details to create your account"
    >
      <div className="space-y-6">
        <RegisterForm onRegister={handleRegister} />
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