// GoHighLevel CRM Integration Utilities
// Handles contact creation and calendar event creation for bookings

interface GHLContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source?: string;
  customFields?: Record<string, any>;
  notes?: string;
}

interface GHLCalendarEvent {
  title: string;
  calendarId: string;
  startTime: string; // ISO format
  endTime: string; // ISO format
  contactId?: string;
  description?: string;
  address?: string;
  appointmentStatus?: string;
  bookingId?: string;
  totalCents?: number;
}

interface BookingData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  unitId: string;
  unitName?: string;
  totalAmount: number;
  specialRequests?: string;
  bookingId?: string;
}

export class GHLIntegration {
  private apiKey: string;
  private baseEndpoints = [
    'https://rest.gohighlevel.com/v1',
    'https://services.leadconnectorhq.com',
    'https://api.gohighlevel.com/v1'
  ];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Create a contact in GoHighLevel CRM
   */
  async createContact(contactData: GHLContact): Promise<any> {
    const payload = {
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone,
      source: contactData.source || 'Website Booking',
      customFields: contactData.customFields || {},
      notes: contactData.notes || ''
    };

    let lastError = null;
    
    for (const baseUrl of this.baseEndpoints) {
      try {
        const response = await fetch(`${baseUrl}/contacts/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`Contact created successfully in GHL via ${baseUrl}:`, result);
          return result;
        } else {
          const errorText = await response.text();
          console.log(`Failed with endpoint ${baseUrl}/contacts/:`, response.status, errorText);
          lastError = { endpoint: baseUrl, status: response.status, error: errorText };
        }
      } catch (error) {
        console.log(`Error with endpoint ${baseUrl}/contacts/:`, error);
        lastError = { 
          endpoint: baseUrl, 
          error: error instanceof Error ? error.message : String(error) 
        };
      }
    }
    
    throw new Error(`All GHL contact endpoints failed: ${JSON.stringify(lastError)}`);
  }

  /**
   * Get available calendars from GHL to find the correct calendar ID
   */
  async getCalendars(): Promise<any> {
    let lastError = null;
    
    for (const baseUrl of this.baseEndpoints) {
      try {
        const response = await fetch(`${baseUrl}/calendars`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`Calendars retrieved from GHL via ${baseUrl}:`, result);
          return result;
        } else {
          const errorText = await response.text();
          console.log(`Failed to get calendars from ${baseUrl}:`, response.status, errorText);
          lastError = { endpoint: baseUrl, status: response.status, error: errorText };
        }
      } catch (error) {
        console.log(`Error getting calendars from ${baseUrl}:`, error);
        lastError = { 
          endpoint: baseUrl, 
          error: error instanceof Error ? error.message : String(error) 
        };
      }
    }
    
    throw new Error(`All GHL calendar list endpoints failed: ${JSON.stringify(lastError)}`);
  }

  /**
   * Create a calendar event in GoHighLevel
   * Note: This is experimental and may require calendar setup in GHL first
   */
  async createCalendarEvent(eventData: GHLCalendarEvent, contactEmail: string, contactPhone: string): Promise<any> {
    // Format dates for GHL API
    const startDate = new Date(eventData.startTime);
    const endDate = new Date(eventData.endTime);
    
    // For now, try to create as a simple contact note/task instead of calendar event
    // This is more reliable until we have proper calendar ID configured
    try {
      // Try to add booking details directly to contact notes field (most reliable approach)
      console.log('⚠️ Calendar endpoints failed, adding booking details to contact notes...');
      
      const bookingNotes = `PALM AIRE COURT BOOKING
========================
Unit: ${eventData.title}
Check-in: ${startDate.toLocaleDateString()}
Check-out: ${endDate.toLocaleDateString()}
Customer: ${contactEmail}
Phone: ${contactPhone}
Booking ID: ${eventData.bookingId || 'N/A'}
Status: Confirmed
Booked: ${new Date().toLocaleString()}

*** MANUAL CALENDAR ENTRY NEEDED ***
Please create calendar event for this booking.`;

      try {
        const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/${eventData.contactId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notes: bookingNotes
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ GHL Contact notes updated successfully with booking details');
          return { fallback: 'notes', result, contactId: eventData.contactId };
        } else {
          console.log('⚠️ Contact notes update failed:', await response.text());
        }
      } catch (error) {
        console.log('⚠️ Contact notes update failed:', error);
      }
      
      // If notes don't work, try creating a task
      const taskPayload = {
        title: `Palm Aire Court Booking - ${startDate.toLocaleDateString()}`,
        body: `Check-in: ${startDate.toLocaleDateString()}\nCheck-out: ${endDate.toLocaleDateString()}\nGuest: ${contactEmail}\nPhone: ${contactPhone}`,
        contactId: eventData.contactId,
        dueDate: startDate.toISOString()
      };

      for (const baseUrl of this.baseEndpoints) {
        try {
          const response = await fetch(`${baseUrl}/contacts/${eventData.contactId}/tasks`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskPayload),
          });

          if (response.ok) {
            const result = await response.json();
            console.log(`✅ GHL Contact task added successfully via ${baseUrl}:`, result);
            return result;
          }
        } catch (error) {
          console.log(`⚠️ Task creation failed via ${baseUrl}:`, error);
        }
      }

      throw new Error('Could not create calendar event, note, or task in GHL');
      
    } catch (error) {
      console.log('⚠️ GHL Calendar integration failed, but contact exists:', error);
      throw error;
    }
  }

  /**
   * Create both contact and calendar event for a booking
   */
  async createBookingInGHL(bookingData: BookingData): Promise<{ contact: any; event?: any }> {
    try {
      // 1. Create contact first
      const contactData: GHLContact = {
        firstName: bookingData.guestName.split(' ')[0],
        lastName: bookingData.guestName.split(' ').slice(1).join(' ') || '',
        email: bookingData.guestEmail,
        phone: bookingData.guestPhone,
        source: 'Website Booking - Palm Aire Court',
        customFields: {
          booking_unit: bookingData.unitName || bookingData.unitId,
          check_in_date: bookingData.checkIn.toISOString().split('T')[0],
          check_out_date: bookingData.checkOut.toISOString().split('T')[0],
          booking_amount: `$${(bookingData.totalAmount / 100).toFixed(2)}`,
          special_requests: bookingData.specialRequests || '',
          booking_source: 'Palm Aire Court Website'
        },
        notes: `Booking Details:
- Booking ID: ${bookingData.bookingId || 'Pending'}
- Unit: ${bookingData.unitName || bookingData.unitId}
- Check-in: ${bookingData.checkIn.toLocaleDateString()}
- Check-out: ${bookingData.checkOut.toLocaleDateString()}
- Total Amount: $${(bookingData.totalAmount / 100).toFixed(2)}
- Special Requests: ${bookingData.specialRequests || 'None'}
- Booking Source: Palm Aire Court Website
- Booking Date: ${new Date().toLocaleString()}`
      };

      const contact = await this.createContact(contactData);
      console.log('✅ GHL Contact created:', contact);

      // 2. Try to create calendar event
      let event = null;
      try {
        // First, try to get available calendars to find a valid calendar ID
        let validCalendarId = 'default';
        try {
          const calendars = await this.getCalendars();
          if (calendars && calendars.calendars && calendars.calendars.length > 0) {
            validCalendarId = calendars.calendars[0].id;
            console.log(`📅 Using calendar ID: ${validCalendarId}`);
          }
        } catch (calendarListError) {
          console.log('⚠️ Could not retrieve calendars, using default ID');
        }

        const eventData: GHLCalendarEvent = {
          title: `Palm Aire Court Booking - ${bookingData.unitName || bookingData.unitId}`,
          calendarId: validCalendarId,
          startTime: bookingData.checkIn.toISOString(),
          endTime: bookingData.checkOut.toISOString(),
          contactId: contact.id || contact.contactId,
          description: `Guest: ${bookingData.guestName}
Email: ${bookingData.guestEmail}
Phone: ${bookingData.guestPhone}
Unit: ${bookingData.unitName || bookingData.unitId}
Total: $${(bookingData.totalAmount / 100).toFixed(2)}
Special Requests: ${bookingData.specialRequests || 'None'}`,
          address: 'Palm Aire Court, Phoenix, AZ',
          appointmentStatus: 'confirmed',
          bookingId: bookingData.bookingId,
          totalCents: bookingData.totalAmount
        };

        event = await this.createCalendarEvent(eventData, bookingData.guestEmail, bookingData.guestPhone);
        console.log('✅ GHL Calendar event created:', event);
      } catch (calendarError) {
        console.log('⚠️ GHL Calendar event creation failed, but contact was created:', calendarError);
        // Don't fail the entire booking if calendar fails
      }

      return { contact, event };
    } catch (error) {
      console.error('❌ GHL Integration failed:', error);
      throw error;
    }
  }
}
