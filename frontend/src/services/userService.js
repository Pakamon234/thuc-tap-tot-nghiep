import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Spring Cloud Gateway

export const getAllUsers = () => {
  return axios.get(`${API_BASE_URL}/users`);

};
// Đăng nhập
export const loginUser = (loginRequest) => {
  return axios.post(`${API_BASE_URL}/auth/login`, loginRequest);
};
