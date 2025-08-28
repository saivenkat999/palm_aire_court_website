import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Check, 
  Loader2, 
  XCircle, 
  Calendar, 
  MapPin, 
  Users, 
  Mail, 
  Phone, 
  CreditCard,
  Download,
  Star,
  Info
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

interface BookingDetails {
  id: string;
  unit: {
    id: string;
    name: string;
    type: string;
    slug: string;
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  checkIn: string;
  checkOut: string;
  totalCents: number;
  status: string;
  createdAt: string;
  notes?: string;
  payment?: {
    id: string;
    status: string;
    provider: string;
  };
}

export default function BookingConfirmation() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    // Check payment status from URL params or local storage
    const searchParams = new URLSearchParams(window.location.search);
    const paymentIntent = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');
    
    // Also check for booking ID in localStorage (set during booking process)
    const bookingId = localStorage.getItem('lastBookingId');

    const verifyBookingAndPayment = async () => {
      try {
        // If we have a payment intent, verify it
        if (paymentIntent) {
          const paymentResponse = await fetch(`/api/payment-intents/${paymentIntent}`);
          const paymentData = await paymentResponse.json();

          if (paymentData.status === 'succeeded') {
            setPaymentVerified(true);
          } else {
            setStatus('error');
            setMessage('Payment verification failed. Please contact support.');
            return;
          }
        }

        // If we have a booking ID, fetch booking details
        if (bookingId) {
          const bookingResponse = await fetch(`/api/bookings/${bookingId}`);
          
          if (bookingResponse.ok) {
            const booking = await bookingResponse.json();
            setBookingDetails(booking);
            setStatus('success');
            setMessage('Your booking has been confirmed successfully!');
            
            // Clear the booking ID from localStorage
            localStorage.removeItem('lastBookingId');
          } else {
            throw new Error('Booking not found');
          }
        } else if (!paymentIntent) {
          // No payment intent or booking ID - invalid confirmation
          setStatus('error');
          setMessage('Invalid confirmation link. Please start your booking again.');
        } else {
          // Payment verified but no booking details
          setStatus('success');
          setMessage('Payment confirmed! Your booking details will be sent via email.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Unable to verify booking status. Please contact support.');
      }
    };

    verifyBookingAndPayment();
  }, []);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getStayDuration = (checkIn: string, checkOut: string) => {
    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn));
    return nights === 1 ? '1 night' : `${nights} nights`;
  };

  const handleDownloadConfirmation = () => {
    // Generate a simple text confirmation that can be downloaded
    if (!bookingDetails) return;
    
    const confirmationText = `
PALM AIRE COURT - BOOKING CONFIRMATION

Confirmation Number: ${bookingDetails.id}
Guest Name: ${bookingDetails.customer.firstName} ${bookingDetails.customer.lastName}
Email: ${bookingDetails.customer.email}
Phone: ${bookingDetails.customer.phone}

ACCOMMODATION DETAILS
Unit: ${bookingDetails.unit.name}
Type: ${bookingDetails.unit.type}
Check-in: ${format(parseISO(bookingDetails.checkIn), 'EEEE, MMMM dd, yyyy')}
Check-out: ${format(parseISO(bookingDetails.checkOut), 'EEEE, MMMM dd, yyyy')}
Duration: ${getStayDuration(bookingDetails.checkIn, bookingDetails.checkOut)}

PAYMENT INFORMATION
Total Amount: ${formatPrice(bookingDetails.totalCents)}
Payment Status: ${paymentVerified ? 'CONFIRMED' : 'PENDING'}
Booking Date: ${format(parseISO(bookingDetails.createdAt), 'MMMM dd, yyyy')}

${bookingDetails.notes ? `Special Requests: ${bookingDetails.notes}` : ''}

Thank you for choosing Palm Aire Court!
    `.trim();

    const blob = new Blob([confirmationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PalmAire-Booking-${bookingDetails.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {status === 'loading' && (
        <Card className="text-center">
          <CardContent className="pt-8 space-y-6">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Verifying your booking and payment...</p>
          </CardContent>
        </Card>
      )}

      {status === 'error' && (
        <Card className="text-center">
          <CardContent className="pt-8 space-y-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h2>
              <p className="text-muted-foreground">{message}</p>
            </div>
            <div className="space-y-2">
              <Button onClick={() => setLocation('/contact')} className="w-full">
                Contact Support
              </Button>
              <Button onClick={() => setLocation('/')} variant="outline" className="w-full">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {status === 'success' && (
        <div className="space-y-6">
          {/* Success Header */}
          <Card className="text-center bg-green-50 border-green-200">
            <CardContent className="pt-8 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 text-green-800">Booking Confirmed!</h1>
                <p className="text-green-700 text-lg">{message}</p>
                {paymentVerified && (
                  <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Payment Verified
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          {bookingDetails && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Reservation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Reservation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confirmation #:</span>
                      <span className="font-mono font-medium">{bookingDetails.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unit:</span>
                      <span className="font-medium">{bookingDetails.unit.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{bookingDetails.unit.type.replace('_', ' ').toLowerCase()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in:</span>
                      <span className="font-medium">{format(parseISO(bookingDetails.checkIn), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out:</span>
                      <span className="font-medium">{format(parseISO(bookingDetails.checkOut), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{getStayDuration(bookingDetails.checkIn, bookingDetails.checkOut)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Amount:</span>
                      <span className="text-xl font-bold text-primary">{formatPrice(bookingDetails.totalCents)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guest Name:</span>
                      <span className="font-medium">{bookingDetails.customer.firstName} {bookingDetails.customer.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {bookingDetails.customer.email}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {bookingDetails.customer.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booking Date:</span>
                      <span className="font-medium">{format(parseISO(bookingDetails.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    {bookingDetails.notes && (
                      <>
                        <Separator />
                        <div>
                          <span className="text-muted-foreground block mb-1">Special Requests:</span>
                          <span className="text-sm">{bookingDetails.notes}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Important Information */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Important Information:</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Check-in time is 3:00 PM, check-out is 11:00 AM</li>
                  <li>• A confirmation email has been sent to your email address</li>
                  <li>• Please bring a valid ID for check-in</li>
                  <li>• Cancellations made before 10 days of arrival are refundable minus a $25 fee</li>
                  <li>• Cancellations within 10 days of arrival will be charged one night's stay</li>
                  <li>• All cancellations or changes must be made by phone or in person (no email cancellations)</li>
                  <li>• No refunds for early departures</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {bookingDetails && (
              <Button onClick={handleDownloadConfirmation} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Confirmation
              </Button>
            )}
            <Button onClick={() => setLocation('/stays')} variant="outline" className="flex-1">
              Browse More Units
            </Button>
            <Button onClick={() => setLocation('/')} className="flex-1">
              Return to Home
            </Button>
          </div>

          {/* Contact and Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <p className="text-sm text-muted-foreground mb-1">Phone: (555) 123-4567</p>
                  <p className="text-sm text-muted-foreground mb-1">Email: info@palmaircourt.com</p>
                  <p className="text-sm text-muted-foreground">Hours: 8:00 AM - 8:00 PM daily</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <p className="text-sm text-muted-foreground mb-1">Palm Aire Court</p>
                  <p className="text-sm text-muted-foreground mb-1">123 Desert View Drive</p>
                  <p className="text-sm text-muted-foreground">Arizona, USA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}