import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import unitsData from "@/data/units.json";
import ratesData from "@/data/rates.json";
import { getRateDisplay } from "@/lib/pricing";
import type { Unit, Rate } from "@/types";

export default function FeaturedStays() {
  const units = unitsData as Unit[];
  const rates = ratesData as Rate[];
  
  // Get first 3 units as featured
  const featuredUnits = units.slice(0, 3);

  const getRateForUnit = (unit: Unit): Rate | undefined => {
    return rates.find(rate => rate.category === unit.rateCategory);
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Featured Accommodations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our variety of comfortable units, each designed for your perfect desert getaway
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {featuredUnits.map((unit) => {
            const rate = getRateForUnit(unit);
            return (
              <div
                key={unit.id}
                className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                data-testid={`featured-unit-${unit.slug}`}
              >
                <img
                  src={unit.images[0]}
                  alt={`${unit.name} - ${unit.type} accommodation`}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg" data-testid={`unit-name-${unit.slug}`}>
                        {unit.name}
                      </h3>
                      <p className="text-muted-foreground" data-testid={`unit-type-${unit.slug}`}>
                        {unit.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                    <Badge variant="secondary" data-testid={`unit-capacity-${unit.slug}`}>
                      Sleeps {unit.capacity}
                    </Badge>
                  </div>
                  
                  <p className="text-2xl font-bold text-primary mb-4" data-testid={`unit-price-${unit.slug}`}>
                    From {rate ? getRateDisplay(rate) : '$--'}/night
                  </p>
                  
                  <Link href={`/stays/${unit.slug}`}>
                    <Button 
                      className="w-full" 
                      data-testid={`view-unit-${unit.slug}`}
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
