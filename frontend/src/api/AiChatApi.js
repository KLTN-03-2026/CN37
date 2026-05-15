import api from "./AxiosClient";

// Gửi message tới AI
export const sendMessage = (data) => {
  return api.post("/ai-chat/message", data);
};

// Lấy chi tiết session và lịch sử chat
export const getSession = (sessionId) => {
  return api.get(`/ai-chat/sessions/${sessionId}`);
};

// Lấy danh sách tất cả sessions của user
export const getUserSessions = () => {
  return api.get("/ai-chat/sessions");
};

// Xóa session
export const deleteSession = (sessionId) => {
  return api.delete(`/ai-chat/sessions/${sessionId}`);
};
