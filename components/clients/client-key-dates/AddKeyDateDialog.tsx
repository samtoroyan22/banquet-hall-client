"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import DateInputWithCalendar from "@/components/reservations/ui/DateInputWithCalendar";
import { format } from "date-fns";

interface Props {
  clientId: string;
  refreshClient: () => Promise<void>;
}

export default function AddKeyDateDialog({ clientId, refreshClient }: Props) {
  const [open, setOpen] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!selectedDate) {
      toast.error("Заполните дату в формате: ДД:ММ:ГГГГ");
      return;
    }

    if (!description.trim()) {
      toast.error("Заполните название");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/client/create-key-date", {
        method: "POST",
        body: JSON.stringify({
          clientId,
          date: format(selectedDate, "yyyy-MM-dd"),
          description: description.trim(),
        }),
      });

      toast.success("Дата успешно добавлена!");
      setOpen(false);
      setDateInput("");
      setSelectedDate(undefined);
      setDescription("");
      await refreshClient();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка при создании даты");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="key-date-card border-primary-dark text-primary-dark hover:bg-primary/5 flex h-24 w-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed font-bold transition">
          <Plus size={30} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl border p-6 shadow-2xl backdrop-blur-md">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-primary-dark text-lg font-semibold">
            Добавить ключевую дату
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-primary-dark text-sm">Дата *</Label>
            <DateInputWithCalendar
              value={dateInput}
              onChange={setDateInput}
              onDateChange={setSelectedDate}
              allowPast={true}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-primary-dark text-sm">Название *</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-text/20 focus-visible:ring-primary-foreground h-10 w-full rounded-xl"
              placeholder="Введите название"
            />
          </div>

          <Button className="w-full" onClick={handleSave} disabled={loading}>
            {loading ? "Добавление..." : "Добавить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
