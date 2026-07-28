import type { ElementType } from "react";

export function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
        <Icon className="text-primary h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-primary-dark text-xs tracking-wide uppercase">{label}</p>
        <p className="text-primary-dark mt-0.5 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
