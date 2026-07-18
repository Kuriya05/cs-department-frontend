// src/components/Login.js
import api from '../../../ai-cs-backend-main/src/services/api';

const handleLogin = async (username, password) => {
  try {
    // 🚀 ยิงไปที่แผนก Auth ที่เราเขียนไว้ใน NestJS
    const response = await api.post('/auth/login', { username, password });
    
    // 🎟️ แกะข้อมูลที่ NestJS ส่งกลับมา (access_token และ user profile)
    const { access_token, user } = response.data;

    // 💾 หยอดลง LocalStorage เก็บไว้ในตู้เซฟบราวเซอร์
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user_info', JSON.stringify(user)); // แปลง Object เป็น String ก่อนเก็บ

    // 🎉 ยินดีด้วย ล็อกอินผ่านแล้ว สั่งเปลี่ยนหน้าไปหน้า Dashboard ได้เลย
    window.location.href = '/dashboard';
    
  } catch (error) {
    // ดึง Error Message ภาษาไทยที่เราดักไว้ใน NestJS มาแสดงผล
    const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
    alert(`เข้าสู่ระบบไม่สำเร็จ: ${errorMessage}`);
  }
};