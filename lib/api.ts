import axios from 'axios';

// 1. ดึงค่าจาก Environment Variable
const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 2. 🛡️ ป้องกัน Bug: สั่งลบวงเล็บเหลี่ยม [ ] หรือเครื่องหมายคำพูด " ที่อาจหลุดมาจากการตั้งค่า Env ออกให้หมด
const cleanBaseUrl = rawUrl.replace(/[\[\]"]/g, '').trim();

// 3. สร้าง Instance ของ Axios ด้วย URL ที่ล้างสะอาดแล้ว
const api = axios.create({
  baseURL: cleanBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 4. Request Interceptor: แนบ Token อัตโนมัติในทุกๆ หน้าจอ
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;