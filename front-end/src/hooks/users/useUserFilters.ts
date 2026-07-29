import { useMemo, useState } from "react";

import type { UserProfile } from "@/types/User";

type RoleFilter =
  | "todos"
  | "ADMIN"
  | "ARTISTA";

export default function useUserFilters(
  users: UserProfile[]
) {
  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    roleFilter,
    setRoleFilter,
  ] = useState<RoleFilter>("todos");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.nome
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesRole =
        roleFilter === "todos" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    users,
    searchTerm,
    roleFilter,
  ]);

  function clearFilters() {
    setSearchTerm("");
    setRoleFilter("todos");
  }

  return {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    clearFilters,
  };
}