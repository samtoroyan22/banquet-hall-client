"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { IClientDetail, ITypeHistory } from "@/types/clients.types";
import ClientMainInfo from "@/components/clients/client-details/ClientMainInfo";
import ClientKeyDates from "@/components/clients/client-key-dates/ClientKeyDates";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppPages } from "@/config/pages";
import { ClientHistory } from "@/components/clients/client-histories/ClientHistory";
import { ClientContacts } from "@/components/clients/client-contacts/ClientContacts";

export default function ClientDetailPage() {
  const { id } = useParams();
  const clientId = Array.isArray(id) ? id[0] : id;

  const [client, setClient] = useState<IClientDetail | null>(null);
  const [types, setTypes] = useState<ITypeHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClient = useCallback(async () => {
    if (!clientId) return;

    setLoading(true);
    try {
      const data = await apiFetch<IClientDetail>("/client/detail", {
        method: "POST",
        body: JSON.stringify({ clientId }),
      });

      setClient(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка при загрузке клиента");
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  const fetchTypes = useCallback(async () => {
    try {
      const data = await apiFetch<ITypeHistory[]>("/history/type");
      setTypes(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Не удалось загрузить типы взаимодействий");
    }
  }, []);

  useEffect(() => {
    fetchClient();
    fetchTypes();
  }, [fetchClient, fetchTypes]);

  if (loading) return <p>Загрузка данных клиента...</p>;
  if (!client) return <p>Клиент не найден</p>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex justify-between">
        <h1 className="text-primary-dark mb-10 text-2xl font-semibold">Клиент: {client.name}</h1>
        <Link href={AppPages.CLIENTS}>
          <Button variant="secondary">Назад</Button>
        </Link>
      </div>

      <div className="rounded-2xl bg-white px-12 py-8 shadow-md">
        <h2 className="text-primary-dark mb-8 text-xl font-semibold">Основная информация</h2>
        <ClientMainInfo client={client} refreshClient={fetchClient} />
      </div>

      <div className="rounded-2xl bg-white px-12 py-8 shadow-md">
        <h2 className="text-primary-dark mb-8 text-xl font-semibold">Контактная информация</h2>
        <ClientContacts
          contacts={client.contacts || []}
          clientId={clientId as string}
          refreshClient={fetchClient}
        />
      </div>

      <div className="rounded-2xl bg-white px-12 py-8 shadow-md">
        <h2 className="text-primary-dark mb-8 text-xl font-semibold">Ключевые даты</h2>
        <ClientKeyDates
          data={client.keyDates}
          clientId={clientId as string}
          refreshClient={fetchClient}
        />
      </div>

      <div className="rounded-2xl bg-white px-12 py-8 shadow-md">
        <h2 className="text-primary-dark mb-8 text-xl font-semibold">История взаимодействий</h2>
        <ClientHistory
          histories={client.histories}
          types={types}
          clientId={clientId as string}
          refreshClient={fetchClient}
        />
      </div>
    </div>
  );
}
