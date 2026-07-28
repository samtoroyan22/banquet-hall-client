"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MAIN_MENU } from "./main-menu.data";
import { LogOut } from "lucide-react";
import { AppPages } from "@/config/pages";
import { toast } from "sonner";
import ConfirmDeleteModal from "@/components/clients/ConfirmDeleteModal";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const username = localStorage.getItem("user");
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Вы вышли из системы");
    router.push(AppPages.LOGIN);
  };

  return (
    <aside className="bg-primary text-text-foreground fixed min-h-screen w-64 border-r md:fixed md:inset-x-0 md:bottom-0 md:z-50 md:flex md:h-16 md:min-h-[auto] md:w-full md:items-center md:justify-center md:border-t md:border-r-0">
      <div className="border-background/20 flex border-b-2 p-6 md:hidden">
        <h1 className="text-lg font-medium">{username}</h1>
      </div>

      <nav className="p-4 md:flex md:w-full md:justify-center md:p-0 md:px-0">
        <ul className="space-y-1 md:flex md:flex-row md:items-center md:space-y-0 md:space-x-6">
          {MAIN_MENU.map((it) => {
            const active = pathname === it.href;
            const Icon = it.icon;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={
                    "flex items-center gap-3 rounded-md px-4 py-2 md:flex-col md:gap-1 md:px-2 md:py-1 md:text-xs " +
                    (active
                      ? "bg-primary-dark md:bg-primary-dark"
                      : "hover:bg-primary-dark md:hover:bg-primary-dark")
                  }
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span>{it.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              className="hover:bg-primary-dark flex w-full cursor-pointer items-center gap-3 rounded-md px-4 py-2 md:flex-col md:gap-1 md:px-2 md:py-1 md:text-xs"
              onClick={() => setExitDialogOpen(true)}
            >
              <LogOut className="h-4 w-4 md:h-5 md:w-5" />
              <span>Выход</span>
            </button>
          </li>
        </ul>
      </nav>
      {username && (
        <ConfirmDeleteModal
          open={exitDialogOpen}
          setOpen={setExitDialogOpen}
          title="Вы хотите выйти?"
          onConfirm={handleLogout}
        />
      )}
    </aside>
  );
}
