import AuthLayout from "@/components/layouts/AuthLayout/index.tsx";
import RegisterForm from "@/components/authentication/register/RegisterForm";

export default function Register() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}