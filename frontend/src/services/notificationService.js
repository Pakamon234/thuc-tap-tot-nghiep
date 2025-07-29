import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Spring Cloud Gateway

export const getAllUsers = () => {
  return axios.get(`${API_BASE_URL}/users`);
};
