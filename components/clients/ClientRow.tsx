"use client";

import type { IClientSummary } from "@/types/clients.types";
import { cn } from "@/lib/utils";
import { Building2, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  client: IClientSummary;
}

export default function ClientRow({ client }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/clients/${client.id}`);
  };

  return (
    <li
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={`Открыть клиента ${client.name}`}
      className={cn(
        "group bg-background flex cursor-pointer items-center justify-between rounded-2xl border px-5 py-4 shadow-sm transition-all duration-200",
        "hover:bg-muted/40 hover:shadow-md active:scale-[0.99]"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex w-14 flex-col items-center gap-1">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              client.type === "legal" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
            )}
          >
            {client.type === "legal" ? (
              <Building2 className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>

          <span className="text-muted-foreground text-[11px] leading-none">
            {client.type === "legal" ? "Юр. лицо" : "Физ. лицо"}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-foreground group-hover:text-primary text-base font-semibold transition-colors">
            {client.name}
          </span>

          <span className="text-muted-foreground text-sm">
            {client.contacts?.[0]?.phone || "—"}
          </span>
        </div>
      </div>

      <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:hidden">
        <span className="text-primary text-sm font-medium">Подробнее →</span>
      </div>
    </li>
  );
}
