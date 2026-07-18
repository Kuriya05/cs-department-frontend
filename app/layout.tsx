import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. นำเข้า ThemeProvider จากโฟลเดอร์ context ของคุณเรียบร้อย
import { ThemeProvider } from "../context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ปรับแต่ง Metadata ให้ตรงกับระบบ AI-CS Intelligence System ของคุณ
export const metadata: Metadata = {
  title: "AI-CS Department Intelligence System • 2026",
  description: "Predictive Analytics & Management Computer Science Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        {/* 2. กางมุ้งครอบระบบทั้งหมดไว้ตรงนี้ ทำให้ทุกหน้าดึงสเตตัสธีมไปใช้และจำค่าผ่าน localStorage ได้ยาว ๆ */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
        
      </body>
    </html>
  );
}