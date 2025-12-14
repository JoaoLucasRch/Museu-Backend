// src/pages/dashboard/Dashboard.tsx
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token'); // Limpa o token
    navigate('/login'); // Chuta de volta pro login
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bem-vindo ao Dashboard!</h1>
      <p>Você está logado numa rota privada.</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}