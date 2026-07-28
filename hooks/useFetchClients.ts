import { useState, useCallback, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import type { IClientSummary } from "@/types/clients.types";

export function useFetchClients() {
  const [clients, setClients] = useState<IClientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<IClientSummary[]>(`/client`);
      setClients(data);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Ошибка при получении клиентов");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, fetchClients, setClients };
}
