"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DateInputWithCalendar from "../ui/DateInputWithCalendar";

interface Props {
  selectedDate: string;
  setIsSearching: (e: boolean) => void;
  setSelectedDate: (date: string) => void;
  loadReservations: (date: string) => void;
  isSearchDisabled: boolean;
}

export default function ReservationForm({
  selectedDate,
  setSelectedDate,
  setIsSearching,
  loadReservations,
  isSearchDisabled,
}: Props) {
  const handleSearch = () => {
    setIsSearching(true);
    loadReservations(selectedDate);
  };

  return (
    <div className="flex items-end gap-4">
      <div className="flex flex-col space-y-2">
        <Label className="text-primary-dark text-sm">Дата *</Label>

        <div className="w-56">
          <DateInputWithCalendar
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="ДД.ММ.ГГГГ"
            allowPast={true}
          />
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="h-10 w-20 rounded-xl"
        disabled={!selectedDate || isSearchDisabled}
      >
        Найти
      </Button>
    </div>
  );
}
