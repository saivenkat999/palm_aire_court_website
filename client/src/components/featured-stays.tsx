import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUnits } from "@/hooks/use-api";

export default function FeaturedStays() {
  const { data: units = [], isLoading } = useUnits();
  
  // Get first 3 active units as featured
  const featuredUnits = units.filter(unit => unit.active).slice(0, 3);

  const getLowestPrice = (unit: any) => {
    // Get nightly rates from rate plans
    const nightlyRates = unit.ratePlans
      ?.filter((plan: any) => plan.nightly && plan.nightly > 0)
      .map((plan: any) => plan.nightly);
    
    if (!nightlyRates || nightlyRates.length === 0) {
      return 'Contact for pricing';
    }
    
    const lowestRate = Math.min(...nightlyRates);
    // Convert from cents to dollars
    const priceInDollars = (lowestRate / 100).toFixed(0);
    return `$${priceInDollars}`;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading featured stays...</p>
          </div>
        </div>
      </section>
    );
  }

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
          {featuredUnits.map((unit) => (
            <div
              key={unit.id}
              className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              data-testid={`featured-unit-${unit.slug}`}
            >
              <img
                src={unit.photos?.[0] || '/assets/cottage/exterior.webp'}
                alt={`${unit.name} - accommodation`}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg" data-testid={`unit-name-${unit.slug}`}>
                      {unit.name}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`unit-type-${unit.slug}`}>
                      {unit.type === 'COTTAGE_1BR' ? 'Cottage 1br' :
                       unit.type === 'COTTAGE_2BR' ? 'Cottage 2br' :
                       unit.type === 'TRAILER' ? 'Trailer' :
                       unit.type === 'RV_SITE' ? 'RV Site' : unit.type}
                    </p>
                  </div>
                  <Badge variant="secondary" data-testid={`unit-capacity-${unit.slug}`}>
                    Sleeps {unit.capacity}
                  </Badge>
                </div>
                
                <p className="text-2xl font-bold text-primary mb-4" data-testid={`unit-price-${unit.slug}`}>
                  From {getLowestPrice(unit)}/night
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
          ))}
        </div>
      </div>
    </section>
  );
}
