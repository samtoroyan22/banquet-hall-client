"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useFetchClients } from "@/hooks/useFetchClients";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { format, startOfDay } from "date-fns";
import { Check, ChevronsUpDown, Minus, Plus } from "lucide-react";
import { formatAmountInput, sanitizeAmountInput } from "@/lib/utils";
import DateInputWithCalendar from "./ui/DateInputWithCalendar";
import { useRouter } from "next/navigation";
import { AppPages } from "@/config/pages";
import { useFetchDiscoverySources } from "@/hooks/useFetchDiscoverySources";
import type { TCreateReserveBody } from "@/types/reservations.types";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  date: string;
  placeId: string;
  placeName: string;
  onCreated?: () => void;
}

export default function ReservationCreateModal({
  open,
  setOpen,
  date,
  placeId,
  placeName,
  onCreated,
}: Props) {
  const [fromTime, setFromTime] = useState("12:00");
  const [toTime, setToTime] = useState("");
  const [person, setPerson] = useState(1);
  const [advancePayment, setAdvancePayment] = useState("");
  const [amountPayment, setAmountPayment] = useState("");
  const [comment, setComment] = useState("");
  const [prepaymentDate, setPrepaymentDate] = useState<Date | undefined>(undefined);
  const [prepaymentInput, setPrepaymentInput] = useState("");
  const { clients } = useFetchClients();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientPopoverOpen, setClientPopoverOpen] = useState(false);
  const { sources } = useFetchDiscoverySources();
  const [selectedDiscoverySourceId, setSelectedDiscoverySourceId] = useState<string | null>(null);
  const [discoveryPopoverOpen, setDiscoveryPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateBooking = async () => {
    if (!selectedClientId) return toast.error("Выберите клиента");
    if (!fromTime) return toast.error("Выберите время начала");
    if (person < 1) return toast.error("Количество гостей должно быть больше 0");
    if (advancePayment === "0") return toast.error("Сумма предоплаты должна быть больше 0");
    if (prepaymentDate && startOfDay(prepaymentDate) < startOfDay(new Date()))
      return toast.error("Дата предоплаты не может быть в прошлом");

    const apiDate = date;
    const prepaymentDateStr = prepaymentDate ? format(prepaymentDate, "yyyy-MM-dd") : null;

    const body: TCreateReserveBody = {
      date: apiDate,
      fromTime,
      toTime: toTime || null,
      person,
      advancePayment: advancePayment ? advancePayment.replace(/\s/g, "") : null,
      amountPayment: amountPayment ? amountPayment.replace(/\s/g, "") : null,
      prepaymentDate: prepaymentDateStr,
      comment: comment ? comment.trim() : null,
      clientId: selectedClientId,
      placeId,
    };

    if (selectedDiscoverySourceId) {
      body.discoverySourceId = selectedDiscoverySourceId;
    }

    setLoading(true);
    try {
      await apiFetch("/reserve/create", {
        method: "POST",
        body: JSON.stringify(body),
      });

      toast.success("Бронирование создано");
      onCreated?.();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка при создании бронирования");
    } finally {
      setLoading(false);
    }
  };

  const selectedClientName = clients.find((c) => c.id === selectedClientId)?.name || "";
  const selectedDiscoverySourceName =
    sources.find((s) => s.id === selectedDiscoverySourceId)?.name || "";

  console.log(clients);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary-dark text-lg font-semibold">
            Создание бронирования: {placeName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Дата и время */}
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label className="text-primary-dark text-sm">Дата</Label>
              <Input
                value={date}
                disabled
                className="border-text/20 text-muted-foreground focus-visible:ring-primary-foreground h-10 w-full rounded-xl"
              />
            </div>
            <div className="flex w-48 flex-col gap-2">
              <Label className="text-primary-dark text-sm">Время</Label>
              <div className="flex gap-2">
                <Input
                  type="time"
                  step={60}
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="bg-background focus-visible:ring-primary-foreground h-10 w-full rounded-xl [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <span className="text-muted-foreground self-center text-sm">—</span>
                <Input
                  type="time"
                  step={60}
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="bg-background focus-visible:ring-primary-foreground h-10 w-full rounded-xl [&::-webkit-calendar-picker-indicator]:hidden"
                />
              </div>
            </div>
          </div>
          {/* Клиент */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Popover open={clientPopoverOpen} onOpenChange={setClientPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={clientPopoverOpen}
                    className="border-text/10 focus-visible:ring-primary-foreground h-10 w-full justify-between rounded-xl"
                  >
                    {selectedClientName || "Выберите клиента"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-0">
                  <Command>
                    <CommandInput placeholder="Поиск клиента..." className="h-9" />

                    <CommandList
                      className="max-h-64 overflow-y-auto"
                      style={{ WebkitOverflowScrolling: "touch" }}
                      onWheelCapture={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                    >
                      <CommandEmpty>Клиент не найден.</CommandEmpty>

                      <CommandGroup>
                        {clients.map((client) => (
                          <CommandItem
                            key={client.id}
                            onSelect={() => {
                              setSelectedClientId(client.id);
                              setClientPopoverOpen(false);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="text-primary text-sm font-medium">
                                {client.name}
                              </span>
                              <span className="text-text/50 text-xs">
                                {client.contacts?.[0]?.phone || "—"}
                              </span>
                            </div>

                            {selectedClientId === client.id && (
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

            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`${AppPages.CLIENTS}?openAddClient=true`)}
              className="hover:bg-muted-foreground/10 text-primary bg-card flex h-10 w-10 items-center justify-center rounded-lg border"
              title="Добавить нового клиента"
            >
              <Plus size={14} />
            </Button>
          </div>
          {/* Количество гостей */}
          <div className="flex flex-col space-y-1">
            <Label className="text-primary-dark text-sm">Количество гостей</Label>
            <div className="flex items-center gap-2">
              <button
                className="hover:bg-muted cursor-pointer rounded-full p-2"
                type="button"
                onClick={() => setPerson((prev) => Math.max(1, prev - 1))}
              >
                <Minus size={15} className="text-primary" />
              </button>
              <Input
                className="border-text/20 focus-visible:ring-primary-foreground h-10 w-16 rounded-xl text-center"
                value={person}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPerson(val ? Number(val) : 0);
                }}
              />
              <button
                className="hover:bg-muted cursor-pointer rounded-full p-2"
                type="button"
                onClick={() => setPerson((prev) => prev + 1)}
              >
                <Plus size={15} className="text-primary" />
              </button>
            </div>
          </div>
          {/* Дата и сумма предоплаты */}
          <div className="flex justify-between">
            <div className="space-y-1">
              <Label className="text-primary-dark text-sm">Дата предоплаты</Label>
              <DateInputWithCalendar
                value={prepaymentInput}
                onChange={setPrepaymentInput}
                onDateChange={setPrepaymentDate}
                allowPast={false}
              />
            </div>
            <div className="space-y-1">
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
          {/* Стоимость */}
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
              className="border-text/20 focus-visible:ring-primary-foreground overflow-wrap-break-word h-10 max-h-50 w-full resize-y rounded-xl break-words"
              style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleCreateBooking} className="w-full" disabled={loading}>
            {loading ? "Бронирование..." : "Забронировать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
