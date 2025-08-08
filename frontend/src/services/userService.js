import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Spring Cloud Gateway

// Lấy tất cả người dùng
export const getAllUsers = () => {
  return axios.get(`${API_BASE_URL}/users`);
};

// Đăng nhập
export const loginUser = (loginRequest) => {
  return axios.post(`${API_BASE_URL}/auth/login`, loginRequest);
};

// Lấy danh sách căn hộ (để đổ vào dropdown trong form đăng ký)
export const getAllCanHo = () => {
  return axios.get(`${API_BASE_URL}/dangky/canho`);
};

// Đăng ký cư dân
export const dangKyCuDan  = (dangKyRequest) => {
  return axios.post(`${API_BASE_URL}/dangky`, dangKyRequest);
};
