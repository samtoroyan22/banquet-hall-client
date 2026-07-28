import { z } from "zod";
import { parseSliderDate } from "@/lib/utils";

const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const innRegex = /^\d{10}$/;
const ogrnRegex = /^\d{13}$/;

// Базовая схема для всех клиентов
export const baseClientSchema = z.object({
  contactEmail: z.string().regex(emailRegex, "Введите корректный email").or(z.literal("")),
  actualAddress: z.string().optional().or(z.literal("")),
});

// Схема для физических лиц
export const physicalClientSchema = baseClientSchema.extend({
  name: z.string().min(2, "Введите корректное ФИО"),
  contactPhone: z.string().regex(phoneRegex, "Введите телефон в формате +7 (XXX) XXX-XX-XX"),

  passportSerial: z
    .string()
    .regex(/^\d{0,4}$/, "Серия паспорта должна содержать до 4 цифр")
    .optional()
    .or(z.literal("")),
  passportNumber: z
    .string()
    .regex(/^\d{0,6}$/, "Номер паспорта должен содержать до 6 цифр")
    .optional()
    .or(z.literal("")),
  passportDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || (val.length === 10 && parseSliderDate(val) !== null),
      "Неверный формат даты (ДД.MM.ГГГГ)"
    ),
  passportSubdivision: z.string().optional().or(z.literal("")),
});

// Схема для юридических лиц
export const legalClientSchema = baseClientSchema.extend({
  name: z.string().min(2, "Введите название организации"),
  contactPhone: z
    .string()
    .regex(phoneRegex, "Введите телефон в формате +7 (XXX) XXX-XX-XX")
    .or(z.literal("")),
  contactName: z.string().min(2, "Введите контактное лицо"),
  legalAddress: z.string().optional().or(z.literal("")),
  inn: z.string().regex(innRegex, "ИНН должен содержать 10 цифр").min(10).max(10),
  ogrn: z.string().regex(ogrnRegex, "ОГРН должен содержать 13 цифр").optional().or(z.literal("")),
});

// --- Схема для контакта клиента ---
export const clientContactSchema = z.object({
  name: z.string().min(2, "Введите имя контакта"),
  position: z.string().optional().or(z.literal("Введите должность")),
  email: z.string().regex(emailRegex, "Введите корректный email").optional().or(z.literal("")),
  phone: z.string().regex(phoneRegex, "Введите телефон в формате +7 (XXX) XXX-XX-XX"),
});

export type PhysicalClientData = z.infer<typeof physicalClientSchema>;
export type LegalClientData = z.infer<typeof legalClientSchema>;
export type ClientContactData = z.infer<typeof clientContactSchema>;
