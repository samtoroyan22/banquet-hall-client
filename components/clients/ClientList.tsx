import ClientRow from "./ClientRow";
import type { IClientSummary } from "@/types/clients.types";

interface Props {
  clients: IClientSummary[];
  loading: boolean;
  query: string;
  filter: "all" | "legal" | "physical";
}

export default function ClientList({ clients, loading, query, filter }: Props) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-muted-foreground text-sm">Загрузка...</p>
      </div>
    );
  }

  const filtered = clients.filter((c) => {
    if (filter !== "all" && c.type !== filter) return false;
    if (
      query &&
      !c.name.toLowerCase().includes(query.toLowerCase()) &&
      query &&
      !c.inn?.includes(query)
    )
      return false;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="text-muted-foreground flex h-40 flex-col items-center justify-center text-center">
        <p className="mb-1 text-sm font-medium">Клиенты не найдены</p>
        <p className="text-xs">Попробуйте изменить фильтр или поиск</p>
      </div>
    );
  }

  return (
    <section className="mt-6">
      <div className="mb-6 ml-2 flex items-center justify-between px-2 sm:px-4">
        <h3 className="text-muted-foreground text-sm">
          Всего клиентов: <span className="text-foreground font-medium">{filtered.length}</span>
        </h3>
      </div>

      <ul className="grid grid-cols-1 gap-4">
        {filtered.map((client) => (
          <ClientRow key={client.id} client={client} />
        ))}
      </ul>
    </section>
  );
}
