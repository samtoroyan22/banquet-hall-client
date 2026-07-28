"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  physicalClientSchema,
  legalClientSchema,
  type PhysicalClientData,
  type LegalClientData,
} from "@/zod-schemes/clientSchema";
import type { IClientDetail } from "@/types/clients.types";
import { formatPhone } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export function useClientForms(client: IClientDetail) {
  const physicalForm = useForm<PhysicalClientData>({
    resolver: zodResolver(physicalClientSchema),
    defaultValues: {
      name: client.type === "physical" ? client.name || "" : "",
      contactPhone: client.type === "physical" ? client.contactPhone || "" : "",
      contactEmail: client.type === "physical" ? client.contactEmail || "" : "",
      passportSerial: client.type === "physical" ? client.passportSerial || "" : "",
      passportNumber: client.type === "physical" ? client.passportNumber || "" : "",
      actualAddress: client.type === "physical" ? client.actualAddress || "" : "",
      passportDate:
        client.type === "physical" && client.passportDate
          ? format(parseISO(client.passportDate), "dd.MM.yyyy")
          : "",
      passportSubdivision: client.type === "physical" ? client.passportSubdivision || "" : "",
    },
  });

  const legalForm = useForm<LegalClientData>({
    resolver: zodResolver(legalClientSchema),
    defaultValues: {
      name: client.type === "legal" ? client.name || "" : "",
      contactName: client.type === "legal" ? client.contactName || "" : "",
      contactPhone: client.type === "legal" ? client.contactPhone || "" : "",
      contactEmail: client.type === "legal" ? client.contactEmail || "" : "",
      actualAddress: client.type === "legal" ? client.actualAddress || "" : "",
      legalAddress: client.type === "legal" ? client.legalAddress || "" : "",
      inn: client.type === "legal" ? client.inn || "" : "",
      ogrn: client.type === "legal" ? client.ogrn || "" : "",
    },
  });

  // --- обработка телефона ---
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "physical" | "legal"
  ) => {
    const formatted = formatPhone(e.target.value);
    if (type === "physical")
      physicalForm.setValue("contactPhone", formatted, { shouldValidate: true });
    else legalForm.setValue("contactPhone", formatted, { shouldValidate: false });
  };

  // --- обработка серии паспорта ---
  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const truncated = digitsOnly.slice(0, 4);
    physicalForm.setValue("passportSerial", truncated, { shouldValidate: true, shouldDirty: true });
  };

  // --- обработка номера паспорта ---
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const truncated = digitsOnly.slice(0, 6);
    physicalForm.setValue("passportNumber", truncated, { shouldValidate: true, shouldDirty: true });
  };

  return {
    physicalForm,
    legalForm,
    handlePhoneChange,
    handleSerialChange,
    handleNumberChange,
  };
}
