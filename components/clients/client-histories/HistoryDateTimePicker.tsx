"use client";

import DateInputWithCalendar from "@/components/reservations/ui/DateInputWithCalendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
  value: string;
  setValue: (value: string) => void;
}

export default function HistoryDateTimePicker({ setDate, time, setTime, value, setValue }: Props) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-1 flex-col gap-2">
        <Label className="text-primary-dark text-sm">Дата *</Label>
        <DateInputWithCalendar
          value={value}
          onChange={setValue}
          onDateChange={setDate}
          allowPast={true}
          placeholder="ДД.ММ.ГГГГ"
        />
      </div>

      <div className="flex w-24 flex-col gap-2">
        <Label className="text-primary-dark text-sm">Время</Label>
        <Input
          type="time"
          step={60}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-background focus-visible:ring-primary-foreground h-10 appearance-none rounded-xl [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
