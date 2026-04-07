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

// Auth endpoints
export const login = (username, password) =>
  api.post("/user/login", { username, password });

export const register = (name, username, password) =>
  api.post("/user/create", { name, username, password });

export const verifyEmail = (token) => api.get(`/user/verify?token=${token}`);

// Enquiry endpoints (we'll use later)
export const createEnquiry = (data) => api.post("/enquiries", data);
export const getEnquiries = () => api.get("/enquiries");
export const updateEnquiryStatus = (id, status) =>
  api.put(`/enquiries/${id}/status?progress=${status}`);

// Products
export const getProducts = (page = 0, size = 10) =>
  api.get(`/products?page=${page}&size=${size}`);
export const getProductById = (id) => api.get(`/products/${id}`);
export const filterProducts = (params) =>
  api.get("/products/filter", { params });
export const getProductsByCity = (city, page = 0, size = 10) =>
  api.get(`/products/city/${city}?page=${page}&size=${size}`);
export const createProduct = (data) => api.post("/products", data);
export const uploadProductImages = (id, formData) =>
  api.post(`/products/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Tractors
export const getTractors = (page = 0, size = 10) =>
  api.get(`/tractors?page=${page}&size=${size}`);
export const getTractorById = (id) => api.get(`/tractors/${id}`);
export const filterTractors = (params) =>
  api.get("/tractors/filter", { params });
export const getTractorsByBrand = (brandId, page = 0, size = 10) =>
  api.get(`/tractors/brand/${brandId}?page=${page}&size=${size}`);

// Brands
export const getBrands = () => api.get("/brands");

// Articles
export const getArticles = (page = 0, size = 10) =>
  api.get(`/articles?page=${page}&size=${size}`);
export const getArticleBySlug = (slug) => api.get(`/articles/${slug}`);
export const getArticleById = (id) => api.get(`/articles/id/${id}`);
export const getComments = (articleId, page = 0, size = 10) =>
  api.get(`/articles/${articleId}/comments?page=${page}&size=${size}`);
export const postComment = (articleId, content) =>
  api.post(`/articles/${articleId}/comments`, { content });

export default api;