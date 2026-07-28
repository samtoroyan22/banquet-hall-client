import type { IRestaurant } from "@/types/reservations.types";
import { subDays, addDays } from "date-fns";
import { Chevron } from "@/components/ui/chevron";
import ReservationCard from "./ReservationCard";
import { formatDateForInput, parseSliderDate } from "@/lib/utils";

interface Props {
  restaurants: IRestaurant[];
  currentDate: string;
  onDateChange: (newDate: string) => void;
  onBookingCreated?: () => void;
}

export default function ReservationList({
  restaurants,
  currentDate,
  onDateChange,
  onBookingCreated,
}: Props) {
  const handlePrevDate = () => {
    const parsed = parseSliderDate(currentDate);
    if (parsed) {
      const prevDate = subDays(parsed, 1);
      onDateChange(formatDateForInput(prevDate));
    }
  };

  const handleNextDate = () => {
    const parsed = parseSliderDate(currentDate);
    if (parsed) {
      const nextDate = addDays(parsed, 1);
      onDateChange(formatDateForInput(nextDate));
    }
  };

  if (!restaurants.length) {
    return (
      <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-muted-foreground">Рестораны не найдены на выбранную дату.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <Chevron side="left" onClick={handlePrevDate} />

        <div className="mx-4 flex-1 space-y-8">
          {restaurants.map((r) => (
            <ReservationCard
              key={r.id}
              restaurant={r}
              currentDate={currentDate}
              onBookingCreated={onBookingCreated}
            />
          ))}
        </div>

        <Chevron side="right" onClick={handleNextDate} />
      </div>
    </div>
  );
}
