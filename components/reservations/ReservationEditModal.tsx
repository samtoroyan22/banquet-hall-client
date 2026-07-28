"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { formatAmountInput, sanitizeAmountInput } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Check, ChevronsUpDown, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import type { IReserveDetail, TUpdateData } from "@/types/reservations.types";
import DateInputWithCalendar from "./ui/DateInputWithCalendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useFetchDiscoverySources } from "@/hooks/useFetchDiscoverySources";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  reserve: IReserveDetail;
  onUpdated?: () => void;
}

export default function ReservationEditModal({ open, setOpen, reserve, onUpdated }: Props) {
  const [fromTime, setFromTime] = useState(reserve.fromTime || "");
  const [toTime, setToTime] = useState(reserve.toTime || "");
  const [person, setPerson] = useState(reserve.person);
  const { sources } = useFetchDiscoverySources();
  const [selectedDiscoverySourceId, setSelectedDiscoverySourceId] = useState<string | null>(null);
  const [discoveryPopoverOpen, setDiscoveryPopoverOpen] = useState(false);
  const [advancePayment, setAdvancePayment] = useState(
    reserve.advancePayment ? String(reserve.advancePayment) : ""
  );
  const [amountPayment, setAmountPayment] = useState(
    reserve.amountPayment ? String(reserve.amountPayment) : ""
  );
  const [comment, setComment] = useState(reserve.comment || "");
  const [isFinished, setIsFinished] = useState(Boolean(reserve.isFinished));
  const [isFinishedDisabled, setIsFinishedDisabled] = useState(false);

  const [prepaymentDate, setPrepaymentDate] = useState<Date | undefined>(undefined);
  const [prepaymentInput, setPrepaymentInput] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFromTime(reserve.fromTime || "");
      setToTime(reserve.toTime || "");
      setPerson(reserve.person);
      setAdvancePayment(reserve.advancePayment ? String(reserve.advancePayment) : "");
      setAmountPayment(reserve.amountPayment ? String(reserve.amountPayment) : "");
      setComment(reserve.comment || "");
      setIsFinished(Boolean(reserve.isFinished));
      setIsFinishedDisabled(Boolean(reserve.isFinished));
      setSelectedDiscoverySourceId(reserve.discoverySource?.id ?? null);

      const prepay = reserve.prepaymentDate
        ? new Date(reserve.prepaymentDate + "T00:00:00")
        : undefined;
      setPrepaymentDate(prepay);
      setPrepaymentInput(prepay ? format(prepay, "dd.MM.yyyy") : "");
    }
  }, [open, reserve]);

  const handleEditBooking = async () => {
    if (!fromTime) return toast.error("Выберите время начала");
    if (advancePayment === "0") return toast.error("Сумма предоплаты должна быть больше 0");

    const updateData: TUpdateData = {};

    if (fromTime !== reserve.fromTime) updateData.fromTime = fromTime;
    if ((toTime || "") !== (reserve.toTime || "")) updateData.toTime = toTime || null;
    if (person !== reserve.person) updateData.person = person;

    if ((advancePayment || "") !== (reserve.advancePayment ? String(reserve.advancePayment) : ""))
      updateData.advancePayment = advancePayment ? advancePayment.replace(/\s/g, "") : null;

    if ((amountPayment || "") !== (reserve.amountPayment ? String(reserve.amountPayment) : ""))
      updateData.amountPayment = amountPayment ? amountPayment.replace(/\s/g, "") : null;

    if ((comment || "") !== (reserve.comment || "")) updateData.comment = comment || null;
    if (isFinished !== Boolean(reserve.isFinished)) updateData.isFinished = isFinished;

    const newPrepayStr = prepaymentDate ? format(prepaymentDate, "yyyy-MM-dd") : null;
    const oldPrepayStr = reserve.prepaymentDate || null;
    console.log(newPrepayStr, oldPrepayStr);

    if (newPrepayStr !== oldPrepayStr) updateData.prepaymentDate = newPrepayStr;

    const oldDiscoveryId = reserve.discoverySource?.id ?? null;
    if (selectedDiscoverySourceId !== oldDiscoveryId) {
      updateData.discoverySourceId = selectedDiscoverySourceId;
    }

    if (Object.keys(updateData).length === 0) return toast("Ничего не изменено");

    setLoading(true);
    try {
      await apiFetch("/reserve/edit", {
        method: "POST",
        body: JSON.stringify({
          reserveId: reserve.id,
          updateData,
        }),
      });

      toast.success("Бронирование обновлено");
      onUpdated?.();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка при редактировании");
    } finally {
      setLoading(false);
    }
  };

  const selectedDiscoverySourceName =
    sources.find((s) => s.id === selectedDiscoverySourceId)?.name || "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary-dark text-lg font-semibold">
            Редактирование бронирования
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Время + Гости */}
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 flex-col space-y-1">
              <Label className="text-primary-dark text-sm">Время</Label>
              <div className="flex gap-2">
                <Input
                  type="time"
                  step={60}
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="bg-background focus-visible:ring-primary-foreground h-10 w-1/2 rounded-xl"
                />
                <span className="text-muted-foreground self-center text-sm">—</span>
                <Input
                  type="time"
                  step={60}
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="bg-background focus-visible:ring-primary-foreground h-10 w-1/2 rounded-xl"
                />
              </div>
            </div>

            <div className="flex-1 flex-col space-y-1">
              <Label className="text-primary-dark text-sm">Количество гостей</Label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="hover:bg-muted cursor-pointer rounded-full p-2"
                  onClick={() => setPerson((p) => Math.max(1, p - 1))}
                >
                  <Minus size={15} className="text-primary" />
                </button>
                <Input
                  className="border-text/20 focus-visible:ring-primary-foreground h-10 w-16 rounded-xl text-center"
                  value={person}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setPerson(v ? Number(v) : 0);
                  }}
                />
                <button
                  type="button"
                  className="hover:bg-muted cursor-pointer rounded-full p-2"
                  onClick={() => setPerson((p) => p + 1)}
                >
                  <Plus size={15} className="text-primary" />
                </button>
              </div>
            </div>
          </div>

          {/* Дата предоплаты + Сумма предоплаты */}
          <div className="flex justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-primary-dark text-sm">Дата предоплаты</Label>
              <DateInputWithCalendar
                value={prepaymentInput}
                onChange={setPrepaymentInput}
                onDateChange={setPrepaymentDate}
                allowPast={false}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-primary-dark text-sm">Сумма предоплаты</Label>
              <Input
                type="text"
                inputMode="decimal"
                value={formatAmountInput(advancePayment)}
                onChange={(e) => setAdvancePayment(sanitizeAmountInput(e.target.value))}
                placeholder="Например: 50 000.99"
                className="border-text/20 focus-visible:ring-primary-foreground h-10 w-full rounded-xl"
              />
            </div>
          </div>

          {/* Общая стоимость */}
          <div className="space-y-1">
            <Label className="text-primary-dark text-sm">Общая стоимость</Label>
            <Input
              type="text"
              inputMode="decimal"
              value={formatAmountInput(amountPayment)}
              onChange={(e) => setAmountPayment(sanitizeAmountInput(e.target.value))}
              placeholder="Например: 50 000.99"
              className="border-text/20 focus-visible:ring-primary-foreground h-10 w-full rounded-xl"
            />
          </div>

          {/* Завершено */}
          <div className="flex items-center gap-3 pt-2">
            <Checkbox
              id="isFinished"
              checked={isFinished}
              onCheckedChange={(v) => setIsFinished(Boolean(v))}
              disabled={isFinishedDisabled}
              className="h-6 w-6 cursor-pointer rounded-lg border"
            />
            <Label
              htmlFor="isFinished"
              className={`text-primary-dark text-sm ${
                isFinishedDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            >
              Мероприятие завершено
            </Label>
          </div>

          {/* Откуда узнали о нас */}
          <div className="flex flex-col gap-2">
            <Label className="text-primary-dark text-sm">Откуда узнали о нас</Label>

            <Popover open={discoveryPopoverOpen} onOpenChange={setDiscoveryPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={discoveryPopoverOpen}
                  className="border-text/10 focus-visible:ring-primary-foreground h-10 w-full justify-between rounded-xl"
                >
                  {selectedDiscoverySourceName || "Выберите источник"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Поиск..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Ничего не найдено.</CommandEmpty>
                    <CommandGroup>
                      {sources.map((source) => (
                        <CommandItem
                          key={source.id}
                          onSelect={() => {
                            setSelectedDiscoverySourceId(source.id);
                            setDiscoveryPopoverOpen(false);
                          }}
                        >
                          {source.name}
                          {selectedDiscoverySourceId === source.id && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Комментарий */}
          <div className="flex flex-col space-y-1">
            <Label className="text-primary-dark text-sm">Комментарий</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Комментарий к бронированию"
              className="border-text/20 focus-visible:ring-primary-foreground h-10 max-h-50 w-full resize-y rounded-xl break-words"
              style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleEditBooking} className="w-full" disabled={loading}>
            {loading ? "Сохраняем..." : "Сохранить изменения"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
