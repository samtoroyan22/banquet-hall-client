"use client";

import AddKeyDateDialog from "./AddKeyDateDialog";
import KeyDateCard from "./KeyDateCard";
import type { IKeyDate } from "@/types/clients.types";

interface Props {
  data: IKeyDate[] | null;
  clientId: string;
  refreshClient: () => Promise<void>;
}

export default function ClientKeyDates({ data, clientId, refreshClient }: Props) {
  return (
    <div className="flex flex-wrap justify-start gap-4">
      <AddKeyDateDialog clientId={clientId} refreshClient={refreshClient} />

      {data?.map((d) => (
        <KeyDateCard key={d.id} dateItem={d} refreshClient={refreshClient} />
      ))}
    </div>
  );
}
