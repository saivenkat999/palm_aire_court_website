import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
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
import { useStripe } from '@/hooks/use-stripe';
import { useCreateBooking } from '@/hooks/use-api';
import PaymentForm from '@/components/payment-form';
import { z } from 'zod';
import { CalendarDays, Users, MapPin, CreditCard, Check, ChevronRight, Loader2 } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

const bookingFormSchema = z.object({
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  guestEmail: z.string().email('Please enter a valid email address'),
  guestPhone: z.string().min(10, 'Please enter a valid phone number'),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

type BookingStep = 'details' | 'payment' | 'confirmation';

export default function BookingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { createPaymentIntent, stripe } = useStripe();
  const createBookingMutation = useCreateBooking();
  
  // Get booking details from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const unitId = searchParams.get('unitId') || '';
  const unitType = searchParams.get('unitType') || '';
  const unitName = searchParams.get('unitName') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '1');
  const totalCents = parseInt(searchParams.get('total') || '0'); // Convert to cents for Stripe

  // Validate dates
  const checkInDate = checkIn ? parseISO(checkIn) : null;
  const checkOutDate = checkOut ? parseISO(checkOut) : null;
  
  // Check if dates are valid
  const areDatesValid = checkInDate && checkOutDate && isValid(checkInDate) && isValid(checkOutDate);
  
  // Safe date formatting function
  const formatDate = (dateString: string, formatStr: string) => {
    if (!dateString) return 'Select Date';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, formatStr) : 'Invalid Date';
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Redirect if missing required params
  useEffect(() => {
    if (!unitId && !unitType) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a unit to book.",
      });
      setLocation('/stays');
      return;
    }
    
    // Only validate dates if we have the required booking parameters
    if ((unitId || unitType) && (!checkIn || !checkOut)) {
      toast({
        variant: "destructive",
        title: "Missing Dates",
        description: "Please select check-in and check-out dates.",
      });
      setLocation('/stays');
      return;
    }
  }, [unitId, unitType, checkIn, checkOut, setLocation, toast]);

  // Determine if this is a pool booking (unitType provided) or specific unit booking
  const isPoolBooking = !!unitType && !unitId;
  const displayName = isPoolBooking ? 
    (unitType === 'TRAILER' ? 'Any Available Trailer' :
     unitType === 'COTTAGE_1BR' ? 'Any Available 1-Bedroom Cottage' :
     unitType === 'COTTAGE_2BR' ? 'Any Available 2-Bedroom Cottage' :
     unitType === 'RV_SITE' ? 'Any Available RV Site' : 'Any Available Unit') : 
    unitName;

  // State management
  const [currentStep, setCurrentStep] = useState<BookingStep>('details');
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [stripePublishableKey, setStripePublishableKey] = useState<string>('');
  const [actualTotalCents, setActualTotalCents] = useState<number>(totalCents);
  const [loadingPricing, setLoadingPricing] = useState<boolean>(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      specialRequests: '',
    },
  });

  // Fetch pricing for pool bookings
  useEffect(() => {
    if (isPoolBooking && unitType && checkIn && checkOut) {
      setLoadingPricing(true);
      const params = new URLSearchParams({
        unitType,
        checkIn,
        checkOut,
        guests: guests.toString()
      });
      
      fetch(`/api/pricing/type?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          if (data.total) {
            setActualTotalCents(data.total);
          }
        })
        .catch(err => {
          console.error('Failed to fetch pricing:', err);
          toast({
            variant: "destructive",
            title: "Pricing Error",
            description: "Unable to calculate pricing. Please try again.",
          });
        })
        .finally(() => {
          setLoadingPricing(false);
        });
    }
  }, [isPoolBooking, unitType, checkIn, checkOut, guests, toast]);

  // Fetch Stripe config on mount
  useEffect(() => {
    fetch('/api/stripe-config')
      .then(res => res.json())
      .then(data => {
        if (data.publishableKey) {
          setStripePublishableKey(data.publishableKey);
        }
      })
      .catch(err => console.error('Failed to fetch Stripe config:', err));
  }, []);

  // Redirect if missing essential booking data
  useEffect(() => {
    if ((!unitId && !unitType) || !checkIn || !checkOut) {
      toast({
        variant: "destructive",
        title: "Invalid booking data",
        description: "Please start your booking from the unit page.",
      });
      setLocation('/stays');
    }
  }, [unitId, unitType, checkIn, checkOut, setLocation, toast]);

  // Step 1: Handle guest details submission
  const onSubmitDetails = async (data: BookingFormData) => {
    try {
      setBookingData(data);
      
      // Create payment intent
      const paymentData = await createPaymentIntent({
        amount: actualTotalCents,
        customerEmail: data.guestEmail,
        metadata: {
          ...(unitId ? { unitId } : {}),
          ...(unitType ? { unitType } : {}),
          unitName: displayName,
          checkIn,
          checkOut,
          guests: guests.toString(),
          guestName: data.guestName,
          guestPhone: data.guestPhone,
        }
      });

      if (paymentData.clientSecret) {
        setPaymentClientSecret(paymentData.clientSecret);
        setCurrentStep('payment');
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to proceed to payment",
      });
    }
  };
  // Step 2: Handle payment success
  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      if (!bookingData) {
        throw new Error('Missing booking data');
      }

      // Create the booking in the database
      const booking = await createBookingMutation.mutateAsync({
        ...(unitId ? { unitId } : {}),
        ...(unitType ? { unitType } : {}),
        checkIn,
        checkOut,
        guests,
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        guestPhone: bookingData.guestPhone,
        specialRequests: bookingData.specialRequests,
      });

      // Store booking ID for confirmation page
      localStorage.setItem('lastBookingId', booking.id);
      
      setBookingId(booking.id);
      setCurrentStep('confirmation');
      
      toast({
        title: "Payment successful!",
        description: "Your booking has been confirmed.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: error.message || "Please contact support.",
      });
    }
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    toast({
      variant: "destructive",
      title: "Payment failed",
      description: error,
    });
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  // Render different steps
  if (currentStep === 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardContent className="pt-8 space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground">
                Your reservation has been successfully confirmed.
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID:</span>
                <span className="font-mono">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit:</span>
                <span>{displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-in:</span>
                <span>{formatDate(checkIn, 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-out:</span>
                <span>{formatDate(checkOut, 'MMM dd, yyyy')}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total Paid:</span>
                <span className="text-primary">{formatPrice(actualTotalCents)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to {bookingData?.guestEmail}
            </p>
            <Button onClick={() => setLocation('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
        <p className="text-muted-foreground">Secure your stay at Palm Aire Court</p>
      </div>

      {/* Progress Steps */}
    <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
      <div className={`flex items-center ${currentStep === 'details' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep === 'details' ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
            }`}>
              1
            </div>
            <span className="ml-2 font-medium">Guest Details</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          <div className={`flex items-center ${currentStep === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep === 'payment' ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          <div className={`flex items-center ${false ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${false ? 'border-primary bg-primary text-white' : 'border-muted-foreground'}`}>
              3
            </div>
            <span className="ml-2 font-medium">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          {currentStep === 'details' ? (
            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitDetails)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="guestName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} />
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
                              placeholder="Any special requests or notes for your stay..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" size="lg" disabled={loadingPricing}>
                      {loadingPricing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Calculating Price...
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : currentStep === 'payment' && paymentClientSecret && stripePublishableKey ? (
            <PaymentForm
              clientSecret={paymentClientSecret}
              amount={actualTotalCents}
              publishableKey={stripePublishableKey}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Summary Sidebar */}
        <div className="md:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {displayName}
                </h3>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {formatDate(checkIn, 'MMM dd')} - {formatDate(checkOut, 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    {loadingPricing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      formatPrice(actualTotalCents)
                    )}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Includes all taxes and fees
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}