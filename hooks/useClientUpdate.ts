"use client";

import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { IClientDetail } from "@/types/clients.types";
import type { PhysicalClientData, LegalClientData } from "@/zod-schemes/clientSchema";
import { getChangedFields, parseDateToISO } from "@/lib/utils";

interface Params {
  client: IClientDetail;
  refreshClient: () => void;
  setEditMode: (v: boolean) => void;
  setLoading: (v: boolean) => void;
}

export function useClientUpdate({ client, refreshClient, setEditMode, setLoading }: Params) {
  const onSubmitPhysical = async (data: PhysicalClientData) => {
    const payload = {
      ...data,
      contactName: data.name,
      passportDate: data.passportDate ? parseDateToISO(data.passportDate) : undefined,
    };
    const updateData = getChangedFields(
      {
        name: client.name || "",
        contactName: client.name || "",
        contactPhone: client.contactPhone || "",
        contactEmail: client.contactEmail || "",
        actualAddress: client.actualAddress || "",
        passportSerial: client.passportSerial || "",
        passportNumber: client.passportNumber || "",
        passportDate: client.passportDate || "",
        passportSubdivision: client.passportSubdivision || "",
      },
      payload
    );

    if (Object.keys(updateData).length === 0) {
      toast("Нет изменений для сохранения");
      setEditMode(false);
      return;
    }

    setLoading(true);
    try {
      await apiFetch(`/client/edit`, {
        method: "POST",
        body: JSON.stringify({ clientId: client.id, updateData }),
      });
      toast.success("Данные клиента обновлены");
      setEditMode(false);
      refreshClient();
    } catch {
      toast.error("Ошибка при обновлении клиента");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitLegal = async (data: LegalClientData) => {
    const updateData = getChangedFields(
      {
        name: client.name || "",
        contactName: client.contactName || "",
        contactPhone: client.contactPhone || "",
        contactEmail: client.contactEmail || "",
        actualAddress: client.actualAddress || "",
        legalAddress: client.legalAddress || "",
        inn: client.inn || "",
        ogrn: client.ogrn || "",
      },
      data
    );

    if (Object.keys(updateData).length === 0) {
      toast("Нет изменений для сохранения");
      setEditMode(false);
      return;
    }

    setLoading(true);
    try {
      await apiFetch(`/client/edit`, {
        method: "POST",
        body: JSON.stringify({ clientId: client.id, updateData }),
      });
      toast.success("Данные клиента обновлены");
      setEditMode(false);
      refreshClient();
    } catch {
      toast.error("Ошибка при обновлении клиента");
    } finally {
      setLoading(false);
    }
  };

  return { onSubmitPhysical, onSubmitLegal };
}
