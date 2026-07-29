import styles from "./Users.module.css";

import UserToolbar from "@/components/admin/users/UserToolbar";
import UserGrid from "@/components/admin/users/UserList";
import UserEmptyState from "@/components/admin/users/UserEmptyState";
import UserModal from "@/components/admin/users/modals/UserModal";

import useUsers from "../../../hooks/users/useUsers";
import useUserFilters from "../../../hooks/users/useUserFilters";
import useUserModal from "../../../hooks/users/useUserModal";


export default function AdminUsuarios() {
  const {
    users,
    loading,
    error,
    fetchUsers,
  } = useUsers();

  const {
    filteredUsers,

    searchTerm,
    setSearchTerm,

    roleFilter,
    setRoleFilter,

    clearFilters,
  } = useUserFilters(users);

  const {
    selectedUser,

    isModalOpen,

    openModal,

    closeModal,
  } = useUserModal();

  if (loading) {
    return (
      <div className={styles.container}>
        <UserEmptyState
          loading
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <UserEmptyState
          error={error}
          onRetry={fetchUsers}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>

      <UserToolbar
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        onSearchChange={setSearchTerm}
        onRoleChange={setRoleFilter}
      />

      <UserGrid
        users={filteredUsers}
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        onClearFilters={clearFilters}
        onUserClick={openModal}
      />

      <UserEmptyState
        hasUsers={users.length > 0}
        onReload={fetchUsers}
      />

      <UserModal
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={closeModal}
      />

    </div>
  );
}