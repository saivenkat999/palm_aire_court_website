import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
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
  const [availableUnits, setAvailableUnits] = useState<any[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookingMode, setBookingMode] = useState<'specific' | 'any'>('specific'); // New state
  const [, setLocation] = useLocation();

  const { data: units = [], isLoading } = useUnits();

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // For now, don't disable any future dates - will implement proper availability calendar later
    return false;
  };

  // Check availability when dates change
  useEffect(() => {
    if (dateRange?.from && dateRange?.to && units.length > 0) {
      setLoadingAvailability(true);
      
      const checkAvailability = async () => {
        try {
          const availabilityPromises = units.map(async (unit) => {
            try {
              const response = await fetch(`/api/availability?unitId=${unit.id}&checkIn=${dateRange.from!.toISOString()}&checkOut=${dateRange.to!.toISOString()}`);
              const availability = await response.json();
              return availability.available ? unit : null;
            } catch (error) {
              console.error(`Error checking availability for unit ${unit.id}:`, error);
              return null;
            }
          });
          
          const results = await Promise.all(availabilityPromises);
          const available = results.filter(unit => unit !== null);
          setAvailableUnits(available);
        } catch (error) {
          console.error('Error checking availability:', error);
          setAvailableUnits([]);
        } finally {
          setLoadingAvailability(false);
        }
      };

      checkAvailability();
    } else {
      setAvailableUnits([]);
      setLoadingAvailability(false);
    }
  }, [dateRange, units]);

  const filteredUnits = useMemo(() => {
    let filtered = dateRange?.from && dateRange?.to ? availableUnits : [...units];

    // Filter by unit type
    if (unitType !== 'all') {
      filtered = filtered.filter(unit => unit.type === unitType);
    }

    // Filter by guest capacity
    if (guestCapacity !== 'any') {
      const capacity = parseInt(guestCapacity);
      filtered = filtered.filter(unit => unit.capacity >= capacity);
    }

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
  }, [units, availableUnits, unitType, guestCapacity, dateRange, sortBy]);

  // Group units by type for "any" booking mode
  const groupedUnits = useMemo(() => {
    if (bookingMode === 'specific') return null;
    
    const groups: Record<string, { type: string; units: any[]; count: number; minPrice: number }> = {};
    
    filteredUnits.forEach(unit => {
      if (!groups[unit.type]) {
        groups[unit.type] = {
          type: unit.type,
          units: [],
          count: 0,
          minPrice: Infinity
        };
      }
      groups[unit.type].units.push(unit);
      groups[unit.type].count++;
      // We'll calculate min price from rate plans later
    });
    
    return Object.values(groups);
  }, [filteredUnits, bookingMode]);

  const displayUnits = bookingMode === 'specific' ? filteredUnits : groupedUnits;

  // Handler for booking any available unit of a specific type
  const handleBookAnyUnit = (unitTypeToBook: string) => {
    if (!dateRange?.from || !dateRange?.to) {
      alert('Please select check-in and check-out dates first');
      return;
    }
    
    // Navigate to booking page with unitType parameter
    const params = new URLSearchParams({
      unitType: unitTypeToBook,
      checkIn: dateRange.from.toISOString(),
      checkOut: dateRange.to.toISOString()
    });
    
    setLocation(`/booking?${params.toString()}`);
  };

  // Loading state
  if (isLoading || loadingAvailability) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading stays...</p>
        </div>
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
          {/* Booking Mode Toggle */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium mb-2 text-blue-900">Booking Preference</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bookingMode"
                  value="specific"
                  checked={bookingMode === 'specific'}
                  onChange={(e) => setBookingMode(e.target.value as 'specific' | 'any')}
                  className="mr-2"
                />
                <span className="text-sm">Book specific unit</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bookingMode"
                  value="any"
                  checked={bookingMode === 'any'}
                  onChange={(e) => setBookingMode(e.target.value as 'specific' | 'any')}
                  className="mr-2"
                />
                <span className="text-sm">Book any available unit of selected type (Admin assigns at check-in)</span>
              </label>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Unit Type</label>
              <Select value={unitType} onValueChange={setUnitType}>
                <SelectTrigger data-testid="unit-type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="TRAILER">Trailers</SelectItem>
                  <SelectItem value="COTTAGE_1BR">Cottages 1BR</SelectItem>
                  <SelectItem value="COTTAGE_2BR">Cottages 2BR</SelectItem>
                  <SelectItem value="RV_SITE">RV Sites</SelectItem>
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
            {bookingMode === 'specific' 
              ? `${filteredUnits.length} unit${filteredUnits.length !== 1 ? 's' : ''} available`
              : `${displayUnits?.length || 0} unit type${(displayUnits?.length || 0) !== 1 ? 's' : ''} available`
            }
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
        {bookingMode === 'specific' ? (
          // Original individual unit display
          filteredUnits.length > 0 ? (
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
          )
        ) : (
          // Grouped unit type display
          displayUnits && displayUnits.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="unit-types-grid">
              {displayUnits.map((group: any) => (
                <div key={group.type} className="bg-white rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img 
                      src={group.units[0]?.photos?.[0] || "https://placehold.co/400x300/EEEAE6/1F2937?text=No+Image"} 
                      alt={`${group.type} example`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">
                      {group.type === 'COTTAGE_1BR' ? '1-Bedroom Cottages' :
                       group.type === 'COTTAGE_2BR' ? '2-Bedroom Cottages' :
                       group.type === 'TRAILER' ? 'Trailers' :
                       group.type === 'RV_SITE' ? 'RV Sites' : group.type}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {group.count} unit{group.count !== 1 ? 's' : ''} available
                      {dateRange?.from && dateRange?.to && ' for your dates'}
                    </p>
                    <button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors"
                      onClick={() => handleBookAnyUnit(group.type)}
                    >
                      Book Any Available Unit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="no-unit-types-message">
              <p className="text-lg text-muted-foreground mb-4">
                No unit types match your current filters.
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your dates or filter criteria.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
