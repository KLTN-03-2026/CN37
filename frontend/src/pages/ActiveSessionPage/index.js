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
          <h2>Active Sessions</h2>
          <p>Manage devices currently signed in to your account.</p>
        </div>

        <button className={cx("btnDangerOutline")} onClick={logoutAllSessions}>
          Sign out all other sessions
        </button>
      </div>

      {/* Warning */}
      <div className={cx("warning")}>
        ⚠️ Multiple active sessions detected. Review unrecognized devices and
        sign them out if needed.
      </div>

      {/* Content */}
      {loading ? (
        <div className={cx("loading")}>Loading...</div>
      ) : sessions.length === 0 ? (
        <div className={cx("empty")}>No active sessions</div>
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
