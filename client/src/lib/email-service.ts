// Email service simulation for booking confirmations
// In a real implementation, this would integrate with services like SendGrid, Mailgun, or AWS SES

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface BookingConfirmationData {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  unitName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  specialRequests?: string;
}

export class EmailService {
  static async sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
    try {
      const emailTemplate = this.generateBookingConfirmationEmail(data);
      
      // In development, log the email to console
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Booking Confirmation Email (Development Mode)');
        console.log('=====================================');
        console.log(`To: ${emailTemplate.to}`);
        console.log(`Subject: ${emailTemplate.subject}`);
        console.log('Text Content:');
        console.log(emailTemplate.text);
        console.log('=====================================');
        
        // Store in localStorage for demo purposes
        const emails = JSON.parse(localStorage.getItem('demoEmails') || '[]');
        emails.push({
          ...emailTemplate,
          timestamp: new Date().toISOString(),
          type: 'booking_confirmation'
        });
        localStorage.setItem('demoEmails', JSON.stringify(emails));
        
        return true;
      }

      // TODO: In production, integrate with actual email service
      // Example with SendGrid:
      // const response = await fetch('/api/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(emailTemplate)
      // });
      // return response.ok;

      return true;
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      return false;
    }
  }

  private static generateBookingConfirmationEmail(data: BookingConfirmationData): EmailTemplate {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatPrice = (cents: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(cents / 100);
    };

    const subject = `Booking Confirmed - Palm Aire Court Reservation #${data.bookingId}`;

    const text = `
Dear ${data.guestName},

Thank you for choosing Palm Aire Court! We're excited to confirm your reservation.

BOOKING DETAILS
Confirmation Number: ${data.bookingId}
Unit: ${data.unitName}
Check-in: ${formatDate(data.checkIn)} at 3:00 PM
Check-out: ${formatDate(data.checkOut)} at 11:00 AM
Total Amount: ${formatPrice(data.totalAmount)}

${data.specialRequests ? `Special Requests: ${data.specialRequests}` : ''}

IMPORTANT INFORMATION
• Please bring a valid photo ID for check-in
• Check-in is available from 3:00 PM onwards
• Check-out is required by 11:00 AM
• For any changes or cancellations, please contact us at least 24 hours in advance

CONTACT INFORMATION
Phone: (555) 123-4567
Email: info@palmaircourt.com
Address: 123 Desert View Drive, Arizona, USA

We look forward to hosting you at Palm Aire Court!

Best regards,
The Palm Aire Court Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #E07A5F; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .booking-details { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        .highlight { color: #E07A5F; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Palm Aire Court</h1>
        <h2>Booking Confirmation</h2>
    </div>
    
    <div class="content">
        <p>Dear <strong>${data.guestName}</strong>,</p>
        
        <p>Thank you for choosing Palm Aire Court! We're excited to confirm your reservation.</p>
        
        <div class="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Confirmation Number:</strong> <span class="highlight">${data.bookingId}</span></p>
            <p><strong>Unit:</strong> ${data.unitName}</p>
            <p><strong>Check-in:</strong> ${formatDate(data.checkIn)} at 3:00 PM</p>
            <p><strong>Check-out:</strong> ${formatDate(data.checkOut)} at 11:00 AM</p>
            <p><strong>Total Amount:</strong> <span class="highlight">${formatPrice(data.totalAmount)}</span></p>
            ${data.specialRequests ? `<p><strong>Special Requests:</strong> ${data.specialRequests}</p>` : ''}
        </div>
        
        <h3>Important Information</h3>
        <ul>
            <li>Please bring a valid photo ID for check-in</li>
            <li>Check-in is available from 3:00 PM onwards</li>
            <li>Check-out is required by 11:00 AM</li>
            <li>For any changes or cancellations, please contact us at least 24 hours in advance</li>
        </ul>
        
        <h3>Contact Information</h3>
        <p>
            <strong>Phone:</strong> (555) 123-4567<br>
            <strong>Email:</strong> info@palmaircourt.com<br>
            <strong>Address:</strong> 123 Desert View Drive, Arizona, USA
        </p>
        
        <p>We look forward to hosting you at Palm Aire Court!</p>
        
        <p>Best regards,<br>The Palm Aire Court Team</p>
    </div>
    
    <div class="footer">
        <p>This email was sent regarding your booking at Palm Aire Court.</p>
    </div>
</body>
</html>
    `.trim();

    return {
      to: data.guestEmail,
      subject,
      text,
      html
    };
  }

  // Utility method to get demo emails (for development/testing)
  static getDemoEmails(): any[] {
    if (typeof localStorage === 'undefined') return [];
    return JSON.parse(localStorage.getItem('demoEmails') || '[]');
  }

  // Utility method to clear demo emails
  static clearDemoEmails(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('demoEmails');
    }
  }
}
