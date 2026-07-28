"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppPages } from "@/config/pages";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await apiFetch<{ token: string; user: string }>("/user/login", {
        method: "POST",
        body: JSON.stringify({ login: username, password }),
      });

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", data.user);

      router.push(AppPages.HOME);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Не удалось войти. Попробуйте ещё раз.");
    }
  };

  return (
    <div className="login-bg flex h-full items-center justify-center overflow-hidden p-4 md:p-0">
      <div className="bg-card w-full max-w-sm rounded-xl border p-6 shadow-lg md:max-w-md md:p-8 lg:max-w-lg">
        <h2 className="text-primary-dark mb-6 text-center text-xl font-medium md:text-2xl">
          Авторизация
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="text-primary-dark mb-2 block text-sm font-medium">Логин</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Логин"
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-lg border px-4 py-3 transition-shadow duration-200 focus-visible:shadow-md focus-visible:ring-1 focus-visible:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-primary-dark mb-2 block text-sm font-medium">Пароль</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Пароль"
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-lg border px-4 py-3 transition-shadow duration-200 focus-visible:shadow-md focus-visible:ring-1 focus-visible:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary-dark focus-visible:ring-ring w-full cursor-pointer rounded-lg py-3 font-semibold transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none active:scale-95"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
