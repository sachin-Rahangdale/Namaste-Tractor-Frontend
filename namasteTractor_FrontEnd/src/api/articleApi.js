import api from "./axios";

export const getArticles = () => {
  return api.get("/articles");
};

export const getArticleBySlug = (slug) => {
  return api.get(`/articles/${slug}`);
};

export const createArticle = (title, content, mainImage) => {
  const formData = new FormData();

  formData.append("mainImage", mainImage);

  return api.post("/articles", formData, {
    params: {
      title,
      content,
    },
  });
};

export const uploadArticleImages = (id, images) => {
  const formData = new FormData();

  images.forEach((img) => {
    formData.append("images", img);
  });

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