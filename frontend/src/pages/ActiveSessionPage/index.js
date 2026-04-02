import { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./ActiveSessionsPage.module.scss";
import SessionList from "./components/SessionList";
import { getSessions, logoutSessionId } from "../../api/SessionApi";
import { notifyError, notifySuccess } from "../../components/Nofitication";

const cx = classNames.bind(styles);

export default function ActiveSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const refreshtoken = localStorage.getItem("refreshToken");
      const res = await getSessions(refreshtoken);
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logoutSession = async (sessionId) => {
    try {
      const res = await logoutSessionId(sessionId);
      if (res) {
        notifySuccess("Đăng xuất thành công");
        fetchSessions();
      }
    } catch (error) {
      const errMsg = error.response?.data || "Đăng nhập thất bại";
      notifyError(errMsg);
    }
  };

  const logoutAllSessions = async () => {
    await axios.post("/api/auth/logout-all");
    fetchSessions();
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className={cx("wrapper")}>
      {/* Header */}
      <div className={cx("header")}>
        <div>
          <h2>Quản lý phiên đăng nhập</h2>
          <p>Quản lý các thiết bị đang đăng nhập vào tài khoản của bạn.</p>
        </div>

        <button className={cx("btnDangerOutline")} onClick={logoutAllSessions}>
          Đăng xuất tất cả các phiên khác
        </button>
      </div>

      {/* Warning */}
      <div className={cx("warning")}>
        ⚠️ Nếu bạn thấy thiết bị hoặc vị trí nào không nhận ra, hãy đăng xuất khỏi phiên đó ngay lập tức.
      </div>

      {/* Content */}
      {loading ? (
        <div className={cx("loading")}>Loading...</div>
      ) : sessions.length === 0 ? (
        <div className={cx("empty")}>Không có phiên đăng nhập nào.</div>
      ) : (
        <SessionList
          sessions={sessions}
          onLogout={logoutSession}
          onRefresh={fetchSessions}
        />
      )}
    </div>
  );
}
