import { useCallback, useEffect, useState } from "react";

import { UserService } from "../../services/users/userService";

import type { UserProfile } from "@/types/User";

export default function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response =
        await UserService.getAll();

      setUsers(response);
    } catch (err) {
      console.error(err);

      setError(
        "Erro ao carregar usuários."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
  };
}