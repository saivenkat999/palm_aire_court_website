import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CalendarBooking {
  id: string;
  checkIn: string;
  checkOut: string;
  unit: { id: string; name: string };
  customer: { firstName: string; lastName: string };
}

export default function AdminCalendar() {
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!localStorage.getItem('admin_auth')) {
      window.location.href = '/admin/login';
      return;
    }

    fetchCalendarData();
  }, [currentDate]);

  const fetchCalendarData = async () => {
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const response = await fetch(`/api/admin/bookings/calendar?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      return date >= checkIn && date < checkOut;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading calendar...</div>;
  }

  const days = getDaysInMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Booking Calendar</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={() => window.location.href = '/admin/dashboard'} variant="outline">
              Dashboard
            </Button>
            <Button onClick={previousMonth} variant="outline">Previous</Button>
            <h2 className="text-xl font-semibold">{monthName}</h2>
            <Button onClick={nextMonth} variant="outline">Next</Button>
            <Button onClick={() => { localStorage.removeItem('admin_auth'); window.location.href = '/admin/login'; }} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center font-semibold text-gray-500">
                  {day}
                </div>
              ))}
              
              {days.map((day, index) => (
                <div key={index} className="min-h-[120px] border rounded p-2">
                  {day && (
                    <>
                      <div className="font-semibold text-sm mb-2">
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {getBookingsForDate(day).map(booking => (
                          <Badge
                            key={booking.id}
                            variant="secondary"
                            className="text-xs block truncate"
                            title={`${booking.unit.name} - ${booking.customer.firstName} ${booking.customer.lastName}`}
                          >
                            {booking.unit.name}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
