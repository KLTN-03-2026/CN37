import classNames from "classnames/bind";
import styles from "./UserInfo.module.scss";

const cx = classNames.bind(styles);

export default function UserInfo({ user }) {
  return (
    <div className={cx("card")}>
      <div className={cx("grid")}>
        <div className={cx("item")}>
          <span className={cx("label")}>Email</span>
          <span className={cx("value")}>{user.email}</span>
        </div>

        <div className={cx("item")}>
          <span className={cx("label")}>Họ tên</span>
          <span className={cx("value")}>{user.fullName || "-"}</span>
        </div>

        <div className={cx("item")}>
          <span className={cx("label")}>SĐT</span>
          <span className={cx("value")}>{user.phone || "-"}</span>
        </div>

        <div className={cx("item")}>
          <span className={cx("label")}>Vai trò</span>
          <div className={cx("roles")}>
            {user.roles?.length ? (
              user.roles.map((r, i) => (
                <span key={i} className={cx("role")}>
                  {r.name}
                </span>
              ))
            ) : (
              <span className={cx("empty")}>Không có</span>
            )}
          </div>
        </div>

        <div className={cx("item")}>
          <span className={cx("label")}>Trạng thái</span>
          <span
            className={cx("status", {
              active: user.isActive,
              lock: !user.isActive,
            })}
          >
            {user.isActive ? "Hoạt động" : "Bị khóa"}
          </span>
        </div>

        <div className={cx("item")}>
          <span className={cx("label")}>Xác minh</span>
          <span
            className={cx("status", {
              verified: user.emailVerified,
              unVerified: !user.emailVerified,
            })}
          >
            {user.emailVerified ? "Đã xác minh" : "Chưa xác minh"}
          </span>
        </div>
      </div>
    </div>
  );
}
