import apiClient, { handleApiError } from './api';

// === ĐIỂM CHỈNH NHANH NẾU BACKEND KHÁC PATH ===
const ACCOUNT_URL  = '/taikhoan'; // GET list, GET /stats, PATCH /{id}/status
const RESIDENT_URL = '/cudan';    // GET list, GET /stats
const REGISTRATION_URL = '/dangky';

// Helper: lọc params hợp lệ & build query string
const buildParams = (filters = {}) => {
  const params = {};
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'all') params[k] = v;
  });
  return params;
};
const toQuery = (obj) => {
  const usp = new URLSearchParams(obj);
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
};

// ================== ACCOUNT (BQL + Cư dân) ==================
export const accountService = {
  async getAccounts(filters = {}) {
    const qs = toQuery(buildParams(filters));
    const res = await apiClient.get(`${ACCOUNT_URL}${qs}`);

    const raw = Array.isArray(res) ? res : (res?.data ?? res ?? []);
    // ✅ Chuẩn hóa field về tên mà UI đang dùng
    const data = raw.map(a => ({
      ...a,
      tenDangNhap: a.tenDangNhap ?? a.username ?? a.userName ?? '', // username -> tenDangNhap
      trangThai:   a.trangThai   ?? a.status   ?? '',               // status   -> trangThai
      ngayDangKy:  a.ngayDangKy  ?? a.createdAt ?? a.created_at ?? a.ngay_tao ?? null,
      ngayCapNhat: a.ngayCapNhat ?? a.updatedAt ?? a.updated_at ?? a.ngay_sua ?? null,
    }));

    const pagination = res?.pagination || { totalPages: 1, page: Number(filters.page) || 1 };
    return { data, pagination };
  },

  async getAccountStats() {
    try {
      const res = await apiClient.get(`${ACCOUNT_URL}/stats`);
      return res;
    } catch (e) {
      const { data } = await this.getAccounts({ limit: 1000 });
      const total         = data.length;
      const choDuyet      = data.filter(x => x.trangThai === 'Chờ duyệt').length;
      const dangHoatDong  = data.filter(x => x.trangThai === 'Đang hoạt động').length;
      const daKhoa        = data.filter(x => x.trangThai === 'Đã khóa').length;
      return { total, choDuyet, dangHoatDong, daKhoa };
    }
  },

  async updateAccountStatus(id, newStatus) {
    // gửi cả 2 key để tương thích backend (status hoặc trangThai)
    return apiClient.patch(`${ACCOUNT_URL}/${id}/status`, {
      status: newStatus,
      trangThai: newStatus,
    });
  },
  // Lấy danh sách căn hộ để đổ dropdown
  // Đăng ký cư dân (tích hợp từ userService.js)
  // Hàm tạo tài khoản cư dân
  async registerResident(payload) {
    const body = {
      tenDangNhap: payload.tenDangNhap,
      matKhau: payload.password,         // BE yêu cầu 'matKhau'
      hoTen: payload.hoTen,
      email: payload.email,
      soDienThoai: payload.soDienThoai,
      cccd: payload.cccd,
      diaChi: payload.diaChi,
      ngaySinh: payload.ngaySinh,        // 'YYYY-MM-DD'
      canHoId: payload.maCanHo,          // gửi 'maCanHo' thay vì 'canHoId'
    };
    return apiClient.post(`${REGISTRATION_URL}`, body);
  },

  // Lấy danh sách căn hộ
  async getApartments() {
    return apiClient.get(`${REGISTRATION_URL}/canho`);
  },
};

// ================== RESIDENT (Cư dân) ==================
export const residentService = {
  // filters: { search, trangThai: 'ở'|'không ở nữa', maCanHo, page, limit }
  async getResidents(filters = {}) {
    const qs = toQuery(buildParams(filters));
    const res = await apiClient.get(`${RESIDENT_URL}${qs}`);
    const data = Array.isArray(res) ? res : (res?.data ?? res ?? []);
    const pagination = res?.pagination || { totalPages: 1, page: Number(filters.page) || 1 };
    return { data, pagination };
  },

  async getResidentStats() {
    try {
      const res = await apiClient.get(`${RESIDENT_URL}/stats`);
      return res;
    } catch (e) {
      const { data } = await this.getResidents({ limit: 1000 });
      const total     = data.length;
      const dangO     = data.filter(x => x.trangThai === 'ở').length;
      const khongONua = data.filter(x => x.trangThai === 'không ở nữa').length;
      const choDuyet  = data.filter(x => x.trangThaiTaiKhoan === 'Chờ duyệt').length;
      return { total, dangO, khongONua, choDuyet };
    }
  },
};

// =========== MANAGEMENT STAFF (nếu tách riêng) ===========
// Nếu phía bạn không có resource riêng cho BQL, có thể tái dùng accountService với loaiTaiKhoan='BQL'.
export const managementStaffService = {
  async getStaff(filters = {}) {
    const merged = { ...filters, loaiTaiKhoan: 'BQL' };
    return accountService.getAccounts(merged);
  },

  async getStaffStats() {
    try {
      // Nếu có /bql/stats thì đổi path ở đây:
      const res = await apiClient.get(`/bql/stats`);
      return res;
    } catch {
      // Fallback tính từ danh sách BQL
      const { data } = await this.getStaff({ limit: 1000 });
      const total        = data.length;
      const dangLamViec  = data.filter(x => x.trangThai === 'Đang làm việc').length;
      const tamNgung     = data.filter(x => x.trangThai === 'Tạm ngưng').length;
      const daNghiViec   = data.filter(x => x.trangThai === 'Đã nghỉ việc').length;
      return { total, dangLamViec, tamNgung, daNghiViec };
    }
  },
};
