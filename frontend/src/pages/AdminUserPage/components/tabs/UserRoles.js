import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./UserRoles.module.scss";

import ConfirmDialog from "../../../../components/ConfirmDialog";
import { notifyError } from "../../../../components/Nofitication";

const cx = classNames.bind(styles);

export default function UserRoles({ user, roles, onAssign, onRemove }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [removeId, setRemoveId] = useState(null);
  const [removeName, setRemoveName] = useState(null);

  const handleAssign = () => {
    if (!selectedRole) return;

    if (user.roles?.some((r) => r.id === Number(selectedRole))) {
      return notifyError("User đã có role này");
    }

    onAssign(Number(selectedRole));
    setSelectedRole("");
  };

  const handleAskRemove = (id, name) => {
    setShowConfirm(true);
    setRemoveId(id);
    setRemoveName(name);
    console.log(name);
    console.log(id);
  };

  return (
    <div className={cx("card")}>
      {/* CURRENT ROLES */}
      <div className={cx("section")}>
        <h4>Vai trò hiện tại</h4>

        <div className={cx("roles")}>
          {user.roles?.length ? (
            user.roles.map((r) => (
              <span key={r.id} className={cx("role")}>
                {r.name}
                <span
                  className={cx("remove")}
                  onClick={() => handleAskRemove(r.id, r.name)}
                >
                  ✕
                </span>
              </span>
            ))
          ) : (
            <span className={cx("empty")}>Chưa có role</span>
          )}
        </div>
      </div>

      {/* ADD ROLE */}
      <div className={cx("section")}>
        <h4>Thêm vai trò</h4>

        <div className={cx("actions")}>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">-- chọn role --</option>

            {roles
              .filter((r) => !user.roles?.some((ur) => ur.id === r.id))
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
          </select>

          <button
            className={cx("btnAdd")}
            onClick={handleAssign}
            disabled={!selectedRole}
          >
            + Thêm
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Gỡ vai trò"
        message={`Bạn có chắc muốn gỡ vai trò ${removeName} khỏi tài khoản này?`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={() => {
          onRemove(Number(removeId));
          setShowConfirm(false);
          setRemoveId(null);
          setRemoveName(null);
        }}
        onCancel={() => {
          setShowConfirm(false);
        }}
      />
    </div>
  );
}
