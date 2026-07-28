import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/select";
import type { IRestaurant } from "@/types/reservations.types";

interface Props {
  restaurants: IRestaurant[];
  selectedRestaurant: string;
  setSelectedRestaurant: (value: string) => void;
  resetPlace: () => void;
  resetData: () => void;
}

export default function RestaurantSelect({
  restaurants,
  selectedRestaurant,
  setSelectedRestaurant,
  resetPlace,
  resetData,
}: Props) {
  return (
    <div className="flex flex-col space-y-2">
      <Label className="text-primary-dark text-sm">Ресторан *</Label>
      <CustomSelect
        value={selectedRestaurant}
        onChange={(value) => {
          setSelectedRestaurant(value);
          resetPlace();
          resetData();
        }}
        options={restaurants.map((r) => ({
          value: r.id,
          label: r.name,
        }))}
        placeholder="Выберите ресторан"
        className="h-10 w-[250px]"
      />
    </div>
  );
}
