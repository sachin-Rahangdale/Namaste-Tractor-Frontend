import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== AUTH ====================
export const login = (username, password) =>
  api.post("/user/login", { username, password });

export const register = (name, username, password) =>
  api.post("/user/create", { name, username, password });

export const verifyEmail = (token) => api.get(`/user/verify?token=${token}`);

// ==================== ENQUIRY ====================
export const createEnquiry = (data) => api.post("/enquiries", data);
export const getEnquiries = () => api.get("/enquiries");
export const updateEnquiryStatus = (id, status) =>
  api.put(`/enquiries/${id}/status?progress=${status}`);
export const deleteEnquiry = (id) => api.delete(`/enquiries/${id}`);

// ==================== PRODUCTS ====================
export const getProducts = (page = 0, size = 10) =>
  api.get(`/products?page=${page}&size=${size}`);
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const uploadProductImages = (id, formData) =>
  api.post(`/products/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  export const getMyProducts = (page = 0, size = 10) =>
  api.get(`/products/my?page=${page}&size=${size}`);
export const filterProducts = (params) =>
  api.get("/products/filter", { params });
export const getProductsByCity = (city, page = 0, size = 10) =>
  api.get(`/products/city/${city}?page=${page}&size=${size}`);

// ==================== TRACTORS ====================
export const getTractors = (page = 0, size = 10) =>
  api.get(`/tractors?page=${page}&size=${size}`);
export const getTractorById = (id) => api.get(`/tractors/${id}`);
export const createTractor = (data) => api.post("/tractors", data);
export const updateTractor = (id, data) => api.put(`/tractors/${id}`, data);
export const deleteTractor = (id) => api.delete(`/tractors/${id}`);
export const uploadTractorImages = (id, type, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  return api.post(`/tractors/${id}/images?type=${type}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const filterTractors = (params) =>
  api.get("/tractors/filter", { params });
export const getTractorsByBrand = (brandId, page = 0, size = 10) =>
  api.get(`/tractors/brand/${brandId}?page=${page}&size=${size}`);

// ==================== BRANDS ====================
export const getBrands = () => api.get("/brands");
export const getBrandById = (id) => api.get(`/brands/${id}`);
export const createBrand = (name) => api.post("/brands", { name });
export const updateBrand = (id, name) => api.put(`/brands/${id}?name=${name}`);
export const deleteBrand = (id) => api.delete(`/brands/${id}`);

// ==================== ARTICLES ====================
export const getArticles = (page = 0, size = 10) =>
  api.get(`/articles?page=${page}&size=${size}`);
export const getArticleBySlug = (slug) => api.get(`/articles/${slug}`);
export const getArticleById = (id) => api.get(`/articles/id/${id}`);
export const getPendingArticles = (page = 0, size = 10) =>
  api.get(`/articles/pending?page=${page}&size=${size}`);
export const createArticle = (title, content, mainImageFile) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("mainImage", mainImageFile);
  return api.post("/articles", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const uploadArticleImages = (id, imagesFiles) => {
  const formData = new FormData();
  imagesFiles.forEach(file => formData.append("images", file));
  return api.post(`/articles/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const approveArticle = (id) => api.put(`/articles/${id}/approve`);
export const rejectArticle = (id, reason) =>
  api.put(`/articles/${id}/reject?reason=${reason}`);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);
export const getComments = (articleId, page = 0, size = 10) =>
  api.get(`/articles/${articleId}/comments?page=${page}&size=${size}`);
export const postComment = (articleId, content) =>
  api.post(`/articles/${articleId}/comments`, { content });

export default api;