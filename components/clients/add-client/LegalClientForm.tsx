"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { legalClientSchema, type LegalClientData } from "@/zod-schemes/clientSchema";
import { formatPhone } from "@/lib/utils";
import FormField from "../FormField";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCreated?: () => void;
}

export default function LegalClientForm({ setOpen, onCreated }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LegalClientData>({
    resolver: zodResolver(legalClientSchema),
    defaultValues: {
      name: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      actualAddress: "",
      legalAddress: "",
      inn: "",
      ogrn: "",
    },
  });

  const phone = watch("contactPhone");
  const inn = watch("inn");
  const ogrn = watch("ogrn");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("contactPhone", formatted, { shouldValidate: true });
  };

  const handleInnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    const limited = digits.slice(0, 10);
    setValue("inn", limited, { shouldValidate: true });
  };

  const handleOgrnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    const limited = digits.slice(0, 13);
    setValue("ogrn", limited, { shouldValidate: true });
  };

  const onSubmit = async (data: LegalClientData) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        type: "legal",
        contactName: data.contactName,
        contactEmail: data.contactEmail || undefined,
        contactPhone: data.contactPhone || undefined,
        actualAddress: data.actualAddress || undefined,
        legalAddress: data.legalAddress || undefined,
        inn: data.inn,
        ogrn: data.ogrn || undefined,
      };

      await apiFetch("/client/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Клиент (юр. лицо) успешно создан");
      onCreated?.();
      setOpen(false);
    } catch {
      toast.error("Ошибка при создании клиента");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
      {/* Название организации */}
      <FormField<LegalClientData>
        label="Название организации *"
        placeholder="Введите название"
        error={errors.name?.message}
        register={register}
        name="name"
      />

      {/* Контактное лицо */}
      <FormField<LegalClientData>
        label="Контактное лицо *"
        placeholder="Введите ФИО"
        error={errors.contactName?.message}
        register={register}
        name="contactName"
      />

      {/* Телефон и Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField<LegalClientData>
          label="Телефон"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={handlePhoneChange}
          error={errors.contactPhone?.message}
        />

        <FormField<LegalClientData>
          label="Email"
          placeholder="Введите Email"
          register={register}
          name="contactEmail"
          error={errors.contactEmail?.message}
        />
      </div>

      {/* ИНН и ОГРН */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField<LegalClientData>
          label="ИНН *"
          placeholder="Введите ИНН (10 цифр)"
          value={inn}
          onChange={handleInnChange}
          error={errors.inn?.message}
        />

        <FormField<LegalClientData>
          label="ОГРН"
          placeholder="Введите ОГРН (13 цифр)"
          value={ogrn}
          onChange={handleOgrnChange}
          error={errors.ogrn?.message}
        />
      </div>

      {/* Фактический и юридический адрес */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField<LegalClientData>
          label="Фактический адрес"
          placeholder="Введите адрес"
          register={register}
          name="actualAddress"
          error={errors.actualAddress?.message}
        />

        <FormField<LegalClientData>
          label="Юридический адрес"
          placeholder="Введите адрес"
          register={register}
          name="legalAddress"
          error={errors.legalAddress?.message}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-4 h-11 w-full cursor-pointer rounded-xl text-[15px] font-medium shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
      >
        {loading ? "Создание..." : "Создать клиента"}
      </Button>
    </form>
  );
}
