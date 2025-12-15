import AuthLayout from "../../components/authentication/AuthLayout";
import Loginform from "../../components/authentication/login";

export default function Login() {
  return (
    <AuthLayout
      title="Bem-vindo ao espaço de criação dos artistas"
      subtitle="Entre para continuar explorando arte"
    >
      <Loginform />
    </AuthLayout>
  );
}
