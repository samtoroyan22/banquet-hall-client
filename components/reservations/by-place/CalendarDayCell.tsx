"use client";

import { format, isToday as dateFnsIsToday, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import type { IReserve } from "@/types/reservations.types";

interface Props {
  day: Date;
  reserves: IReserve[];
  isCurrentMonth: boolean;
  onClick?: () => void;
}

export default function CalendarDayCell({ day, reserves, isCurrentMonth, onClick }: Props) {
  const isBusy = reserves.some((r) => r.number && r.number !== "-");
  const isToday = dateFnsIsToday(day);
  const isPast = isBefore(day, new Date()) && !isToday;

  const bgClasses = isBusy
    ? "border-red-300 bg-red-100/70 text-red-700"
    : isPast
      ? "border-gray-300 bg-gray-100 text-gray-600"
      : "border-green-300 bg-green-100 text-green-700";

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex h-24 flex-col justify-between rounded-md p-2 text-base transition-all",
        bgClasses,
        !isCurrentMonth && "border-gray-200 bg-white text-gray-400 opacity-40",
        isToday && "border-4 p-1",
        onClick ? "cursor-pointer hover:shadow-md" : "cursor-default"
      )}
    >
      <div className="flex justify-between text-base font-medium md:text-sm">
        <span className="md:text-[12px]">{format(day, "d")}</span>
        {isBusy && isCurrentMonth && (
          <span className="font-semibold md:text-[12px]">
            {reserves.length} {reserves.length === 1 ? "бронь" : "брони"}
          </span>
        )}
      </div>

      {isCurrentMonth && (
        <div className="mt-auto flex flex-col gap-1 text-base md:text-[12px]">
          {isBusy ? (
            reserves.map((r) => {
              const colorClass =
                r.reserveStatus?.index === 1
                  ? "bg-blue-500"
                  : r.reserveStatus?.index === 2
                    ? "bg-yellow-500"
                    : "bg-green-500";

              return (
                <div key={r.id} className="flex items-center justify-between rounded-md">
                  <span className="text-[13px] font-medium text-red-700 md:text-[10px]">
                    {r.fromTime?.slice(0, 5)}
                    {r.toTime ? "–" + r.toTime.slice(0, 5) : ""}
                  </span>

                  <span className={cn("h-2.5 w-2.5 rounded-full", colorClass)} />
                </div>
              );
            })
          ) : (
            <span className={isPast ? "text-gray-500" : "text-green-600"}>Свободно</span>
          )}
        </div>
      )}
    </div>
  );
}
