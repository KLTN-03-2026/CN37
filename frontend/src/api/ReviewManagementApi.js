import api from "./AxiosClient";

export const getAllReview = (params) => {
  return api.get("/reviews/management/all", { params });
};

export const getStatistics = (productId = null) => {
  const params = productId ? { productId } : {};
  return api.get("/reviews/management/statistics", { params });
};

export const addReply = (reviewId, reply) => {
  return api.post("/reviews/management/reply", {
    reviewId,
    reply,
  });
};

export const updateReply = (replyId, reviewId, reply) => {
  return api.put(`/reviews/management/reply/${replyId}`, {
    reviewId,
    reply,
  });
};

export const deleteReply = (replyId) => {
  return api.delete(`/reviews/management/reply/${replyId}`);
};

