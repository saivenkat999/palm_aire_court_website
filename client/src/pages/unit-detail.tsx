import { useParams, useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Gallery from '@/components/gallery';
import BookingCard from '@/components/booking-card';
import AmenitiesList from '@/components/amenities-list';
import FAQ from '@/components/faq';
import { useUnit } from '@/hooks/use-api';
import { Link } from 'wouter';
import type { Unit, Rate } from '@/types';

export default function UnitDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const slug = params.slug;

  const { data: unit, isLoading, error } = useUnit(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="unit-error">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading unit</h1>
          <Link href="/stays">
            <Button>Back to Stays</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="unit-not-found">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unit not found</h1>
          <Link href="/stays">
            <Button>Back to Stays</Button>
          </Link>
        </div>
      </div>
    );
  }


  const formatUnitType = (type: string) => {
    return type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background py-8" data-testid="unit-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/stays">
          <Button 
            variant="ghost" 
            className="mb-6"
            data-testid="back-to-stays"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stays
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gallery and Details */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            <Gallery
              images={unit.photos}
              alt={unit.name}
              className="grid-cols-2 mb-8"
            />

            {/* Unit Details */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-display font-bold text-3xl mb-2" data-testid="unit-name">
                    {unit.name}
                  </h1>
                  <p className="text-lg text-muted-foreground" data-testid="unit-type">
                    {formatUnitType(unit.type || '')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge variant="outline" data-testid="unit-beds">
                  {unit.beds || 0} Bedroom{unit.beds !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" data-testid="unit-baths">
                  {unit.baths || 0} Bathroom{unit.baths !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" data-testid="unit-capacity">
                  Sleeps {unit.capacity}
                </Badge>
                <Badge variant="destructive" data-testid="unit-no-pets">
                  No Pets
                </Badge>
                <Badge variant="destructive" data-testid="unit-no-smoking">
                  No Smoking
                </Badge>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6" data-testid="unit-description">
                Experience comfort and convenience in this well-appointed accommodation at Palm Aire Court.
              </p>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">Unit Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {unit.amenities?.map((amenity) => (
                    <div key={amenity} className="text-sm text-muted-foreground">
                      • {amenity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
              <FAQ />
            </div>

            {/* Map and Policies */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Location</h3>
                <div className="bg-muted rounded-lg p-6 text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="font-medium mb-2">9616 N 12th St</p>
                  <p className="text-muted-foreground">Phoenix, AZ 85020</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Policies</h3>
                <ul className="space-y-2 text-sm">
                  {unit.features?.map((feature, index) => (
                    <li key={index} className="text-muted-foreground">
                      • {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/terms" className="text-primary text-sm hover:underline">
                  View complete terms & conditions
                </Link>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <BookingCard unit={unit} />
        </div>
      </div>
    </div>
  );
}
