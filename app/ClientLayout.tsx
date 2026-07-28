"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { AppPages } from "@/config/pages";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { checking } = useAuthRedirect();
  const pathname = usePathname();
  const isLoginPage = pathname === AppPages.LOGIN;

  if (checking) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {!isLoginPage && <Sidebar />}
      <main className={cn("flex-1 p-8 md:mb-10", isLoginPage ? "ml-0" : "ml-62 md:ml-0")}>
        {children}
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}
