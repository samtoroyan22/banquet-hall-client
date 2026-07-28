import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  side: string;
  onClick: () => void;
}

export function Chevron({ side, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300"
      aria-label="Следующий месяц"
    >
      {side === "left" ? (
        <ChevronLeft className="text-text h-8 w-8" />
      ) : (
        <ChevronRight className="text-text h-8 w-8" />
      )}
    </button>
  );
}
