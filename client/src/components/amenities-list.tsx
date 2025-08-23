import { 
  Wifi, Tv, Thermometer, Car, Utensils, Coffee, Sun, Mountain, 
  Plug, Zap, Droplets, Square, Mail, ChefHat, Target, Users, Shirt
} from 'lucide-react';
import amenitiesData from '@/data/amenities.json';
import type { Amenity } from '@/types';

const iconMap = {
  wifi: Wifi,
  tv: Tv,
  thermometer: Thermometer,
  car: Car,
  utensils: Utensils,
  coffee: Coffee,
  sun: Sun,
  mountain: Mountain,
  plug: Plug,
  zap: Zap,
  droplets: Droplets,
  square: Square,
  mail: Mail,
  'chef-hat': ChefHat,
  target: Target,
  users: Users,
  shirt: Shirt,
};

interface AmenitiesListProps {
  amenityIds: string[];
  className?: string;
  showIcons?: boolean;
}

export default function AmenitiesList({ amenityIds, className = "", showIcons = true }: AmenitiesListProps) {
  const amenities = amenitiesData as Amenity[];
  const unitAmenities = amenities.filter(amenity => amenityIds.includes(amenity.id));

  if (unitAmenities.length === 0) return null;

  return (
    <div className={className} data-testid="amenities-list">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {unitAmenities.map((amenity) => {
          const IconComponent = iconMap[amenity.icon as keyof typeof iconMap];
          
          return (
            <div 
              key={amenity.id} 
              className="flex items-center space-x-2"
              data-testid={`amenity-${amenity.id}`}
            >
              {showIcons && IconComponent && (
                <IconComponent className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm">{amenity.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
