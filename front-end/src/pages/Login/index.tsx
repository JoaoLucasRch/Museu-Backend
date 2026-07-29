import AuthLayout from "@/components/layouts/AuthLayout/index.tsx";
import { LoginForm } from "@/components/authentication/login";

export default function Login() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}