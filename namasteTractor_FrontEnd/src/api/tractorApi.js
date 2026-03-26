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

export const updateTractor = (id, data) => {
  return api.put(`/tractors/${id}`, data);
};

export const deleteTractor = (id) => {
  return api.delete(`/tractors/${id}`);
};


export const addTractor = (data) => {
  return api.post("/tractors", data);
};

export const uploadTractorImage = (id, file, type) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", type);

  return api.post(`/tractors/${id}/images`, formData, {
    params: {
      tractorId: id, // 🔥 THIS FIX
    },
  });
};