import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmountInput(value: string): string {
  let cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) cleaned = parts[0] + "." + parts[1];
  if (/^0\d/.test(cleaned)) cleaned = cleaned.replace(/^0+/, "");
  cleaned = cleaned.slice(0, 16);

  // eslint-disable-next-line prefer-const
  let [intPart, decimalPart] = cleaned.split(".");

  if (decimalPart && decimalPart.length > 2) {
    decimalPart = decimalPart.slice(0, 2);
  }

  const formattedInt = intPart ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "";

  return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;
}

export function sanitizeAmountInput(value: string): string {
  let cleaned = value.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }
  return cleaned;
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits.startsWith("7")) return "+7 ";

  const p = digits.slice(1);
  let formatted = "+7";
  if (p.length > 0) formatted += " (" + p.slice(0, 3);
  if (p.length >= 3) formatted += ")";
  if (p.length > 3) formatted += " " + p.slice(3, 6);
  if (p.length >= 6) formatted += "-" + p.slice(6, 8);
  if (p.length >= 8) formatted += "-" + p.slice(8, 10);
  return formatted;
}

export function getChangedFields<T extends Record<string, string | undefined>>(
  original: T,
  updated: T
): Partial<T> {
  const changes: Partial<T> = {};
  for (const key of Object.keys(updated) as (keyof T)[]) {
    if (updated[key] !== original[key]) {
      changes[key] = updated[key];
    }
  }
  return changes;
}

export function parseDate(str?: string): Date {
  if (!str || typeof str !== "string") return new Date();

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [yyyy, mm, dd] = str.split("-").map(Number);
    return new Date(yyyy, mm - 1, dd);
  }

  if (/^\d{1,2}[.-]\d{1,2}[.-]\d{4}$/.test(str)) {
    const [dd, mm, yyyy] = str.split(/[.-]/).map(Number);
    return new Date(yyyy, mm - 1, dd);
  }

  console.warn("⚠️ parseDate(): неизвестный формат даты:", str);
  return new Date();
}

export const parseDateToISO = (dateStr: string) => {
  const [dd, mm, yyyy] = dateStr.split(".");
  return `${yyyy}-${mm}-${dd}`;
};

export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function formatDateForInput(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export function parseSliderDate(str: string): Date | undefined {
  const [dd, mm, yyyy] = str.split(/[.-]/).map(Number);
  if (!dd || !mm || !yyyy) return undefined;
  const date = new Date(yyyy, mm - 1, dd);
  return isNaN(date.getTime()) ? undefined : date;
}

export function formatDateMask(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
}

export function formatComment(comment?: string): string {
  if (!comment) return "-";

  return comment
    .split(" ")
    .map((word) => {
      if (word.length > 30) {
        return word.match(/.{1,30}/g)?.join("\n") ?? word;
      }
      return word;
    })
    .join(" ");
}
