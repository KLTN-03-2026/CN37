import classNames from "classnames/bind";
import styles from "../ActiveSessionsPage.module.scss";
import SessionItem from "./SessionItem";

const cx = classNames.bind(styles);

export default function SessionList({ sessions, onLogout, onRefresh }) {
  return (
    <div className={cx("card")}>
      <div className={cx("cardHeader")}>
        <span>{sessions.length} phiên đăng nhập</span>
        <button className={cx("refresh")} onClick={onRefresh}>
          Làm mới
        </button>
      </div>

      <div className={cx("list")}>
        {sessions.map((s) => (
          <SessionItem key={s.id} session={s} onLogout={() => onLogout(s.sessionId)} />
        ))}
      </div>
    </div>
  );
}