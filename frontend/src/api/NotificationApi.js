import api from "./AxiosClient";

export const fetchNotifications = (userId) => {
  return api.get(`/notifications/user/${userId}`);
}

export const markNotificationAsRead = (notificationId) => {
  return api.post(`/notifications/${notificationId}/read`);
}