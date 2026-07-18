// app/services/api.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

// 🌐 1. เชื่อมต่อไปยังหลังบ้าน (ใช้ลิงก์ Vercel ถ้ามี ถ้าไม่มีให้ดีดกลับไปใช้ localhost พอร์ต 3001)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🛡️ 2. ยามฝั่งส่ง: ถ้าเครื่องผู้ใช้มี Token ให้แอบแนบไปด้วยทุกครั้งอัตโนมัติ
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 3. ยามฝั่งรับ: ถ้าหลังบ้านบอกว่า Token หมดอายุ (401) ให้เตะกลับหน้า login ทันที
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;