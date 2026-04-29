import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AdminUserPage.module.scss";

// 👉 import API mới
import { getUserList, lockUser, unlockUser } from "../../api/UserApi";

import UserTable from "./components/UserTable";
import UserSearch from "./components/UserSearch";
import UserAction from "./components/UserAction";
import ConfirmDialog from "../../components/ConfirmDialog";

const cx = classNames.bind(styles);

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

      <UserSearch isOpen={isOpen} onClose={() => setIsOpen(false)} onSearch={setFilters} />

      <UserTable
        users={users}
        loading={loading}
        onToggleOn={(id) => openConfirm(id, false)}
        onToggleOff={(id) => openConfirm(id, true)}
        onRefresh={fetchUsers}
      />
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
