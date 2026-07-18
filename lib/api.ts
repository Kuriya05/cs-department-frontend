import axios from 'axios';

// 1. ดึงค่าจาก Environment Variable
const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 2. 🛡️ อัปเกรด Regex ขั้นสูง: กรองเอาเฉพาะตัว URL ที่ขึ้นต้นด้วย http:// หรือ https:// เท่านั้น 
// ต่อให้บน Vercel จะเผลอใส่ข้อความ Markdown หรือวงเล็บเหลี่ยมซ้อนมา ตัวนี้จะสกัดเอาแต่เนื้อ ๆ ออกมาได้ 100%
const urlMatch = rawUrl.match(/(https?:\/\/[^\s\]\)\"\']+)/);
const cleanBaseUrl = urlMatch ? urlMatch[0] : 'http://localhost:3001';

// 3. สร้าง Instance ของ Axios
const api = axios.create({
  baseURL: cleanBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 4. Request Interceptor: แนบ Token อัตโนมัติในทุกๆ Request
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