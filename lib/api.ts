// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🛠️ เพิ่มจุดนี้: Interceptor สำหรับแกะกล่องข้อมูลตัวแสบจาก NestJS ({ data: [...] })
api.interceptors.response.use(
  (response) => {
    // 🟢 ถ้าหลังบ้านส่งของมาเป็น Object ที่มี .data ซ่อนอยู่ข้างใน (เช่น NestJS)
    // ให้ดึงเอาเฉพาะข้อมูลอาร์เรย์ชั้นในส่งไปให้หน้าเว็บใช้งานทันที
    if (response.data && response.data.data) {
      return response.data.data;
    }
    // ถ้าส่งมาเป็นอาร์เรย์ธรรมดาอยู่แล้ว ก็ส่งกลับไปตามปกติ
    return response.data;
  },
  (error) => {
    // ส่ง Error ออกไปจัดการต่อในหน้าเว็บที่มีการเรียกใช้
    return Promise.reject(error);
  }
);

export default api;