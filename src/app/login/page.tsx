import { AuthLayout } from "@/components/shared/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Access Your Nexus"
      description="Log in to continue your PoW journey."
    >
      <LoginForm />
    </AuthLayout>
  );
}
