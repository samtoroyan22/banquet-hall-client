import { Home, Users, CalendarDays, CheckSquare } from "lucide-react";
import type { IMenuItem } from "./menu.types";
import { AppPages } from "@/config/pages";

export const MAIN_MENU: IMenuItem[] = [
  {
    icon: Home,
    label: "Главная",
    href: AppPages.HOME,
  },
  {
    icon: Users,
    label: "Клиенты",
    href: AppPages.CLIENTS,
  },
  {
    icon: CalendarDays,
    label: "Бронирования",
    href: AppPages.RESERVATIONS,
  },
  {
    icon: CheckSquare,
    label: "Задачи",
    href: AppPages.TASKS,
  },
];
