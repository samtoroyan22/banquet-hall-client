"use client";

import ClientsFilters from "@/components/clients/ClientsFilters";
import ClientList from "@/components/clients/ClientList";
import { useMemo, useState, useEffect } from "react";
import { useFetchClients } from "@/hooks/useFetchClients";
import { Title } from "@/components/ui/title";
import { useSearchParams, useRouter } from "next/navigation";
import { AppPages } from "@/config/pages";

export default function ClientsPage() {
  const { clients, loading, fetchClients } = useFetchClients();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "legal" | "physical">("all");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const searchParams = useSearchParams();
  const router = useRouter();

  const openAddClient = searchParams.get("openAddClient") === "true";
  const [isAddOpen, setIsAddOpen] = useState(openAddClient);

  useEffect(() => {
    if (openAddClient) {
      router.replace(AppPages.CLIENTS, { scroll: false });
    }
  }, [openAddClient, router]);

  const sortedClients = useMemo(() => {
    const sorted = [...clients].sort((a, b) =>
      a.name.localeCompare(b.name, "ru", { sensitivity: "base" })
    );
    return sort === "asc" ? sorted : sorted.reverse();
  }, [clients, sort]);

  return (
    <section className="mx-12 my-4 md:m-6">
      <Title title="Клиенты" />
      <div className="mb-4">
        <ClientsFilters
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          refreshClients={fetchClients}
          isAddOpen={isAddOpen}
          setIsAddOpen={setIsAddOpen}
        />
      </div>
      <ClientList clients={sortedClients} loading={loading} query={query} filter={filter} />
    </section>
  );
}
