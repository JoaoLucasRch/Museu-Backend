import { useState } from "react";

import type { UserProfile } from "@/types/User";

export default function useUserModal() {
  const [selectedUser, setSelectedUser] =
    useState<UserProfile | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);


  function openModal(user: UserProfile) {
    setSelectedUser(user);
    setIsModalOpen(true);
  }


  function closeModal() {
    setSelectedUser(null);
    setIsModalOpen(false);
  }


  return {
    selectedUser,
    isModalOpen,
    openModal,
    closeModal,
  };
}