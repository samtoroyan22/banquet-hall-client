"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import type { IReserveDetail } from "@/types/reservations.types";

export function useReserveDetail() {
  const [data, setData] = useState<IReserveDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadReserveDetail(reserveId: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<IReserveDetail>(`/reserve/detail`, {
        method: "POST",
        body: JSON.stringify({ reserveId }),
      });

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при получении деталей бронирования");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, loadReserveDetail };
}
