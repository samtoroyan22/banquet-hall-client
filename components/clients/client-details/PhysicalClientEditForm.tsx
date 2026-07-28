"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DateInputWithCalendar from "@/components/reservations/ui/DateInputWithCalendar";
import type { PhysicalClientData } from "@/zod-schemes/clientSchema";
import type { UseFormReturn } from "react-hook-form";
import FormField from "../FormField";

interface Props {
  form: UseFormReturn<PhysicalClientData>;
  editMode: boolean;
  loading: boolean;
  onSubmit: (data: PhysicalClientData) => void;
  onCancel: () => void;
  onEdit: () => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSerialChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PhysicalClientEditForm({
  form,
  editMode,
  loading,
  onSubmit,
  onCancel,
  onEdit,
  onPhoneChange,
  onSerialChange,
  onNumberChange,
}: Props) {
  const passportDate = form.watch("passportDate");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-5">
      {/* ФИО */}
      <FormField<PhysicalClientData>
        label="ФИО *"
        placeholder="Введите ФИО"
        register={form.register}
        name="name"
        error={form.formState.errors.name?.message}
        disabled={!editMode}
      />

      {/* Телефон и Email */}
      <div className="grid grid-cols-2 gap-4">
        <FormField<PhysicalClientData>
          label="Телефон *"
          placeholder="+7 (___) ___-__-__"
          value={form.watch("contactPhone")}
          onChange={onPhoneChange}
          error={form.formState.errors.contactPhone?.message}
          disabled={!editMode}
        />

        <FormField<PhysicalClientData>
          label="Email"
          placeholder="Введите Email"
          register={form.register}
          name="contactEmail"
          error={form.formState.errors.contactEmail?.message}
          disabled={!editMode}
        />
      </div>

      <FormField<PhysicalClientData>
        label="Адрес"
        placeholder="Введите адрес"
        register={form.register}
        name="actualAddress"
        error={form.formState.errors.passportSubdivision?.message}
        disabled={!editMode}
      />

      {/* Паспортные данные — серия, номер, дата */}
      <div className="grid grid-cols-3 gap-4">
        <FormField<PhysicalClientData>
          label="Серия"
          placeholder="____"
          value={form.watch("passportSerial")}
          onChange={onSerialChange}
          error={form.formState.errors.passportSerial?.message}
          disabled={!editMode}
        />

        <FormField<PhysicalClientData>
          label="Номер"
          placeholder="______"
          value={form.watch("passportNumber")}
          onChange={onNumberChange}
          error={form.formState.errors.passportNumber?.message}
          disabled={!editMode}
        />

        <div className="flex flex-col space-y-1">
          <Label className="text-primary-dark text-sm">Дата выдачи</Label>
          <DateInputWithCalendar
            value={passportDate || ""}
            onChange={(value) => form.setValue("passportDate", value, { shouldValidate: true })}
            allowPast={true}
            placeholder="ДД.ММ.ГГГГ"
            disabled={!editMode}
          />
          {form.formState.errors.passportDate && (
            <p className="text-destructive text-sm">{form.formState.errors.passportDate.message}</p>
          )}
        </div>
      </div>

      {/* Кем выдан */}
      <FormField<PhysicalClientData>
        label="Кем выдан"
        placeholder="Введите подразделение"
        register={form.register}
        name="passportSubdivision"
        error={form.formState.errors.passportSubdivision?.message}
        disabled={!editMode}
      />

      {/* Кнопки */}
      {!editMode ? (
        <Button type="button" onClick={onEdit}>
          Редактировать
        </Button>
      ) : (
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отменить
          </Button>
        </div>
      )}
    </form>
  );
}
