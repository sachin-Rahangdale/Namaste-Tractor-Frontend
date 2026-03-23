import api from "./axios";

export const getArticles = () => {
  return api.get("/articles");
};

export const getArticleBySlug = (slug) => {
  return api.get(`/articles/${slug}`);
};

export const createArticle = (data) => {
  return api.post("/articles", data);
};

export const uploadArticleImage = (id, formData) => {
  return api.post(`/articles/${id}/images`, formData);
};

// ADMIN
export const getPendingArticles = () => {
  return api.get("/articles/pending");
};

export const approveArticle = (id) => {
  return api.put(`/articles/${id}/approve`);
};

export const rejectArticle = (id) => {
  return api.put(`/articles/${id}/reject`);
};

export const deleteArticle = (id) => {
  return api.delete(`/articles/${id}`);
};