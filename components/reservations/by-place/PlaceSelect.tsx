import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/select";
import type { IRestaurant } from "@/types/reservations.types";

interface Props {
  currentRestaurant?: IRestaurant;
  selectedPlace: string;
  setSelectedPlace: (value: string) => void;
}

export default function PlaceSelect({ currentRestaurant, selectedPlace, setSelectedPlace }: Props) {
  return (
    <div className="flex flex-col space-y-2">
      <Label className="text-primary-dark text-sm">Зал *</Label>
      <CustomSelect
        value={selectedPlace}
        onChange={setSelectedPlace}
        disabled={!currentRestaurant}
        options={
          currentRestaurant
            ? currentRestaurant.places.map((p) => ({
                value: p.id,
                label: p.name,
              }))
            : []
        }
        placeholder="Выберите зал"
        className="h-10 w-[200px]"
      />
    </div>
  );
}
