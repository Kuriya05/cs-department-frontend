// src/lib/api.ts (หรือตำแหน่งที่คุณสร้างไฟล์)
import axios from 'axios';

// สร้าง instance ของ axios และดึงลิงก์จาก Environment Variable
const api = axios.create({
  // ถ้าบน Vercel มีตัวแปรนี้ มันจะใช้ลิงก์ Render
  // แต่ถ้ารันบนเครื่อง (Local) แล้วไม่มีตัวแปร มันจะสลับไปใช้ localhost ให้เองครับ
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;