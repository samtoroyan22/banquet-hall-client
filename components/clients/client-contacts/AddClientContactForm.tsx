"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { clientContactSchema, type ClientContactData } from "@/zod-schemes/clientSchema";
import { formatPhone } from "@/lib/utils";
import FormField from "../FormField";

interface Props {
  clientId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCreated?: () => void;
}

export default function AddClientContactForm({ clientId, setOpen, onCreated }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientContactData>({
    resolver: zodResolver(clientContactSchema),
    defaultValues: {
      name: "",
      position: "",
      email: "",
      phone: "+7 ",
    },
  });

  const phone = watch("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("phone", formatted, { shouldValidate: true });
  };

  const onSubmit = async (data: ClientContactData) => {
    setLoading(true);
    try {
      const payload = {
        clientId,
        name: data.name.trim(),
        phone: data.phone.trim(),
        position: data.position?.trim() || undefined,
        email: data.email?.trim() || undefined,
      };

      await apiFetch("/client/create-contact", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Контакт успешно добавлен");
      setOpen(false);
      onCreated?.();
    } catch {
      toast.error("Ошибка при добавлении контакта");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
      {/* Имя */}
      <FormField<ClientContactData>
        label="Имя контакта *"
        placeholder="Введите имя"
        error={errors.name?.message}
        register={register}
        name="name"
      />

      {/* Телефон */}
      <FormField<ClientContactData>
        label="Телефон *"
        placeholder="+7 (___) ___-__-__"
        value={phone}
        onChange={handlePhoneChange}
        error={errors.phone?.message}
      />

      {/* Должность */}
      <FormField<ClientContactData>
        label="Должность"
        placeholder="Введите должность"
        error={errors.position?.message}
        register={register}
        name="position"
      />

      {/* Email */}
      <FormField<ClientContactData>
        label="Email"
        placeholder="Введите Email"
        error={errors.email?.message}
        register={register}
        name="email"
      />

      {/* Кнопка */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Сохранение..." : "Добавить контакт"}
      </Button>
    </form>
  );
}
