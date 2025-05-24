import { AuthLayout } from "@/components/shared/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Join the Crypton Nexus"
      description="Create your account to start mining and earning."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
