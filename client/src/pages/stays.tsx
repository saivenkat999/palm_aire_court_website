import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateRangePicker from '@/components/date-range-picker';
import UnitCard from '@/components/unit-card';
import { isDateRangeAvailable, getUnavailableDates } from '@/lib/date';
import unitsData from '@/data/units.json';
import ratesData from '@/data/rates.json';
import availabilityData from '@/data/availability.json';
import type { DateRange } from 'react-day-picker';
import type { Unit, Rate, AvailabilityEntry } from '@/types';

export default function Stays() {
  const [unitType, setUnitType] = useState<string>('all');
  const [guestCapacity, setGuestCapacity] = useState<string>('any');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortBy, setSortBy] = useState<string>('price-low');

  const units = unitsData as Unit[];
  const rates = ratesData as Rate[];
  const availability = availabilityData as AvailabilityEntry[];
  
  const unavailableDates = getUnavailableDates(availability);

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    return unavailableDates.some(unavailableDate => {
      return unavailableDate.getTime() === date.getTime();
    });
  };

  const filteredUnits = useMemo(() => {
    let filtered = [...units];

    // Filter by unit type
    if (unitType !== 'all') {
      filtered = filtered.filter(unit => unit.type === unitType);
    }

    // Filter by guest capacity
    if (guestCapacity !== 'any') {
      const capacity = parseInt(guestCapacity);
      filtered = filtered.filter(unit => unit.capacity >= capacity);
    }

    // Filter by date availability
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(unit =>
        isDateRangeAvailable(unit.id, dateRange.from!, dateRange.to!, availability)
      );
    }

    // Sort units
    filtered.sort((a, b) => {
      const rateA = rates.find(r => r.category === a.rateCategory);
      const rateB = rates.find(r => r.category === b.rateCategory);

      switch (sortBy) {
        case 'price-low':
          return (rateA?.nightly || 0) - (rateB?.nightly || 0);
        case 'price-high':
          return (rateB?.nightly || 0) - (rateA?.nightly || 0);
        case 'capacity':
          return b.capacity - a.capacity;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [units, rates, availability, unitType, guestCapacity, dateRange, sortBy]);

  const getRateForUnit = (unit: Unit): Rate | undefined => {
    return rates.find(rate => rate.category === unit.rateCategory);
  };

  return (
    <div className="min-h-screen bg-background py-8" data-testid="stays-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse our comfortable accommodations in the heart of Phoenix
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 mb-8" data-testid="filter-bar">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Unit Type</label>
              <Select value={unitType} onValueChange={setUnitType}>
                <SelectTrigger data-testid="unit-type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="trailer">Trailers</SelectItem>
                  <SelectItem value="cottage-1br">Cottages 1BR</SelectItem>
                  <SelectItem value="cottage-2br">Cottages 2BR</SelectItem>
                  <SelectItem value="rv-site">RV Sites</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Guests</label>
              <Select value={guestCapacity} onValueChange={setGuestCapacity}>
                <SelectTrigger data-testid="guests-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="2">1-2 guests</SelectItem>
                  <SelectItem value="4">3-4 guests</SelectItem>
                  <SelectItem value="6">5-6 guests</SelectItem>
                  <SelectItem value="8">7-8 guests</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Dates</label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                disabled={isDateDisabled}
                placeholder="Select check-in and check-out dates"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold" data-testid="results-count">
            {filteredUnits.length} unit{filteredUnits.length !== 1 ? 's' : ''} available
            {dateRange?.from && dateRange?.to && ' for your dates'}
          </h2>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48" data-testid="sort-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price (low to high)</SelectItem>
              <SelectItem value="price-high">Price (high to low)</SelectItem>
              <SelectItem value="capacity">Capacity</SelectItem>
              <SelectItem value="type">Unit Type</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Units Grid */}
        {filteredUnits.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="units-grid">
            {filteredUnits.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                rate={getRateForUnit(unit)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12" data-testid="no-units-message">
            <p className="text-lg text-muted-foreground mb-4">
              No units match your current filters.
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your dates or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
