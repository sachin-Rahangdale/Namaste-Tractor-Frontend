import api from "./axios";

// GET all tractors
export const getTractors = (page = 0) => {
  return api.get(`/tractors?page=${page}`);
};

// GET single tractor
export const getTractorById = (id) => {
  return api.get(`/tractors/${id}`);
};

// FILTER tractors
export const filterTractors = (params) => {
  return api.get("/tractors/filter", { params });
};

// ADMIN
export const createTractor = (data) => {
  return api.post("/tractors", data);
};

export const updateTractor = (id, data) => {
  return api.put(`/tractors/${id}`, data);
};

export const deleteTractor = (id) => {
  return api.delete(`/tractors/${id}`);
};

// IMAGE UPLOAD
export const uploadTractorImage = (id, formData) => {
  return api.post(`/tractors/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};