import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Lấy danh sách user
const getAllUsers = () => {
  return axios.get(`${API_BASE_URL}/users`);
};

// Lấy hợp đồng theo mã cư dân
const getContractsByCuDan = async (maCuDan) => {
  const response = await axios.get(`${API_BASE_URL}/api/hopdong/byCuDan/${maCuDan}`);
  return response.data;
};

// Lấy mẫu hợp đồng mới nhất kèm dịch vụ
const getLatestContractTemplateWithServices = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/mauhopdong/latest`);
  return response.data; // Trả ra { mauHopDong, danhSachDichVu }
};

const getAvailableContract = async (idMauHopDong, maHopDong) => {
  const response = await axios.get(`${API_BASE_URL}/api/mauhopdong/detail`, {
    params: {
      idMauHopDong,
      maHopDong
    }
  });
  return response.data; // Trả ra danh sách dịch vụ có sẵn
};

const getAllServices = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/dichvu`);
  return response.data; // Trả ra danh sách dịch vụ
};

// Tạo hợp đồng mới
const createContract = async (hopDongData) => {
  const response = await axios.post(`${API_BASE_URL}/api/hopdong`, hopDongData);
  return response.data;
};

const contractsService = {
  getAllUsers,
  getContractsByCuDan,
  getLatestContractTemplateWithServices,
  getAvailableContract,
  getAllServices,
  createContract
};

export default contractsService;
