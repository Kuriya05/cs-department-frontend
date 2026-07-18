// src/components/ReportDashboard.js
import api from '../../../ai-cs-backend-main/src/services/api';

const downloadMasterReport = async () => {
  try {
    // 🚨 สำคัญที่สุด: ต้องใส่ responseType: 'blob' เพื่อบอกว่าขอรับไฟล์ดิบ
    const response = await api.get('/reports/master/excel', {
      responseType: 'blob', 
    });

    // 🪄 เสกไฟล์ดิบ (Blob) ให้กลายเป็น URL สำหรับดาวน์โหลดในเบราว์เซอร์
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // ⚓ สร้างลิงก์ผี (Virtual Link) ขึ้นมาในอากาศแล้วสั่งคลิกอัตโนมัติเพื่อดาวน์โหลด
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Master_Report_${date}.xlsx`); // ตั้งชื่อไฟล์ปลายทาง
    
    document.body.appendChild(link);
    link.click();
    
    // 🧹 ทำความสะอาด ลบทิ้งเมื่อดาวน์โหลดเสร็จเพื่อไม่ให้รกหน่วยความจำ
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

  } catch (error) {
    console.error('Download error:', error);
    alert('ไม่สามารถดาวน์โหลดรายงานได้ กรุณาลองใหม่อีกครั้ง');
  }
};