import { useEffect, useState, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./FloatingChatModal.module.scss";
import { FaTimes } from "react-icons/fa";
import { sendMessage, getUserSessions, getSession, deleteSession } from "../../api/AiChatApi";

const cx = classNames.bind(styles);

export default function FloatingChatModal({ isOpen, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);

  // Load user sessions
  useEffect(() => {
    if (!isOpen) return;

    const loadSessions = async () => {
      try {
        setIsLoadingSessions(true);
        const response = await getUserSessions();
        setSessions(response.data || []);
      } catch (error) {
        console.error("Failed to load sessions:", error);
      } finally {
        setIsLoadingSessions(false);
      }
    };

    loadSessions();
  }, [isOpen]);

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      const loadSession = async () => {
        try {
          const response = await getSession(currentSessionId);
          setCurrentMessages(response.data.messages || []);
        } catch (error) {
          console.error("Failed to load session:", error);
        }
      };

      loadSession();
    }
  }, [currentSessionId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    setLoading(true);
    const userMessage = inputValue;
    setInputValue("");

    // Add user message to UI immediately
    const newUserMessage = {
      role: "user",
      message: userMessage,
      createdAt: new Date().toISOString(),
    };
    setCurrentMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await sendMessage({
        sessionId: currentSessionId || null,
        message: userMessage,
      });

      // Update session ID if new session
      if (!currentSessionId && response.data.sessionId) {
        setCurrentSessionId(response.data.sessionId);

        // Reload sessions list
        const sessionsResponse = await getUserSessions();
        setSessions(sessionsResponse.data || []);
      }

      // Add AI response
      const aiMessage = {
        role: "assistant",
        message: response.data.message,
        createdAt: new Date().toISOString(),
      };
      setCurrentMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);

      // Remove user message on error
      setCurrentMessages((prev) => prev.slice(0, -1));

      // Show error message
      const errorMessage = {
        role: "assistant",
        message: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.",
        createdAt: new Date().toISOString(),
      };
      setCurrentMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle create new session
  const handleNewSession = () => {
    setCurrentSessionId(null);
    setCurrentMessages([]);
    setInputValue("");
    setShowSidebar(false);
  };

  // Handle select session
  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setShowSidebar(false);
  };

  // Handle delete session
  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteSession(sessionId);

      // Remove from sessions list
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));

      // Clear current session if deleted
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setCurrentMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSessionTitle = (session) => {
    if (session.messages && session.messages.length > 0) {
      const firstMessage = session.messages[0];
      return firstMessage.message.substring(0, 20) +
        (firstMessage.message.length > 20 ? "..." : "");
    }
    return "New Chat";
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cx("modalOverlay")} onClick={onClose}>
      <div className={cx("modalContainer")} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={cx("modalHeader")}>
          <div className={cx("headerContent")}>
            <h3>AI Assistant</h3>
            <p className={cx("subtitle")}>Trợ lý ảo của bạn</p>
          </div>
          <button
            className={cx("closeBtn")}
            onClick={onClose}
            title="Đóng"
          >
            <FaTimes />
          </button>
        </div>

        <div className={cx("modalContent")}>
          {/* Sidebar */}
          <div className={cx("sidebar", { active: showSidebar })}>
            <button className={cx("newChatBtn")} onClick={handleNewSession}>
              + Cuộc trò chuyện mới
            </button>

            <div className={cx("sessionList")}>
              {isLoadingSessions ? (
                <p className={cx("noSessions")}>Đang tải...</p>
              ) : sessions.length === 0 ? (
                <p className={cx("noSessions")}>Chưa có cuộc trò chuyện</p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cx("sessionItem", {
                      active: session.id === currentSessionId,
                    })}
                    onClick={() => handleSelectSession(session.id)}
                  >
                    <div className={cx("sessionInfo")}>
                      <div className={cx("sessionTitle")}>
                        {getSessionTitle(session)}
                      </div>
                      <div className={cx("sessionDate")}>
                        {formatDate(session.createdAt)}
                      </div>
                    </div>
                    <button
                      className={cx("deleteBtn")}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Xóa cuộc trò chuyện này?")) {
                          handleDeleteSession(session.id);
                        }
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main Chat */}
          <div className={cx("mainChat")}>
            {!currentSessionId && currentMessages.length === 0 ? (
              <div className={cx("emptyState")}>
                <div className={cx("emptyIcon")}>💬</div>
                <p>Bắt đầu cuộc trò chuyện</p>
                <p className={cx("emptySubtitle")}>
                  Nhập câu hỏi hoặc tin nhắn của bạn dưới đây
                </p>
              </div>
            ) : (
              <>
                <div className={cx("messagesContainer")}>
                  {currentMessages.map((msg, index) => (
                    <div key={index} className={cx("message", msg.role)}>
                      <div className={cx("messageContent")}>
                        <p>{msg.message}</p>
                        <span className={cx("messageTime")}>
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className={cx("message", "assistant")}>
                      <div className={cx("messageContent")}>
                        <div className={cx("loadingDots")}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </>
            )}

            {/* Input */}
            <form className={cx("inputSection")} onSubmit={handleSendMessage}>
              <button
                type="button"
                className={cx("sidebarToggle")}
                onClick={() => setShowSidebar(!showSidebar)}
              >
                ☰
              </button>
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !inputValue.trim()}>
                Gửi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
