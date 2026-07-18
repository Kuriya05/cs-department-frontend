// src/utils/api.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cs-department-backend.onrender.com/api/v1';

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
    throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
  }

  // 🛠️ เวอร์ชันปรับปรุงเพื่อความปลอดภัย:
  // หากปลายทางต้องการแค่ Array และข้อมูลส่งมาเป็น Object ที่มี .data ให้ส่ง .data ออกไป
  // แต่ถ้าหน้าเว็บดึงข้อมูลไปแบบไม่เจาะจง หรือเป็น Method อื่น (เช่น POST/PUT) ให้ส่ง data ไปตามปกติ
  if (data && typeof data === 'object' && 'data' in data) {
    // ดักเช็คว่าถ้าไม่ใช่ข้อมูลรูปแบบ Pagination หรือการดึงแบบปกติ ให้คืนค่า .data ไปเลย
    return data.data as T;
  }

  return data as T;
}