import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AdminUserPage.module.scss";

// 👉 import API mới
import {
  getUserList,
  lockUser,
  unlockUser,
  getUserById,
  updateUser,
  assignUserRole,
  removeUserRole
} from "../../api/UserApi";
import { getAllRole } from "../../api/RoleApi";

import UserTable from "./components/UserTable";
import UserSearch from "./components/UserSearch";
import UserAction from "./components/UserAction";
import UserPreviewModal from "./components/UserPreviewModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { notifyError, notifySuccess } from "../../components/Nofitication";

const cx = classNames.bind(styles);

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);
  const [roles, setRoles] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filters, setFilters] = useState({ page: 1, pageSize: 10 });
  const [confirmState, setConfirmState] = useState({
    open: false,
    userId: null,
    isDisableAction: false,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUserList(filters);
      const role = await getAllRole();
      setRoles(role.data)
      setUsers(res.data?.items || []);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const openConfirm = (id, isDisable) => {
    setConfirmState({
      open: true,
      userId: id,
      isDisableAction: isDisable,
    });
  };

  const handleView = async (id) => {
    const { data } = await getUserById(id);
    setPreviewUser(data);
    setIsPreviewOpen(true);
  };

  const handleChangeRole = async (id, roleId) => {
    setIsPreviewOpen(false);
    const res = await assignUserRole(id, roleId)
    if (res){
      notifySuccess("Gán vai trò thành công");
    }
    fetchUsers();
    const { data } = await getUserById(id);
    setPreviewUser(data);
    setIsPreviewOpen(true);
  }

  const handleRemoveRole = async (id, roleId) => {
    setIsPreviewOpen(false);
    const res = await removeUserRole(id, roleId);
    if(res){
      notifySuccess("Gỡ vai trò thành công")
    }
    fetchUsers();
    const { data } = await getUserById(id);
    setPreviewUser(data);
    setIsPreviewOpen(true);

  }

  const handleEdit = async (id, form) => {
    const res = await updateUser(id, form);
    if (res){
      notifySuccess("Cập nhật người dùng thành công");
    }else{
      notifyError("Đã có lỗi xảy ra. Vui lòng thử lại!");
    }
    fetchUsers();
  };

  const handleToggle = async () => {
    try {
      if (confirmState.isDisableAction) {
        await lockUser(confirmState.userId);
      } else {
        await unlockUser(confirmState.userId);
      }

      await fetchUsers();
    } catch (err) {
      console.error("Toggle user error:", err);
    } finally {
      setConfirmState({
        open: false,
        userId: null,
        isDisableAction: false,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>Quản lý khách hàng</h2>

        <UserAction isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <UserSearch
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSearch={setFilters}
      />

      <UserTable
        users={users}
        loading={loading}
        onView={handleView}
        onToggleOn={(id) => openConfirm(id, false)}
        onToggleOff={(id) => openConfirm(id, true)}
        onRefresh={fetchUsers}
      />
      {isPreviewOpen && (
        <UserPreviewModal
          user={previewUser}
          roles={roles}
          onEdit={handleEdit}
          onAssignRole={handleChangeRole}
          onRemoveRole={handleRemoveRole}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
      {/* CONFIRM */}
      <ConfirmDialog
        open={confirmState.open}
        title={
          confirmState.isDisableAction
            ? "Vô hiệu hóa tài khoản"
            : "Kích hoạt tài khoản"
        }
        message={
          confirmState.isDisableAction
            ? "Bạn có chắc muốn vô hiệu hóa tài khoản này?"
            : "Bạn có chắc muốn kích hoạt tài khoản này?"
        }
        confirmText={confirmState.isDisableAction ? "Vô hiệu hóa" : "Kích hoạt"}
        cancelText="Hủy"
        onConfirm={handleToggle}
        onCancel={() => setConfirmState({ open: false, userId: null })}
      />
    </div>
  );
};

export default AdminUserPage;
