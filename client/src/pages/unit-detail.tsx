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
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.8174167891643!2d-112.05879668431856!3d33.64736798068772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b734b2b1b1b1b%3A0x1234567890abcdef!2s9616%20N%2012th%20St%2C%20Phoenix%2C%20AZ%2085020!5e0!3m2!1sen!2sus!4v1234567890123"
                    width="100%"
                    height="240"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Palm Aire Court Location"
                  ></iframe>
                  <div className="p-3 text-center bg-gray-50">
                    <p className="font-medium text-sm mb-1">9616 N 12th St</p>
                    <p className="text-muted-foreground text-xs">Phoenix, AZ 85020</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Policies</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Unit Features</h4>
                    <ul className="space-y-1 text-sm">
                      {unit.features?.map((feature, index) => (
                        <li key={index} className="text-muted-foreground">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Cancellation Policy</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Cancellations before 10 days: Refundable minus $25 fee</li>
                      <li>• Cancellations within 10 days: One night's stay charge</li>
                      <li>• Must cancel by phone or in person (no email)</li>
                      <li>• No refunds for early departures</li>
                    </ul>
                  </div>
                </div>
                <Link href="/terms" className="text-primary text-sm hover:underline mt-3 block">
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
