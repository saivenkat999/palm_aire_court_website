import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferredDates: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Parse URL parameters for pre-filled booking information
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const unitId = searchParams.get('unit');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');

  // Create pre-filled message if booking parameters exist
  const prefilledMessage = unitId 
    ? `I'm interested in booking ${unitId} from ${checkIn} to ${checkOut} for ${guests} guest${guests !== '1' ? 's' : ''}. Please provide more information about availability and final pricing.`
    : '';

  const prefilledDates = (checkIn && checkOut) 
    ? `${new Date(checkIn).toLocaleDateString()} - ${new Date(checkOut).toLocaleDateString()}`
    : '';

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: prefilledMessage,
      preferredDates: prefilledDates,
    },
  });

  // Submit form to our server API which handles GoHighLevel integration
    const onSubmit = async (data: ContactFormData) => {
    try {
      // Send data to our server API which will forward to GoHighLevel
      const response = await fetch('/api/contacts/gohighlevel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          preferredDates: data.preferredDates,
          unitId,
          bookingDetails: unitId ? { checkIn, checkOut, guests } : null,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours.",
        });
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "Please try again or contact us directly.",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background py-8" data-testid="contact-success-page">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto text-center" data-testid="success-message">
            <CardContent className="pt-8">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="font-display font-bold text-2xl mb-2">Thank You!</h1>
                <p className="text-muted-foreground">
                  Your message has been sent successfully. We'll get back to you within 24 hours.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  In the meantime, feel free to call us directly at <strong>480-993-8431</strong> 
                  if you have any urgent questions.
                </p>
              </div>
              
              <Button 
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                data-testid="send-another-message"
              >
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8" data-testid="contact-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help with your questions and reservations. 
            Get in touch and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <Card className="mb-8" data-testid="contact-info">
              <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4" data-testid="contact-address">
                  <div className="bg-primary/10 rounded-full p-3">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Visit Us</h3>
                    <p className="text-muted-foreground">
                      9616 N 12th St<br />
                      Phoenix, AZ 85020
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4" data-testid="contact-phone">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-muted-foreground">480-993-8431</p>
                    <p className="text-sm text-muted-foreground">Daily 8:00 AM - 6:00 PM MST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4" data-testid="contact-email">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-muted-foreground">palmairecourt@outlook.com</p>
                    <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4" data-testid="office-hours">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <div className="text-muted-foreground text-sm space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 4:00 PM</p>
                      <p>Sunday: 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card data-testid="location-map">
              <CardContent className="pt-6">
                <div className="aspect-video bg-white rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.8174167891643!2d-112.05879668431856!3d33.64736798068772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b734b2b1b1b1b%3A0x1234567890abcdef!2s9616%20N%2012th%20St%2C%20Phoenix%2C%20AZ%2085020!5e0!3m2!1sen!2sus!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '300px' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Palm Aire Court Location"
                  ></iframe>
                </div>
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground mb-2">9616 N 12th St, Phoenix, AZ 85020</p>
                  <a 
                    href="https://maps.google.com/?q=9616+N+12th+St,+Phoenix,+AZ+85020"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card data-testid="contact-form">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                {unitId && (
                  <p className="text-sm text-muted-foreground">
                    Inquiry about: <strong>{unitId}</strong>
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your full name" 
                                {...field}
                                data-testid="contact-name-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="(555) 123-4567" 
                                {...field}
                                data-testid="contact-phone-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your.email@example.com" 
                              type="email"
                              {...field}
                              data-testid="contact-email-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredDates"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Dates</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Jan 15 - Feb 15, 2024" 
                              {...field}
                              data-testid="contact-dates-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your accommodation needs, questions about our amenities, or any other inquiries..."
                              className="min-h-[120px]"
                              {...field}
                              data-testid="contact-message-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                      data-testid="contact-submit-button"
                    >
                      {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      * Required fields. We typically respond within 24 hours during business days.
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
