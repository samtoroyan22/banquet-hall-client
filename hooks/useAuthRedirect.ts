"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppPages } from "@/config/pages";

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoginPage = pathname === AppPages.LOGIN;

    if (!token && !isLoginPage) {
      router.replace(AppPages.LOGIN);
      return;
    }

    if (token && isLoginPage) {
      router.replace(AppPages.HOME);
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  return { checking };
}
