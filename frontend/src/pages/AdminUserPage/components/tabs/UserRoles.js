import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./UserRoles.module.scss";

const cx = classNames.bind(styles);

export default function UserRoles({ user, roles, onAssign }) {
  const [selectedRole, setSelectedRole] = useState("");

  const handleAssign = () => {
    if (!selectedRole) return;
    onAssign(selectedRole);
    setSelectedRole("");
  };

  return (
    <div className={cx("card")}>

      {/* CURRENT ROLES */}
      <div className={cx("section")}>
        <h4>Vai trò hiện tại</h4>

        <div className={cx("roles")}>
          {user.roles?.length ? (
            user.roles.map((r) => (
              <span key={r} className={cx("role")}>
                {r}
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
            {roles.map((r) => (
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

    </div>
  );
}