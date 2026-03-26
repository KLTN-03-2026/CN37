import classNames from "classnames/bind";
import styles from "../ActiveSessionsPage.module.scss";
import { Monitor, Smartphone } from "lucide-react";

const cx = classNames.bind(styles);

export default function SessionItem({ session, onLogout }) {
  const getIcon = () => {
    if (session.device.toLowerCase().includes("iphone")) {
      return <Smartphone size={20} />;
    }
    return <Monitor size={20} />;
  };

  return (
    <div className={cx("item")}>
      <div className={cx("icon")}>{getIcon()}</div>

      <div className={cx("info")}>
        <div className={cx("top")}>
          <span className={cx("device")}>{session.device}</span>
          {session.isCurrent && (
            <span className={cx("badge")}>Current</span>
          )}
        </div>

        <div className={cx("meta")}>
          {session.browser} • {session.os} • {session.location}
        </div>
      </div>

      <div className={cx("action")}>
        {session.isCurrent ? (
          <span className={cx("now")}>Now</span>
        ) : (
          <button
            className={cx("btnLogout")}
            onClick={() => onLogout(session.id)}
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  );
}