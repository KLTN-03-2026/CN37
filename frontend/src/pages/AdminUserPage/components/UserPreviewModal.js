import classNames from "classnames/bind";
import styles from "./UserPreviewModal.module.scss";

import { AiFillEdit } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";
import { FaSave, FaKey, FaUserShield } from "react-icons/fa";

import { useUserForm } from "../../../hooks/useUserForm";

import UserInfo from "./tabs/UserInfo";
import EditUserInfo from "./tabs/EditUserInfo";
import UserRoles from "./tabs/UserRoles";
import UserSecurity from "./tabs/UserSecurity";

const cx = classNames.bind(styles);

export default function UserPreviewModal({
  user,
  roles,
  onEdit,
  onAssignRole,
  onRemoveRole,
  onResetPassword,
  onClose,
}) {
  const {
    formData,
    isEditMode,
    toggleEdit,
    handleChange,
    handleSubmit,
    activeTab,
    setActiveTab,
    loading,
    handleAssignRole,
    handleRemoveRole,
  } = useUserForm(user, onEdit, onAssignRole, onRemoveRole);

  if (!formData) return null;

  return (
    <div className={cx("overlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className={cx("header")}>
          <h3>👤 {formData.email}</h3>

          <div className={cx("actions")}>
            {isEditMode ? (
              <>
                <button onClick={toggleEdit}><TiCancel /></button>
                <button onClick={handleSubmit} disabled={loading}>
                  <FaSave />
                </button>
              </>
            ) : (
              <button onClick={toggleEdit}><AiFillEdit /></button>
            )}

            <button onClick={onClose}>✕</button>
          </div>
        </div>

        {/* TABS */}
        <div className={cx("tabs")}>
          <button
            className={cx({ active: activeTab === "info" })}
            onClick={() => setActiveTab("info")}
          >
            Thông tin
          </button>

          <button
            className={cx({ active: activeTab === "roles" })}
            onClick={() => setActiveTab("roles")}
          >
            <FaUserShield /> Phân quyền
          </button>

          <button
            className={cx({ active: activeTab === "security" })}
            onClick={() => setActiveTab("security")}
          >
            <FaKey /> Bảo mật
          </button>
        </div>

        {/* BODY */}
        <div className={cx("body")}>

          {activeTab === "info" && (
            isEditMode
              ? <EditUserInfo data={formData} onChange={handleChange} />
              : <UserInfo user={formData} />
          )}

          {activeTab === "roles" && (
            <UserRoles
              user={formData}
              roles={roles}
              onAssign={handleAssignRole}
              onRemove={handleRemoveRole}
            />
          )}

          {activeTab === "security" && (
            <UserSecurity
              user={formData}
              onResetPassword={onResetPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
}