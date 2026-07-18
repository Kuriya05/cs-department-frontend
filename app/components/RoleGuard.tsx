'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    // ถ้าไม่มี Token หรือยศไม่อยู่ในกลุ่มที่ได้รับอนุญาต ให้เด้งไปหน้า login
    if (!token || !userRole || !allowedRoles.includes(userRole)) {
      router.push('/login');
    }
  }, [router, allowedRoles]);

  return <>{children}</>;
}