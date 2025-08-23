import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DateRangePicker from './date-range-picker';
import { formatCurrency } from '@/lib/pricing';
import { useLocation } from 'wouter';
import { usePricing, useAvailability, Unit } from '@/hooks/use-api';
import type { DateRange } from 'react-day-picker';

interface BookingCardProps {
  unit: Unit;
}

export default function BookingCard({ unit }: BookingCardProps) {
  const [, setLocation] = useLocation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);

  const checkIn = dateRange?.from ? dateRange.from.toISOString().split('T')[0] : '';
  const checkOut = dateRange?.to ? dateRange.to.toISOString().split('T')[0] : '';

  const { data: pricing, isLoading: pricingLoading } = usePricing(unit.id, checkIn, checkOut, guests);
  const { data: availability } = useAvailability(unit.id, checkIn, checkOut);

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // For now, don't disable any future dates - will implement proper availability calendar later
    return false;
  };

  // Pricing is now handled by the API hook

  const handleReservation = () => {
    if (!dateRange?.from || !dateRange?.to || !pricing) return;
    
    setShowQuoteDialog(true);
  };

  const handleContinue = () => {
    if (!dateRange?.from || !dateRange?.to || !pricing) return;
    
    const params = new URLSearchParams({
      unitId: unit.id,
      unitName: unit.name,
      checkIn: dateRange.from.toISOString().split('T')[0],
      checkOut: dateRange.to.toISOString().split('T')[0],
      guests: guests.toString(),
      total: pricing.total.toString(),
    });
    
    setLocation(`/booking?${params.toString()}`);
  };

  const canReserve = dateRange?.from && dateRange?.to && pricing;

  return (
    <div className="lg:col-span-1">
      <Card className="shadow-lg sticky top-24" data-testid="booking-card">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-2xl font-bold text-primary" data-testid="booking-price">
                From $45
              </span>
              <span className="text-muted-foreground">per night</span>
            </div>
            <p className="text-sm text-muted-foreground">Best rate available</p>
          </div>

          {/* Date Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Check-in / Check-out</label>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              disabled={isDateDisabled}
              placeholder="Select dates"
              className="w-full"
            />
          </div>

          {/* Guests */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Guests</label>
            <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
              <SelectTrigger data-testid="guests-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: unit.capacity }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} guest{num !== 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Breakdown */}
          {pricingLoading && checkIn && checkOut && (
            <div className="border-t border-border pt-4 mb-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          )}
          
          {pricing && (
            <div className="border-t border-border pt-4 mb-6" data-testid="price-breakdown">
              <div className="flex justify-between items-center mb-2">
                <span>${(pricing.pricePerNight / 100).toFixed(2)} × {pricing.totalNights} nights</span>
                <span>${(pricing.subtotal / 100).toFixed(2)}</span>
              </div>
              
              {pricing.seasonalDiscount > 0 && (
                <div className="flex justify-between items-center mb-2 text-green-600">
                  <span>Seasonal discount ({pricing.discountPercentage}%)</span>
                  <span>-${(pricing.seasonalDiscount / 100).toFixed(2)}</span>
                </div>
              )}
              
              {pricing.fees.map((fee) => (
                <div key={fee.name} className="flex justify-between items-center mb-2">
                  <span>{fee.name}</span>
                  <span>${(fee.amount / 100).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span data-testid="booking-total">${(pricing.total / 100).toFixed(2)}</span>
                </div>
              </div>
              
              {availability && !availability.available && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  These dates are not available
                </div>
              )}
            </div>
          )}

          {/* Reserve Button */}
          <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
            <DialogTrigger asChild>
              <Button
                className="w-full"
                disabled={!canReserve}
                onClick={handleReservation}
                data-testid="reserve-button"
              >
                Reserve
              </Button>
            </DialogTrigger>
            
            <DialogContent data-testid="quote-dialog">
              <DialogHeader>
                <DialogTitle>Booking Summary</DialogTitle>
              </DialogHeader>
              
              {pricing && dateRange?.from && dateRange?.to && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">{unit.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {guests} guest{guests !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>{pricing.totalNights} nights</span>
                      <span>${(pricing.subtotal / 100).toFixed(2)}</span>
                    </div>
                    
                    {pricing.seasonalDiscount > 0 && (
                      <div className="flex justify-between mb-2 text-green-600">
                        <span>Discount</span>
                        <span>-${(pricing.seasonalDiscount / 100).toFixed(2)}</span>
                      </div>
                    )}
                    
                    {pricing.fees.map((fee) => (
                      <div key={fee.name} className="flex justify-between mb-2">
                        <span>{fee.name}</span>
                        <span>${(fee.amount / 100).toFixed(2)}</span>
                      </div>
                    ))}
                    
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${(pricing.total / 100).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {availability?.available ? (
                    <Button onClick={handleContinue} className="w-full" data-testid="continue-booking">
                      Book Now
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      Dates Not Available
                    </Button>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          {!canReserve && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Select dates to enable booking
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
