import type { IRestaurant } from "@/types/reservations.types";
import PlaceCard from "./PlaceCard";

interface Props {
  restaurant: IRestaurant;
  currentDate: string;
  onBookingCreated?: () => void;
}

export default function ReservationCard({ restaurant, currentDate, onBookingCreated }: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-primary-dark text-xl font-semibold">{restaurant.name}</h3>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {restaurant.places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            currentDate={currentDate}
            onBookingCreated={onBookingCreated}
          />
        ))}
      </div>
    </div>
  );
}
