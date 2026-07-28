"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { physicalClientSchema, type PhysicalClientData } from "@/zod-schemes/clientSchema";
import { formatPhone, parseDateToISO } from "@/lib/utils";
import FormField from "../FormField";

import { Label } from "@/components/ui/label";
import DateInputWithCalendar from "@/components/reservations/ui/DateInputWithCalendar";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCreated?: () => void;
}

export default function PhysicalClientForm({ setOpen, onCreated }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PhysicalClientData>({
    resolver: zodResolver(physicalClientSchema),
    defaultValues: {
      name: "",
      contactPhone: "",
      contactEmail: "",
      actualAddress: "",
      passportSerial: "",
      passportNumber: "",
      passportDate: "",
      passportSubdivision: "",
    },
  });

  const phone = watch("contactPhone");
  const passportSerial = watch("passportSerial");
  const passportNumber = watch("passportNumber");
  const passportDate = watch("passportDate");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("contactPhone", formatted, { shouldValidate: true });
  };

  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setValue("passportSerial", digits, { shouldValidate: true });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setValue("passportNumber", digits, { shouldValidate: true });
  };

  const onSubmit = async (data: PhysicalClientData) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        type: "physical",
        contactName: data.name,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail || undefined,
        actualAddress: data.actualAddress || undefined,
        passportSerial: data.passportSerial || undefined,
        passportNumber: data.passportNumber || undefined,
        passportDate: data.passportDate ? parseDateToISO(data.passportDate) : undefined,
        passportSubdivision: data.passportSubdivision || undefined,
      };

      await apiFetch("/client/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Клиент (физ. лицо) успешно создан");
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
      {/* ФИО */}
      <FormField<PhysicalClientData>
        label="ФИО *"
        placeholder="Введите ФИО"
        register={register}
        name="name"
        error={errors.name?.message}
      />

      {/* Телефон и Email */}
      <div className="grid grid-cols-2 gap-4">
        <FormField<PhysicalClientData>
          label="Телефон *"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={handlePhoneChange}
          error={errors.contactPhone?.message}
        />

        <FormField<PhysicalClientData>
          label="Email"
          placeholder="Введите Email"
          register={register}
          name="contactEmail"
          error={errors.contactEmail?.message}
        />
      </div>

      <FormField<PhysicalClientData>
        label="Адрес"
        placeholder="Введите адрес"
        register={register}
        name="actualAddress"
        error={errors.actualAddress?.message}
      />

      {/* Паспортные данные — серия, номер, дата */}
      <div className="grid grid-cols-3 gap-4">
        <FormField<PhysicalClientData>
          label="Серия"
          placeholder="____"
          value={passportSerial}
          onChange={handleSerialChange}
          error={errors.passportSerial?.message}
        />

        <FormField<PhysicalClientData>
          label="Номер"
          placeholder="______"
          value={passportNumber}
          onChange={handleNumberChange}
          error={errors.passportNumber?.message}
        />

        <div className="flex flex-col space-y-1">
          <Label className="text-primary-dark text-sm">Дата выдачи</Label>
          <DateInputWithCalendar
            value={passportDate || ""}
            onChange={(value) => setValue("passportDate", value, { shouldValidate: true })}
            allowPast={true}
            placeholder="ДД.ММ.ГГГГ"
          />
          {errors.passportDate && (
            <p className="text-destructive text-sm">{errors.passportDate.message}</p>
          )}
        </div>
      </div>

      {/* Кем выдан */}
      <FormField<PhysicalClientData>
        label="Кем выдан"
        placeholder="Введите подразделение"
        register={register}
        name="passportSubdivision"
        error={errors.passportSubdivision?.message}
      />

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
