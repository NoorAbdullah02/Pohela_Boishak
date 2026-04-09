import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.response?.data?.expired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
        accessToken = data.accessToken;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        accessToken = null;
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const foodAPI = {
  getAll: (category) => api.get('/food', { params: category && category !== 'সব' ? { category } : {} }),
  getOne: (id) => api.get(`/food/${id}`),
  create: (formData) => api.post('/food', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/food/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/food/${id}`),
  toggleStock: (id) => api.patch(`/food/${id}/stock`),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  getStats: () => api.get('/orders/stats'),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export default api;
