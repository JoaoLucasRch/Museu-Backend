// src/hooks/useAuth.ts

export default function useAuth() {
  return {
    token: localStorage.getItem("token"),
  };
}