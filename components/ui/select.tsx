"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option<T extends string> {
  label: string;
  value: T;
}

interface CustomSelectProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CustomSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = "Выберите значение",
  className,
  disabled = false,
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={cn(
          "flex w-[160px] items-center justify-between rounded-full border px-4 py-2 text-sm transition-colors duration-200",
          "focus-visible:ring-primary-foreground outline-none focus-visible:ring-2",
          disabled
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "hover:bg-muted/40 bg-background cursor-pointer",
          className
        )}
      >
        <span className={cn(!value && "text-muted-foreground")}>
          {options.find((opt) => opt.value === value)?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180",
            disabled && "text-gray-400"
          )}
        />
      </button>

      {open && !disabled && (
        <div className="bg-popover absolute z-10 mt-1 w-full rounded-md border shadow-md">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-md py-2 pl-3 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                value === opt.value && "bg-accent text-accent-foreground"
              )}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check className="h-4 w-10" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
