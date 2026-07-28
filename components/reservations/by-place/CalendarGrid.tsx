"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  startOfDay,
} from "date-fns";
import { toast } from "sonner";
import type { IReserve } from "@/types/reservations.types";
import CalendarDayCell from "./CalendarDayCell";
import ReservationCreateModal from "../ReservationCreateModal";
import ReserveDetailModal from "../ReserveDetailModal";
import { format } from "date-fns";

interface Props {
  data: IReserve[];
  currentMonth: Date;
  placeId: string;
  placeName: string;
  onRefresh?: () => void;
}

export default function CalendarGrid({ data, currentMonth, placeId, placeName, onRefresh }: Props) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedReserves, setSelectedReserves] = useState<IReserve[]>([]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDayClick = (day: Date, reserves: IReserve[]) => {
    const today = startOfDay(new Date());
    const selectedDay = startOfDay(day);

    console.log(reserves);

    const realReserves = reserves.filter((r) => r.number && r.number !== "-");

    if (realReserves.length > 0) {
      setSelectedReserves(realReserves);
      setDetailDrawerOpen(true);
      return;
    }

    if (selectedDay < today) {
      toast.error("Нельзя создавать бронь на прошедшую дату");
      return;
    }

    const localDate = format(day, "yyyy-MM-dd");
    setSelectedDate(localDate);
    setCreateModalOpen(true);
  };

  const handleBookingCreatedOrDeleted = () => {
    setCreateModalOpen(false);
    setDetailDrawerOpen(false);
    onRefresh?.();
  };

  return (
    <>
      <div className="text-text/50 grid grid-cols-7 gap-2 text-center text-sm font-medium">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
          <div key={day} className="bg-muted rounded-md py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {allDays.map((day) => {
          const reservesForDay = data.filter(
            (r) => new Date(r.date).toDateString() === day.toDateString()
          );
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <CalendarDayCell
              key={day.toISOString()}
              day={day}
              reserves={reservesForDay}
              isCurrentMonth={isCurrentMonth}
              onClick={isCurrentMonth ? () => handleDayClick(day, reservesForDay) : undefined}
            />
          );
        })}
      </div>

      {createModalOpen && selectedDate && (
        <ReservationCreateModal
          open={createModalOpen}
          setOpen={setCreateModalOpen}
          date={selectedDate}
          placeId={placeId}
          placeName={placeName}
          onCreated={handleBookingCreatedOrDeleted}
        />
      )}

      {detailDrawerOpen && selectedReserves.length > 0 && (
        <ReserveDetailModal
          reserveIds={selectedReserves.map((r) => r.id)}
          open={detailDrawerOpen}
          setOpen={setDetailDrawerOpen}
          date={selectedReserves[0].date}
          placeId={placeId}
          placeName={placeName}
          onBookingDeleted={handleBookingCreatedOrDeleted}
        />
      )}
    </>
  );
}
