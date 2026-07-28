"use client";

import { useState } from "react";
import ReservationList from "@/components/reservations/by-date/ReservationList";
import { apiFetch } from "@/lib/api";
import type { IReservationResponse } from "@/types/reservations.types";
import ReservationForm from "./ReservationForm";

export default function ReservationByDate() {
  const [data, setData] = useState<IReservationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [lastSearchedDate, setLastSearchedDate] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  async function loadReservations(date: string) {
    if (!date) {
      setError("Выберите дату");
      return;
    }

    const [dd, mm, yyyy] = date.split(/[.-]/).map(Number);
    const apiDate = `${yyyy}-${mm.toString().padStart(2, "0")}-${dd.toString().padStart(2, "0")}`;

    setError(null);
    setData(null);
    setLoading(true);

    try {
      const response = await apiFetch<IReservationResponse>("/reserve/get-by-date", {
        method: "POST",
        body: JSON.stringify({ date: apiDate }),
      });

      setData(response);
      setLastSearchedDate(date);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }

  const displayDate = selectedDate || lastSearchedDate;

  return (
    <div>
      <ReservationForm
        selectedDate={selectedDate}
        setIsSearching={setIsSearching}
        setSelectedDate={setSelectedDate}
        loadReservations={loadReservations}
        isSearchDisabled={
          !!selectedDate && selectedDate === lastSearchedDate && data !== null && !error && !loading
        }
      />

      <div className="mt-8">
        {loading && <p>Загрузка доступных залов...</p>}
        {error && <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>}
        {!loading && !error && data && isSearching && (
          <ReservationList
            restaurants={data.restaurants}
            currentDate={displayDate}
            onDateChange={(newDate) => {
              setSelectedDate(newDate);
              loadReservations(newDate);
            }}
            onBookingCreated={() => loadReservations(displayDate)}
          />
        )}
      </div>
    </div>
  );
}
