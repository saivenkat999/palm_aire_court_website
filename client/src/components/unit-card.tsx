import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Unit } from "@/hooks/use-api";

interface UnitCardProps {
  unit: Unit;
}

export default function UnitCard({ unit }: UnitCardProps) {
  const formatUnitType = (type?: string) => {
    if (!type) return '';
    return type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCapacityText = (unit: Unit) => {
    if (unit.type === 'rv-site') {
      return 'Full Hookup';
    }
    return `Sleeps ${unit.capacity} • ${unit.beds || 0} bed${unit.beds !== 1 ? 's' : ''} • ${unit.baths || 0} bath${unit.baths !== 1 ? 's' : ''}`;
  };

  return (
    <div 
      className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      data-testid={`unit-card-${unit.slug}`}
    >
      <img
        src={unit.photos?.[0] || '/placeholder-unit.jpg'}
        alt={`${unit.name} exterior view`}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold" data-testid={`unit-name-${unit.slug}`}>
            {unit.name}
          </h3>
          <span className="text-sm text-muted-foreground" data-testid={`unit-type-${unit.slug}`}>
            {formatUnitType(unit.type)}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3" data-testid={`unit-capacity-${unit.slug}`}>
          {getCapacityText(unit)}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-primary" data-testid={`unit-price-${unit.slug}`}>
            From $45/night
          </span>
          <Link href={`/stays/${unit.slug}`}>
            <Button 
              size="sm"
              data-testid={`view-unit-${unit.slug}`}
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
