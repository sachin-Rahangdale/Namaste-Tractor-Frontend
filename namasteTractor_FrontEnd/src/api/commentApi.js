import api from "./axios";

export const getComments = (articleId, page = 0) => {
  return api.get(`/articles/${articleId}/comments?page=${page}`);
};

export const addComment = (articleId, data) => {
  return api.post(`/articles/${articleId}/comments`, data);
};

export const deleteComment = (id) => {
  return api.delete(`/comments/${id}`);
};