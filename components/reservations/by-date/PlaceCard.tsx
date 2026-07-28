"use client";

import { useState } from "react";
import { cn, parseDateToISO, startOfDay } from "@/lib/utils";
import { toast } from "sonner";
import type { IPlace } from "@/types/reservations.types";
import ReservationCreateModal from "../ReservationCreateModal";
import ReserveDetailModal from "../ReserveDetailModal";
import { User, Users } from "lucide-react";

interface Props {
  place: IPlace;
  currentDate: string;
  onBookingCreated?: () => void;
}

export default function PlaceCard({ place, currentDate, onBookingCreated }: Props) {
  const isOccupied = place.reserves && place.reserves.length > 0;
  const reserves = place.reserves || [];

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const selectedDateISO = parseDateToISO(currentDate);
  const selectedDateObj = startOfDay(new Date(selectedDateISO));
  const today = startOfDay(new Date());
  const isPast = selectedDateObj < today;

  const handleClick = () => {
    if (isOccupied) {
      setDetailModalOpen(true);
      return;
    }

    if (isPast) {
      toast.error("Нельзя создавать бронь на прошедшую дату");
      return;
    }

    setCreateModalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "flex cursor-pointer flex-col rounded-xl shadow-sm transition-transform duration-150 active:scale-[0.99]",
          "border",
          isOccupied
            ? "border-red-500 bg-red-50"
            : isPast
              ? "border-gray-400 bg-gray-50"
              : "border-green-500 bg-green-50"
        )}
        onClick={handleClick}
      >
        <div
          className={cn(
            "w-full rounded-t-lg px-3 py-2 text-center text-lg font-semibold text-white",
            isOccupied ? "bg-red-500" : isPast ? "bg-gray-400" : "bg-green-500"
          )}
        >
          {place.name}
        </div>

        <div className="flex min-h-[80px] flex-1 flex-col items-center justify-center px-2 py-2 text-center">
          {!isOccupied ? (
            <span
              className={cn("text-lg font-medium", isPast ? "text-gray-600" : "text-green-700")}
            >
              Свободно
            </span>
          ) : (
            <div className="flex w-full flex-col items-center gap-2">
              <span className="text-lg font-medium text-red-700">
                {reserves.length} {reserves.length === 1 ? "бронь" : "брони"}
              </span>

              <div className="flex w-full flex-col gap-1">
                {reserves.map((r, index) => {
                  const colorClass =
                    r.reserveStatus?.index === 1
                      ? "bg-blue-500"
                      : r.reserveStatus?.index === 2
                        ? "bg-yellow-500"
                        : "bg-green-500";

                  return (
                    <div
                      key={r.id}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-red-100/70 py-1"
                    >
                      {index === 0 ? (
                        <User className="h-4 w-4 text-red-700" />
                      ) : (
                        <Users className="h-4 w-4 text-red-700" />
                      )}

                      {/* Время брони */}
                      <span className="text-sm font-medium text-red-700">
                        {r.fromTime
                          ? r.toTime
                            ? `${r.fromTime.slice(0, 5)} — ${r.toTime.slice(0, 5)}`
                            : r.fromTime.slice(0, 5)
                          : "—"}
                      </span>

                      {/* Статус (для больших экранов) */}
                      <span className={cn("h-3 w-3 rounded-full", colorClass)} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </button>

      {/* Модалка создания брони */}
      {createModalOpen && (
        <ReservationCreateModal
          open={createModalOpen}
          setOpen={setCreateModalOpen}
          date={selectedDateISO}
          placeId={place.id}
          placeName={place.name}
          onCreated={() => {
            setCreateModalOpen(false);
            onBookingCreated?.();
          }}
        />
      )}

      {/* Детали броней */}
      {detailModalOpen && isOccupied && (
        <ReserveDetailModal
          reserveIds={reserves.map((r) => r.id)}
          open={detailModalOpen}
          setOpen={setDetailModalOpen}
          date={selectedDateISO}
          placeId={place.id}
          placeName={place.name}
          onBookingDeleted={() => {
            setDetailModalOpen(false);
            onBookingCreated?.();
          }}
        />
      )}
    </>
  );
}
