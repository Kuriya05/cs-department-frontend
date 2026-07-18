// src/utils/api.ts

// ตัวแปรนี้จะอ่านค่าจาก .env.local ตอนรันในเครื่องคุณ 
// แต่ถ้าเอาขึ้น Production (เช่น Vercel) มันจะสลับไปใช้ URL ของ Render ให้เองอัตโนมัติ
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cs-department-backend.onrender.com/api/v1';

/**
 * ฟังก์ชันช่วยยิง API (Fetch Wrapper) 
 * ช่วยใส่ Headers อัตโนมัติ และเช็ค Error ให้เสร็จสรรพในที่เดียว
 */
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // โยนข้อความ Error จาก Backend ออกไป
    throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
  }

  return data as T;
}