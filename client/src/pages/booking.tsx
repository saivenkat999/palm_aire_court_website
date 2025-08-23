import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useCreateBooking } from '@/hooks/use-api';
import { z } from 'zod';
import { CalendarDays, Users, MapPin, CreditCard, Check } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const bookingFormSchema = z.object({
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  guestEmail: z.string().email('Please enter a valid email address'),
  guestPhone: z.string().min(10, 'Please enter a valid phone number'),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get booking details from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const unitId = searchParams.get('unitId') || '';
  const unitName = searchParams.get('unitName') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '1');
  const total = parseFloat(searchParams.get('total') || '0');

  const createBookingMutation = useCreateBooking();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      specialRequests: '',
    },
  });

  // Redirect if missing essential booking data
  useEffect(() => {
    if (!unitId || !checkIn || !checkOut || !total) {
      toast({
        variant: "destructive",
        title: "Invalid booking data",
        description: "Please start your booking from the unit page.",
      });
      setLocation('/stays');
    }
  }, [unitId, checkIn, checkOut, total, setLocation, toast]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      const bookingData = {
        unitId,
        checkIn,
        checkOut,
        guests,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        specialRequests: data.specialRequests,
      };

      const result = await createBookingMutation.mutateAsync(bookingData);
      
      setIsSubmitted(true);
      
      toast({
        title: "Booking confirmed!",
        description: "Your reservation has been created successfully.",
      });

      // In a real implementation, this would redirect to payment or confirmation page
      setTimeout(() => {
        setLocation('/');
      }, 3000);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: error.message || "Please try again or contact us directly.",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-muted-foreground mb-6">
                Your reservation has been created successfully. You'll receive a confirmation email shortly.
              </p>
              <Button onClick={() => setLocation('/')}>
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <h3 className="font-semibold">{unitName}</h3>
                    <p className="text-sm text-muted-foreground">Palm Aire Court</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CalendarDays className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {format(parseISO(checkIn), 'MMM d, yyyy')} - {format(parseISO(checkOut), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <p>{guests} guest{guests !== 1 ? 's' : ''}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-xl font-bold">${(total / 100).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Includes all taxes and fees
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Demo Mode</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    This is a demo booking. No payment will be charged.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="guestName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              data-testid="guest-name-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="guestEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john@example.com"
                              type="email"
                              {...field}
                              data-testid="guest-email-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="guestPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(555) 123-4567"
                              {...field}
                              data-testid="guest-phone-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requests (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special requests or accessibility needs..."
                              className="min-h-[80px]"
                              {...field}
                              data-testid="special-requests-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createBookingMutation.isPending}
                      data-testid="confirm-booking-button"
                    >
                      {createBookingMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        'Confirm Booking'
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By confirming this booking, you agree to our terms and conditions.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}