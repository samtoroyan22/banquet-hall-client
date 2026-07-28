"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { HistoryBody, ITypeHistory } from "@/types/clients.types";

import HistoryDateTimePicker from "./HistoryDateTimePicker";
import HistoryDescriptionSelect from "./HistoryDescriptionSelect";
import { apiFetch } from "@/lib/api";

interface Props {
  clientId: string;
  types: ITypeHistory[];
  refreshClient: () => Promise<void>;
}

export default function AddHistoryDialog({ clientId, types, refreshClient }: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("12:00");
  const [description, setDescription] = useState("");
  const [typeId, setTypeId] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!date) {
      toast.error("Заполните дату в формате: ДД:ММ:ГГГГ");
      return;
    }

    if (!time) {
      toast.error("Заполните время в формате: ЧЧ:ММ");
      return;
    }

    if (!typeId.trim()) {
      toast.error("Выберите тип взаимодействия");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const fullDate = new Date(date);
    fullDate.setHours(hours);
    fullDate.setMinutes(minutes);

    setLoading(true);
    try {
      const body: HistoryBody = {
        clientId,
        typeHistoryId: typeId.trim(),
        date: fullDate.toISOString(),
        description: description.trim() || undefined,
      };

      await apiFetch("/history/create", {
        method: "POST",
        body: JSON.stringify(body),
      });

      toast.success("Запись успешно добавлена!");
      setOpen(false);
      setDate(undefined);
      setTime("00:00");
      setDescription("");
      setTypeId("");
      await refreshClient();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка при создании записи");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="text-primary flex cursor-pointer items-center justify-center gap-2 py-3 hover:underline">
          <Plus className="h-5 w-5" />
          <span>Добавить запись</span>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl border p-6 shadow-2xl backdrop-blur-md">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-primary-dark text-lg font-semibold">
            Добавить запись в историю
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <HistoryDateTimePicker
            setDate={setDate}
            time={time}
            setTime={setTime}
            value={value}
            setValue={setValue}
          />

          <HistoryDescriptionSelect
            types={types}
            typeId={typeId}
            setTypeId={setTypeId}
            description={description}
            setDescription={setDescription}
          />

          <Button className="w-full" onClick={handleSave} disabled={loading}>
            {loading ? "Добавление..." : "Добавить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
