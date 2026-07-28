"use client";

import { Button } from "@/components/ui/button";
import type { LegalClientData } from "@/zod-schemes/clientSchema";
import type { UseFormReturn } from "react-hook-form";
import FormField from "../FormField";

interface Props {
  form: UseFormReturn<LegalClientData>;
  editMode: boolean;
  loading: boolean;
  onSubmit: (data: LegalClientData) => void;
  onCancel: () => void;
  onEdit: () => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LegalClientEditForm({
  form,
  editMode,
  loading,
  onSubmit,
  onCancel,
  onEdit,
  onPhoneChange,
}: Props) {
  const { watch, setValue, formState } = form;

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

  const fields: {
    label: string;
    field: keyof LegalClientData;
    phone?: boolean;
    inn?: boolean;
  }[] = [
    { label: "Название организации", field: "name" },
    { label: "Контактное лицо", field: "contactName" },
    { label: "Телефон", field: "contactPhone", phone: true },
    { label: "Email", field: "contactEmail" },
    { label: "ИНН", field: "inn", inn: true },
    { label: "ОГРН", field: "ogrn" },
    { label: "Фактический адрес", field: "actualAddress" },
    { label: "Юридический адрес", field: "legalAddress" },
  ];

  const renderField = (
    label: string,
    field: keyof LegalClientData,
    phone?: boolean,
    inn?: boolean
  ) => {
    const error = formState.errors[field]?.message as string | undefined;

    if (phone) {
      return (
        <FormField<LegalClientData>
          key={field}
          label={label}
          placeholder={label}
          value={watch("contactPhone")}
          onChange={onPhoneChange}
          error={error}
          disabled={!editMode}
        />
      );
    }

    if (inn) {
      return (
        <FormField<LegalClientData>
          key={field}
          label={label}
          placeholder="Введите ИНН (10 цифр)"
          value={watch("inn")}
          onChange={handleInnChange}
          error={error}
          disabled={!editMode}
        />
      );
    }

    if (field === "ogrn") {
      return (
        <FormField<LegalClientData>
          key={field}
          label={label}
          placeholder="Введите ОГРН (13 цифр)"
          value={watch("ogrn")}
          onChange={handleOgrnChange}
          error={error}
          disabled={!editMode}
        />
      );
    }

    return (
      <FormField<LegalClientData>
        key={field}
        label={label}
        placeholder={`Введите ${label.toLowerCase()}`}
        register={form.register}
        name={field}
        error={error}
        disabled={!editMode}
      />
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-3 gap-6 md:grid-cols-2">
        {fields
          .slice(0, 6)
          .map(({ label, field, phone, inn }) => renderField(label, field, phone, inn))}
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
        {fields
          .slice(6, 8)
          .map(({ label, field, phone, inn }) => renderField(label, field, phone, inn))}
      </div>

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
