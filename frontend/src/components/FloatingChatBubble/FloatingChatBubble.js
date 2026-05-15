import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./FloatingChatBubble.module.scss";
import { FaRobot, FaTimes } from "react-icons/fa";
import FloatingChatModal from "./FloatingChatModal";

const cx = classNames.bind(styles);

export default function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);

    // Listen for auth changes
    const handleAuthChange = () => {
      const newToken = localStorage.getItem("accessToken");
      setIsAuthenticated(!!newToken);
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  if (!isAuthenticated) {
    return null; // Don't show bubble if not authenticated
  }

  return (
    <>
      <div className={cx("floatingBubble")} onClick={() => setIsOpen(true)}>
        <FaRobot className={cx("icon")} />
        <span className={cx("label")}>Chat</span>
      </div>

      {isOpen && (
        <FloatingChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
