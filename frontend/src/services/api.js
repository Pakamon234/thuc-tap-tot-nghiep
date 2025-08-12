// src/services/api.js
// ✅ CRA: dùng process.env.REACT_APP_API_URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const USE_MOCK_DATA =
  (process.env.REACT_APP_USE_MOCK === 'true') ||
  (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('api_fallback_mode') === 'true');

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🎭 Mock Mode:', USE_MOCK_DATA);

// HTTP Client (fetch)
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Auth token từ localStorage (nếu có)
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized -> clear token + về trang login
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
          }
          if (typeof window !== 'undefined') window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      console.error('API Request failed:', error);

      // Network error -> bật mock mode fallback
      if (error instanceof TypeError && String(error.message).toLowerCase().includes('fetch')) {
        console.warn('🚨 Backend không truy cập được, chuyển sang mock mode (fallback)');
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('api_fallback_mode', 'true');
        }
      }

      throw error;
    }
  }

  get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
  post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined }); }
  put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }); }
  patch(endpoint, data) { return this.request(endpoint, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Handler lỗi dùng chung cho UI
export const handleApiError = (error) => {
  if (error?.message) return error.message;
  return 'Đã xảy ra lỗi không xác định';
};

export default apiClient;
