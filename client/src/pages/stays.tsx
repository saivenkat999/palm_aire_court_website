import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateRangePicker from '@/components/date-range-picker';
import UnitCard from '@/components/unit-card';
import { useUnits } from '@/hooks/use-api';
import type { DateRange } from 'react-day-picker';

export default function Stays() {
  const [unitType, setUnitType] = useState<string>('all');
  const [guestCapacity, setGuestCapacity] = useState<string>('any');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortBy, setSortBy] = useState<string>('price-low');

  const { data: units = [], isLoading } = useUnits();

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // For now, don't disable any future dates - will implement proper availability calendar later
    return false;
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

    // TODO: Implement date availability filtering with API
    // if (dateRange?.from && dateRange?.to) {
    //   filtered = filtered.filter(unit =>
    //     isDateRangeAvailable(unit.id, dateRange.from!, dateRange.to!, availability)
    //   );
    // }

    // Sort units
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'capacity':
          return b.capacity - a.capacity;
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        case 'price-low':
        case 'price-high':
        default:
          return 0; // Price sorting will be implemented with pricing API
      }
    });

    return filtered;
  }, [units, unitType, guestCapacity, dateRange, sortBy]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
