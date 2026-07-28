import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

import type { IDiscoverySource } from "@/types/reservations.types";

export function useFetchDiscoverySources() {
  const [sources, setSources] = useState<IDiscoverySource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    apiFetch<IDiscoverySource[]>("/reserve/get-discovery-source")
      .then((data) => setSources(data))
      .catch(() => setSources([]))
      .finally(() => setLoading(false));
  }, []);

  return { sources, loading };
}
