import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DateRangePicker from './date-range-picker';
import { calculatePricing, formatCurrency } from '@/lib/pricing';
import { getUnavailableDates, isValidDateRange } from '@/lib/date';
import { useLocation } from 'wouter';
import availabilityData from '@/data/availability.json';
import type { DateRange } from 'react-day-picker';
import type { Unit, Rate, AvailabilityEntry, PricingBreakdown } from '@/types';

interface BookingCardProps {
  unit: Unit;
  rate: Rate;
}

export default function BookingCard({ unit, rate }: BookingCardProps) {
  const [, setLocation] = useLocation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);

  const availability = availabilityData as AvailabilityEntry[];
  const unavailableDates = getUnavailableDates(availability, unit.id);

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Disable unavailable dates
    return unavailableDates.some(unavailableDate => {
      return unavailableDate.getTime() === date.getTime();
    });
  };

  useEffect(() => {
    if (dateRange?.from && dateRange?.to && isValidDateRange(dateRange.from, dateRange.to)) {
      const calculatedPricing = calculatePricing(rate, dateRange.from, dateRange.to);
      setPricing(calculatedPricing);
    } else {
      setPricing(null);
    }
  }, [dateRange, rate]);

  const handleReservation = () => {
    if (!dateRange?.from || !dateRange?.to || !pricing) return;
    
    setShowQuoteDialog(true);
  };

  const handleContinue = () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    const params = new URLSearchParams({
      unit: unit.id,
      checkIn: dateRange.from.toISOString().split('T')[0],
      checkOut: dateRange.to.toISOString().split('T')[0],
      guests: guests.toString(),
    });
    
    setLocation(`/contact?${params.toString()}`);
  };

  const canReserve = dateRange?.from && dateRange?.to && pricing;

  return (
    <div className="lg:col-span-1">
      <Card className="shadow-lg sticky top-24" data-testid="booking-card">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-2xl font-bold text-primary" data-testid="booking-price">
                {formatCurrency(rate.nightly)}
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
          {pricing && (
            <div className="border-t border-border pt-4 mb-6" data-testid="price-breakdown">
              <div className="flex justify-between items-center mb-2">
                <span>{formatCurrency(pricing.baseRate)} × {pricing.nights} nights</span>
                <span>{formatCurrency(pricing.baseTotal)}</span>
              </div>
              
              {pricing.discountAmount > 0 && (
                <div className="flex justify-between items-center mb-2 text-green-600">
                  <span>{pricing.rateType} discount ({pricing.discountPercent}%)</span>
                  <span>-{formatCurrency(pricing.discountAmount)}</span>
                </div>
              )}
              
              {pricing.cleaningFee > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span>Cleaning fee</span>
                  <span>{formatCurrency(pricing.cleaningFee)}</span>
                </div>
              )}
              
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span data-testid="booking-total">{formatCurrency(pricing.total)}</span>
                </div>
              </div>
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
                      <span>{pricing.nights} nights</span>
                      <span>{formatCurrency(pricing.baseTotal)}</span>
                    </div>
                    
                    {pricing.discountAmount > 0 && (
                      <div className="flex justify-between mb-2 text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(pricing.discountAmount)}</span>
                      </div>
                    )}
                    
                    {pricing.cleaningFee > 0 && (
                      <div className="flex justify-between mb-2">
                        <span>Cleaning fee</span>
                        <span>{formatCurrency(pricing.cleaningFee)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(pricing.total)}</span>
                    </div>
                  </div>
                  
                  <Button onClick={handleContinue} className="w-full" data-testid="continue-booking">
                    Continue (Demo)
                  </Button>
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
