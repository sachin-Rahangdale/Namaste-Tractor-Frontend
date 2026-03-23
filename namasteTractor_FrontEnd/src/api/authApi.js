import api from "./axios";

export const loginUser = (data) => {
  return api.post("/user/login", data);
};

export const registerUser = (data) => {
  return api.post("/user/create", data);
};

export const verifyUser = (token) => {
  return api.get(`/user/verify?token=${token}`);
};