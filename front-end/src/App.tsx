import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

import Dashboard from "./pages/Artist/Dashboard";

import AdminDashboard from "./pages/Admin/Dashboard";
import AdminEventos from "./pages/Admin/Events";
import AdminObras from "./pages/Admin/Artworks";
import AdminUsuarios from "./pages/Admin/Users";
import AdminProfile from "./pages/Admin/Profile";

import RoomPage from "@/pages/Rooms/RoomPage";

import { PrivateRoute } from "@/components";
import AdminLayout from "@/components/layouts/AdminLayout/AdminLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/register" element={<Register />} />

      <Route path="/login" element={<Login />} />

      <Route path="/reset-password" element={<Login />} />

      <Route
        path="/salas/:slug"
        element={<RoomPage />}
      />

      {/* Dashboard do artista */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Dashboard administrativo */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="eventos"
          element={<AdminEventos />}
        />

        <Route
          path="obras"
          element={<AdminObras />}
        />

        <Route
          path="usuarios"
          element={<AdminUsuarios />}
        />

        <Route
          path="perfil"
          element={<AdminProfile />}
        />

      </Route>
    </Routes>
  );
}

export default App;