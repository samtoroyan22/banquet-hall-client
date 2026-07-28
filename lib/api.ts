import { AppPages } from "@/config/pages";
import { toast } from "sonner";
import { API_URL } from "./config";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.error("Сессия истекла. Выполнен выход из системы");
    window.location.href = AppPages.LOGIN;
    throw new Error("Сессия истекла");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `Ошибка: ${response.status}`;
    toast.error(message);
    throw new Error(message);
  }

  return response.json();
}
