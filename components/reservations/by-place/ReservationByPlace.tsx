"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import type { IRestaurant, IReserve, IPlace } from "@/types/reservations.types";

import RestaurantSelect from "./RestaurantSelect";
import PlaceSelect from "./PlaceSelect";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

interface Props {
  disabled: boolean;
}

export default function ReservationByPlace({ disabled }: Props) {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<string>("");
  const [data, setData] = useState<IReserve[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (!disabled) loadRestaurants();
  }, [disabled]);

  async function loadRestaurants() {
    try {
      const response = await apiFetch<IRestaurant[]>("/restaurant/");
      setRestaurants(response);
    } catch {
      setError("Не удалось загрузить список ресторанов");
    }
  }

  async function loadReservations(monthDate: Date = currentMonth) {
    if (!selectedPlace) {
      setError("Выберите зал");
      return;
    }

    setError(null);
    setLoading(true);
    setData([]);
    setHasSearched(true);

    const formattedStartDate = format(startOfMonth(monthDate), "yyyy-MM-dd");

    try {
      const response = await apiFetch<IPlace>("/reserve/get-by-place", {
        method: "POST",
        body: JSON.stringify({
          placeId: selectedPlace,
          startDate: formattedStartDate,
        }),
      });

      const busyReserves: IReserve[] = response.reserves || [];

      const daysInMonth = eachDayOfInterval({
        start: startOfMonth(monthDate),
        end: endOfMonth(monthDate),
      });

      const tableData: IReserve[] = [];

      daysInMonth.forEach((date, i) => {
        const reservesForDay = busyReserves.filter(
          (r) => new Date(r.date).toDateString() === date.toDateString()
        );

        if (reservesForDay.length > 0) {
          reservesForDay.forEach((r) => {
            tableData.push({
              id: r.id,
              number: r.number,
              date: format(new Date(r.date), "yyyy-MM-dd"),
              reserveStatus: {
                id: r.reserveStatus.id,
                index: r.reserveStatus.index,
                name: r.reserveStatus.name,
              },
              fromTime: r.fromTime,
              toTime: r.toTime,
            });
          });
        } else {
          tableData.push({
            id: `free-${i}`,
            number: "-",
            date: format(date, "yyyy-MM-dd"),
            reserveStatus: {
              id: "",
              index: -1,
              name: "",
            },
            fromTime: null,
            toTime: null,
          });
        }
      });

      setData(tableData);
    } catch {
      setError("Не удалось загрузить данные о бронированиях");
    } finally {
      setLoading(false);
    }
  }

  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    loadReservations(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    loadReservations(newMonth);
  };

  const currentRestaurant = restaurants.find((r) => r.id === selectedRestaurant);

  return (
    <div className="space-y-6">
      <div className="flex max-w-2xl flex-wrap items-end gap-4">
        <RestaurantSelect
          restaurants={restaurants}
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
          resetPlace={() => setSelectedPlace("")}
          resetData={() => {
            setData([]);
            setHasSearched(false);
          }}
        />

        <PlaceSelect
          currentRestaurant={currentRestaurant}
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
        />

        <div className="flex items-end">
          <Button
            onClick={() => loadReservations(currentMonth)}
            disabled={!selectedPlace || loading}
            className="h-10 w-24 rounded-xl"
          >
            Найти
          </Button>
        </div>
      </div>

      {error && <div className="max-w-2xl rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

      {!loading && !error && data.length > 0 && (
        <div className="max-w-full rounded-xl border border-gray-200 bg-white p-4 shadow-md">
          <CalendarHeader
            currentMonth={currentMonth}
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
          />
          <CalendarGrid
            onRefresh={loadReservations}
            data={data}
            currentMonth={currentMonth}
            placeId={selectedPlace}
            placeName={currentRestaurant?.places.find((p) => p.id === selectedPlace)?.name || ""}
          />
        </div>
      )}

      {!loading && !error && hasSearched && data.length === 0 && selectedPlace && (
        <p className="text-gray-500">Нет данных по выбранному залу</p>
      )}
    </div>
  );
}
