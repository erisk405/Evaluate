// app/components/layouts/ProtectedLayout.tsx
import { ReactNode } from "react";
import useAuthorization from "@/hooks/useAuthorization"; // ปรับ path ตามโครงสร้างโปรเจค
import Loading from "../Loading";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const isLoading = useAuthorization();

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
