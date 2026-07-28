"use client";

import { useState } from "react";
import { Title } from "@/components/ui/title";
import ReservationByDate from "@/components/reservations/by-date/ReservationByDate";
import ReservationByPlace from "@/components/reservations/by-place/ReservationByPlace";
import { CalendarDays, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReservationPage() {
  const [scenario, setScenario] = useState<1 | 2>(1);

  return (
    <section className="mx-12 my-4 md:m-6">
      <Title title="Бронирование" />

      <div className="mt-6 mb-8">
        <div className="relative inline-flex w-full max-w-md items-center overflow-hidden rounded-full bg-gradient-to-r from-slate-100 to-slate-50 shadow-inner ring-1 ring-slate-200">
          {scenario !== null && (
            <div
              className={cn(
                "from-primary to-primary-dark absolute top-0 left-0 h-full w-1/2 rounded-full bg-gradient-to-br transition-transform duration-300 ease-out",
                scenario === 2 && "translate-x-full"
              )}
            />
          )}

          <button
            onClick={() => setScenario(1)}
            className={cn(
              "relative z-10 flex w-1/2 cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300",
              scenario === 1 ? "text-white drop-shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <MapPin className="h-4 w-4" />
            По залу
          </button>

          <button
            onClick={() => setScenario(2)}
            className={cn(
              "relative z-10 flex w-1/2 cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300",
              scenario === 2 ? "text-white drop-shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <CalendarDays className="h-4 w-4" />
            По дате
          </button>
        </div>
      </div>

      <div className="mt-8">
        {scenario === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ReservationByPlace disabled={false} />
          </div>
        )}
        {scenario === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ReservationByDate />
          </div>
        )}
      </div>
    </section>
  );
}
