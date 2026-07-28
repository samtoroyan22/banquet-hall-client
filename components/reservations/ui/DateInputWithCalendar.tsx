"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { ru } from "date-fns/locale";
import { format, startOfDay, parse, isValid } from "date-fns";
import { formatDateMask, parseSliderDate } from "@/lib/utils";
import { toast } from "sonner";

interface DateInputWithCalendarProps {
  value: string;
  onChange: (value: string) => void;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  allowPast?: boolean;
  disabled?: boolean;
}

export default function DateInputWithCalendar({
  value,
  onChange,
  onDateChange,
  placeholder = "ДД.ММ.ГГГГ",
  className,
  allowPast = false,
  disabled = false,
}: DateInputWithCalendarProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const masked = formatDateMask(e.target.value);
    setInternalValue(masked);
    onChange(masked);

    if (masked.length === 10) {
      const parsed = parse(masked, "dd.MM.yyyy", new Date());

      if (!isValid(parsed) || format(parsed, "dd.MM.yyyy") !== masked) {
        toast.error("Некорректная дата");
        onDateChange?.(undefined);
        return;
      }

      if (!allowPast && startOfDay(parsed) < startOfDay(new Date())) {
        toast.error("Нельзя выбрать прошедшую дату");
        onDateChange?.(undefined);
      } else {
        onDateChange?.(parsed);
      }
    } else {
      onDateChange?.(undefined);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (disabled) return;
    if (!date) return;

    if (!allowPast && startOfDay(date) < startOfDay(new Date())) {
      toast.error("Нельзя выбрать прошедшую дату");
      return;
    }

    const formatted = format(date, "dd.MM.yyyy");
    setInternalValue(formatted);
    onChange(formatted);
    onDateChange?.(date);
    setOpen(false);
  };

  const selectedDate =
    internalValue.length === 10 ? parseSliderDate(internalValue) || undefined : undefined;

  return (
    <div className={`relative ${className || ""}`}>
      <Input
        type="text"
        value={internalValue}
        placeholder={placeholder}
        maxLength={10}
        disabled={disabled}
        className="border-text/20 focus-visible:ring-primary-foreground h-10 w-full rounded-xl pr-10 disabled:cursor-not-allowed disabled:opacity-60"
        onChange={handleInputChange}
        aria-label="Поле ввода даты"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Открыть календарь"
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1"
            disabled={disabled}
            type="button"
          >
            <CalendarDays className="text-primary" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            locale={ru}
            selected={selectedDate}
            onSelect={handleCalendarSelect}
            disabled={
              disabled
                ? () => true
                : !allowPast
                  ? (date) => startOfDay(date) < startOfDay(new Date())
                  : false
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
