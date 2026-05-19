import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AdminUserPage.module.scss";
import Pagination from "../../helper/Pagination";

// 👉 import API mới
import {
  createUser,
  getUserList,
  lockUser,
  unlockUser,
  getUserById,
  updateUser,
  assignUserRole,
  removeUserRole,
  softDeleteUser,
  exportToExcel,
} from "../../api/UserApi";
import { getAllRole } from "../../api/RoleApi";

import UserTable from "./components/UserTable";
import UserSearch from "./components/UserSearch";
import UserAction from "./components/UserAction";
import UserPreviewModal from "./components/UserPreviewModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import CreateModal from "./components/CreateModal";
import { notifyError, notifySuccess } from "../../components/Nofitication";
import { FileSpreadsheet } from "lucide-react";

const cx = classNames.bind(styles);

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);
  const [roles, setRoles] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filters, setFilters] = useState({ page: 1, pageSize: 10 });
  const [confirmState, setConfirmState] = useState({
    open: false,
    userId: null,
    isDisableAction: false,
  });
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    userId: null,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUserList(filters);

      const role = await getAllRole();
      setRoles(role.data);

      const data = res.data;

      setUsers(data.items || []);

      setPagination({
        currentPage: data.page,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
        totalItems: data.total,
      });
    } catch (err) {
      console.error("Lỗi tải khách hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const openConfirm = (id, isDisable) => {
    setConfirmState({
      open: true,
      userId: id,
      isDisableAction: isDisable,
    });
  };

  const openConfirmDelete = (id) => {
    setConfirmDelete({
      open: true,
      userId: id,
    });
  };

  const handleChangePage = (page) => {
    setFilters((prev) => ({
      ...prev,
      page: page,
    }));
  };

  const handleView = async (id) => {
    const { data } = await getUserById(id);
    setPreviewUser(data);
    setIsPreviewOpen(true);
  };

  const handleCreateUser = async (form) => {
    try {
      const res = await createUser(form);
      if (res) {
        notifySuccess("Thêm khách hàng thành công");
      }
      setIsCreate(false);
      fetchUsers();
    } catch (error) {
      const errMsg = error.response?.data.message || "Tạo khách hàng thất bại";
      notifyError(errMsg);
    }
  };

  const handleChangeRole = async (id, roleId) => {
    setIsPreviewOpen(false);
    const res = await assignUserRole(id, roleId);
    if (res) {
      notifySuccess("Gán vai trò thành công");
    }
    fetchUsers();
    const { data } = await getUserById(id);
    setPreviewUser(data);
    setIsPreviewOpen(true);
  };

  const handleDelete = async () => {
    try {
      await softDeleteUser(confirmDelete.userId);
      notifySuccess("Xóa khách hàng thành công");
      setConfirmDelete({ open: false, userId: null });
      fetchUsers();
    } catch (error) {
      notifyError("Xóa khách hàng thất bại");
    }
  };

  const handleRemoveRole = async (id, roleId) => {
    setIsPreviewOpen(false);
    const res = await removeUserRole(id, roleId);
    if (res) {
      notifySuccess("Gỡ vai trò thành công");
    }
    fetchUsers();
    const { data } = await getUserById(id);
    setPreviewUser(data);
    setIsPreviewOpen(true);
  };

  const handleEdit = async (id, form) => {
    const res = await updateUser(id, form);
    if (res) {
      notifySuccess("Cập nhật người dùng thành công");
    } else {
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

  const handleExportExcel = async () => {
    try {
      await exportToExcel();
    } catch (err) {
      console.error("Export Excel error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>Quản lý khách hàng</h2>

        <UserAction
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isCreate={isCreate}
          setIsCreate={setIsCreate}
          onExportExcel={handleExportExcel}
        />
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
        onDelete={(id) => openConfirmDelete(id)}
        onRefresh={fetchUsers}
      />
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handleChangePage}
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
      {isCreate && (
        <CreateModal
          roles={roles}
          onCreate={handleCreateUser}
          onClose={() => setIsCreate(false)}
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

      <ConfirmDialog
        open={confirmDelete.open}
        title="Xóa tài khoản"
        message="Bạn có chắc muốn xóa tài khoản này?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ open: false, userId: null })}
      />
    </div>
  );
};

export default AdminUserPage;
