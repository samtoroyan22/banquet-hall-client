import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/ui/select";
import AddClientDialog from "./add-client/AddClientDialog";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  filter: "all" | "legal" | "physical";
  onFilterChange: (f: "all" | "legal" | "physical") => void;
  sort: "asc" | "desc";
  onSortChange: (s: "asc" | "desc") => void;
  refreshClients: () => void;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
}

export default function ClientsFilters({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  refreshClients,
  isAddOpen,
  setIsAddOpen,
}: Props) {
  const [local, setLocal] = useState(query);

  useEffect(() => setLocal(query), [query]);

  useEffect(() => {
    const t = setTimeout(() => onQueryChange(local), 300);
    return () => clearTimeout(t);
  }, [local, onQueryChange]);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Input
            type="text"
            placeholder="Поиск"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="focus-visible:ring-primary-foreground rounded-full pl-6 transition-all duration-300"
          />

          <CustomSelect<"all" | "legal" | "physical">
            options={[
              { value: "all", label: "Все" },
              { value: "physical", label: "Физ. лица" },
              { value: "legal", label: "Юр. лица" },
            ]}
            value={filter}
            onChange={onFilterChange}
            placeholder="Все клиенты"
            className="w-[120px]"
          />

          <CustomSelect<"asc" | "desc">
            options={[
              { value: "asc", label: "А–Я" },
              { value: "desc", label: "Я–А" },
            ]}
            value={sort}
            onChange={onSortChange}
            placeholder="Сортировка"
            className="mr-4 w-[90px]"
          />
        </div>
      </div>

      <AddClientDialog refreshClients={refreshClients} open={isAddOpen} setOpen={setIsAddOpen} />
    </div>
  );
}
