import { Chevron } from "@/components/ui/chevron";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Props {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

export default function CalendarHeader({ currentMonth, onPrev, onNext }: Props) {
  const formattedMonth = format(currentMonth, "LLLL yyyy", { locale: ru });
  const title = formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);

  return (
    <div className="mb-4 flex items-center justify-between">
      <Chevron side="left" onClick={onPrev} />

      <h2 className="text-primary-dark text-lg font-semibold">{title}</h2>

      <Chevron side="right" onClick={onNext} />
    </div>
  );
}
