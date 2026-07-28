"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  label: string;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: UseFormRegister<T>;
  name?: Path<T>;
  type?: string;
  disabled?: boolean;
}

export default function FormField<T extends FieldValues>({
  label,
  placeholder,
  error,
  value,
  onChange,
  register,
  name,
  type = "text",
  disabled = false,
}: FormFieldProps<T>) {
  return (
    <div className="space-y-2">
      <Label className="text-primary-dark text-sm">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        {...(register && name ? register(name) : {})}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border-text/20 focus-visible:ring-primary-foreground h-10 rounded-xl ${
          error ? "border-red-500 focus-visible:border-red-500" : ""
        }`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
