"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomSelect from "@/components/ui/select";
import type { ITypeHistory } from "@/types/clients.types";

interface Props {
  types: ITypeHistory[];
  typeId: string;
  setTypeId: (id: string) => void;
  description: string;
  setDescription: (val: string) => void;
}

export default function HistoryDescriptionSelect({
  types,
  typeId,
  setTypeId,
  description,
  setDescription,
}: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-primary-dark text-sm">Тип взаимодействия *</Label>
      <CustomSelect
        options={types.map((t) => ({ label: t.name, value: t.id }))}
        value={typeId}
        onChange={setTypeId}
        placeholder="Выберите тип"
        className="w-full rounded-xl"
      />

      <Label className="text-primary-dark text-sm">Описание</Label>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Введите описание"
        className="bg-background focus-visible:ring-primary-foreground"
      />
    </div>
  );
}
