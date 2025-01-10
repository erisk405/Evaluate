// hooks/useAuthState.ts
import * as React from "react";
import GlobalApi from "@/app/_util/GlobalApi";
import { Role } from "@/app/(auth)/type/auth";

interface User {
  id: string;
  role: Role;
}

interface AuthState {
  isAdmin: boolean;
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAuthState() {
  const [authState, setAuthState] = React.useState<AuthState>({
    isAdmin: false,
    user: null,
    isLoading: true,
    error: null
  }); // เก็บข้อมูลผู้ใช้ว่าเป็น admin หรือไม่

  const fetchProtectedData = React.useCallback(async () => { //ป้องกันการสร้างฟังก์ชันใหม่ทุกครั้งที่ component render
    try { // ถ้าไม่ใช้ useCallback จะทำให้เกิด infinite loop เพราะทุกครั้งที่ render จะสร้างฟังก์ชันใหม่ ทำให้ useEffect ทำงานซ้ำไปเรื่อยๆ
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await GlobalApi.fetchProtected();
      const isAdminRole = response.data.role === "admin";

      setAuthState({
        isAdmin: isAdminRole,
        user: {
          id: response.data.userId,
          role: isAdminRole ? "admin" : "user"
        },
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState({
        isAdmin: false,
        user: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      });
    }
  }, []);
  //ส่งคืนข้อมูลสถานะทั้งหมด
  React.useEffect(() => { // ทำงานเมื่อ component mount ครั้งแรก
    fetchProtectedData(); //เรียกฟังก์ชัน fetchProtectedData เพื่อดึงข้อมูล authentication
  }, [fetchProtectedData]);

  return {
    ...authState,
    refetch: fetchProtectedData
  };
}