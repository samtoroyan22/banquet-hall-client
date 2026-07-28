"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { format, subDays } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Clock,
  MapPin,
  User,
  Users,
  MessageSquare,
  RussianRuble,
  SquareCheckBig,
  CalendarDays,
  Plus,
} from "lucide-react";
import { cn, formatAmountInput, formatComment, parseDate, startOfDay } from "@/lib/utils";
import { DetailItem } from "./ui/DetailItem";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import type { IReserveDetail } from "@/types/reservations.types";
import ReservationCreateModal from "./ReservationCreateModal";
import ConfirmDeleteModal from "../clients/ConfirmDeleteModal";
import ReservationEditModal from "./ReservationEditModal";
interface Props {
  reserveIds: string[];
  open: boolean;
  setOpen: (open: boolean) => void;
  date: string;
  placeId: string;
  placeName: string;
  onBookingDeleted?: () => void;
}
export default function ReserveDetailModal({
  reserveIds,
  open,
  setOpen,
  date,
  placeId,
  placeName,
  onBookingDeleted,
}: Props) {
  const [reserves, setReserves] = useState<IReserveDetail[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all(
      reserveIds.map((id) =>
        apiFetch<IReserveDetail>("/reserve/detail", {
          method: "POST",
          body: JSON.stringify({ reserveId: id }),
        })
      )
    )
      .then(setReserves)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Ошибка при загрузке брони"))
      .finally(() => setLoading(false));
  }, [open, reserveIds]);
  const reserve = reserves[activeIndex];
  const today = startOfDay(new Date());
  const yesterday = startOfDay(subDays(new Date(), 1));
  const reserveDay = parseDate(date);
  const isPast = reserveDay < today;
  const isBeforeYesterday = reserveDay < yesterday;
  const handleDelete = async (id: string) => {
    try {
      await apiFetch("/reserve/delete", {
        method: "POST",
        body: JSON.stringify({ reserveId: id }),
      });
      toast.success("Бронирование успешно удалено");
      onBookingDeleted?.();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка при удалении бронирования");
    }
  };
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-lg flex-col shadow-2xl transition-transform duration-300 ease-out">
        <DrawerHeader className="bg-card/80 border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-primary-dark text-lg font-semibold">
              Детали бронирования
            </DrawerTitle>
            {!isPast && reserves.length < 2 && (
              <Button
                size="sm"
                variant="link"
                className="flex items-center gap-1"
                onClick={() => setCreateModalOpen(true)}
              >
                <Plus size={16} /> Добавить
              </Button>
            )}
          </div>
        </DrawerHeader>
        {reserves.length > 1 && (
          <div className="mt-4 px-6">
            <div className="relative flex h-10 w-full overflow-hidden rounded-full bg-gradient-to-r from-slate-100 to-slate-50 shadow-inner ring-1 ring-slate-200">
              <div
                className={cn(
                  "from-primary to-primary-dark absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r transition-transform duration-300 ease-out",
                  activeIndex === 1 && "translate-x-full"
                )}
              />
              <button
                className={cn(
                  "relative z-10 flex h-full w-1/2 cursor-pointer items-center justify-center text-sm font-medium transition-colors",
                  activeIndex === 0 ? "text-text-foreground" : "text-primary-dark"
                )}
                onClick={() => setActiveIndex(0)}
              >
                Бронь 1
              </button>
              <button
                className={cn(
                  "relative z-10 flex h-full w-1/2 cursor-pointer items-center justify-center text-sm font-medium transition-colors",
                  activeIndex === 1 ? "text-text-foreground" : "text-primary-dark"
                )}
                onClick={() => setActiveIndex(1)}
              >
                Бронь 2
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {loading ? (
            <p className="text-center text-sm text-gray-500">Загрузка данных...</p>
          ) : (
            reserve && (
              <div className="space-y-4">
                <div className="bg-primary-dark text-text-foreground flex items-center justify-between rounded-xl p-4 shadow-sm">
                  <div>
                    <p className="flex items-center gap-2">
                      <MapPin className="text-text-foreground/80 h-5 w-5" /> Место
                    </p>
                    <p>{reserve.place.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center justify-end gap-2">
                      <CalendarDays className="text-text-foreground/80 h-5 w-5" /> Дата
                    </p>
                    <p>{format(reserveDay, "d MMMM yyyy", { locale: ru })}</p>
                  </div>
                </div>
                <div className="bg-card divide-primary text-text-foreground divide-y rounded-xl border p-4 shadow-sm">
                  <DetailItem icon={User} label="Клиент" value={reserve.client.name} />
                  <DetailItem
                    icon={Clock}
                    label="Время"
                    value={
                      reserve.fromTime
                        ? reserve.toTime
                          ? `${reserve.fromTime.slice(0, 5)} — ${reserve.toTime.slice(0, 5)}`
                          : reserve.fromTime.slice(0, 5)
                        : "—"
                    }
                  />
                  <DetailItem
                    icon={SquareCheckBig}
                    label="Статус"
                    value={reserve.reserveStatus.name}
                  />
                  <DetailItem icon={Users} label="Гостей" value={reserve.person} />
                  <DetailItem
                    icon={CalendarDays}
                    label="Дата предоплаты"
                    value={
                      reserve.prepaymentDate
                        ? format(reserve.prepaymentDate, "d MMMM yyyy", { locale: ru })
                        : "-"
                    }
                  />
                  <DetailItem
                    icon={RussianRuble}
                    label="Сумма предоплаты"
                    value={
                      reserve.advancePayment
                        ? formatAmountInput(String(reserve.advancePayment))
                        : "-"
                    }
                  />
                  <DetailItem
                    icon={RussianRuble}
                    label="Общая стоимость"
                    value={
                      reserve.amountPayment ? formatAmountInput(String(reserve.amountPayment)) : "-"
                    }
                  />
                  <DetailItem
                    icon={MessageSquare}
                    label="Комментарий"
                    value={formatComment(reserve.comment || "-")}
                  />
                </div>
                {reserve.reserveStatus.index !== 3 && (
                  <div
                    className={`flex items-center ${
                      !isBeforeYesterday && !isPast ? "justify-between" : "justify-center"
                    }`}
                  >
                    {!isBeforeYesterday && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border px-6"
                        onClick={() => setEditModalOpen(true)}
                      >
                        Редактировать
                      </Button>
                    )}
                    {!isPast && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="border px-6"
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        Отменить бронь
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>
        <DrawerFooter>
          <Button
            onClick={() => setOpen(false)}
            className="hover:bg-primary-dark bg-primary h-12 w-full text-base font-medium text-white shadow-md transition-all duration-200"
          >
            Закрыть
          </Button>
        </DrawerFooter>
        {createModalOpen && (
          <ReservationCreateModal
            open={createModalOpen}
            setOpen={setCreateModalOpen}
            date={date}
            placeId={placeId}
            placeName={placeName}
            onCreated={() => {
              setCreateModalOpen(false);
              onBookingDeleted?.();
              setOpen(false);
            }}
          />
        )}
        {editModalOpen && reserve && (
          <ReservationEditModal
            open={editModalOpen}
            setOpen={setEditModalOpen}
            reserve={reserve}
            onUpdated={() => {
              setEditModalOpen(false);
              onBookingDeleted?.();
              setOpen(false);
            }}
          />
        )}
        {reserve && (
          <ConfirmDeleteModal
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            title="Вы хотите отменить бронирование?"
            onConfirm={() => handleDelete(reserve.id)}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
