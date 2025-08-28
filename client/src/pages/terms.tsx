import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Shield, FileText, Home, CreditCard, Scale } from 'lucide-react';
import { Link } from 'wouter';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-8" data-testid="terms-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-muted-foreground">
            Important information about your stay at Palm Aire Court
          </p>
        </div>

        {/* Last Updated */}
        <Card className="mb-8 bg-muted/50" data-testid="last-updated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Last updated: August 2024</span>
            </div>
          </CardContent>
        </Card>

        {/* Use of Site */}
        <Card className="mb-8" data-testid="use-of-site">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Use of Site
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              By accessing and using the Palm Aire Court website, you agree to be bound by these 
              terms and conditions. The information on this site is provided for general 
              informational purposes about our accommodations and services.
            </p>
            <p>
              You may not use this site for any unlawful purpose or in any way that could 
              damage, disable, or impair the site's functionality. All content, including 
              text, images, and graphics, is protected by copyright and other intellectual 
              property laws.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> This website is for demonstration purposes. 
                In a production environment, complete legal terms would be provided 
                by qualified legal counsel.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Terms */}
        <Card className="mb-8" data-testid="booking-terms">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Booking Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Reservations</h4>
              <p>
                All reservations are subject to availability and confirmation by Palm Aire Court 
                management. Rates displayed are estimates and may vary based on season, length 
                of stay, and availability. Final pricing will be confirmed at booking.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Payment</h4>
              <p>
                Payment is required to secure your reservation. We accept major credit cards, 
                checks, and cash. Monthly and extended stay arrangements may have different 
                payment schedules as agreed upon booking.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Check-in/Check-out</h4>
              <p>
                Standard check-in time is 3:00 PM and check-out is 11:00 AM. Early check-in 
                or late check-out may be available upon request and subject to additional fees.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Policy */}
        <Card className="mb-8" data-testid="cancellation-policy">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Cancellation Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Cancellations made before 10 days of arrival are refundable minus a $25 fee.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Cancellations within 10 days of arrival will be charged one night's stay.</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>All cancellations or changes must be made by phone or in person (no email cancellations).</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>No refunds for early departures.</span>
              </li>
            </ul>
            
            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="text-sm">
                <strong>Contact Information:</strong> For all cancellations or changes, please contact us at 
                480-993-8431 or visit us in person at 9616 N 12th St, Phoenix, AZ 85020. Email cancellations 
                will not be accepted.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* House Rules */}
        <Card className="mb-8" data-testid="house-rules">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              House Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">General Rules</h4>
                <ul className="space-y-1 text-sm">
                  <li>• No pets allowed</li>
                  <li>• No smoking in units or common areas</li>
                  <li>• Quiet hours: 10:00 PM - 7:00 AM</li>
                  <li>• Maximum occupancy as stated per unit</li>
                  <li>• Guests must register at office</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Community Guidelines</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Respect fellow residents and property</li>
                  <li>• Keep common areas clean and tidy</li>
                  <li>• Follow posted speed limits (5 mph)</li>
                  <li>• Properly dispose of waste and recycling</li>
                  <li>• No permanent modifications to units</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liability */}
        <Card className="mb-8" data-testid="liability">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Liability & Responsibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Guest Responsibility</h4>
              <p>
                Guests are responsible for their personal belongings, vehicles, and any 
                damage to the unit or common areas during their stay. Any damages beyond 
                normal wear and tear will be charged to the guest.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Property Liability</h4>
              <p>
                While we maintain our property to high standards, Palm Aire Court is not 
                liable for personal injury, theft, or loss of personal property. We recommend 
                guests maintain appropriate travel and health insurance.
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-yellow-800 text-sm">
                    <strong>Important:</strong> These terms are provided for demonstration purposes. 
                    Actual legal agreements should be prepared by qualified legal professionals 
                    and regularly reviewed for compliance with local, state, and federal laws.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy Link */}
        <Card className="mb-8" data-testid="privacy-policy">
          <CardContent className="pt-6">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Privacy Policy</h4>
              <p className="text-muted-foreground mb-4">
                Your privacy is important to us. Our privacy policy explains how we collect, 
                use, and protect your personal information.
              </p>
              <Link 
                href="/privacy" 
                className="text-primary hover:underline font-medium"
                data-testid="privacy-policy-link"
              >
                View Privacy Policy →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Contact for Questions */}
        <Card className="bg-muted/50" data-testid="contact-questions">
          <CardContent className="pt-6 text-center">
            <h4 className="font-semibold mb-2">Questions About These Terms?</h4>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these terms and conditions, please don't hesitate to contact us.
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Phone:</strong> 480-993-8431
              </p>
              <p className="text-sm">
                <strong>Email:</strong> palmairecourt@outlook.com
              </p>
              <p className="text-sm">
                <strong>Address:</strong> 9616 N 12th St, Phoenix, AZ 85020
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
