import { MapPin, Phone, Mail } from "lucide-react";

const nearbyAttractions = [
  "Desert Botanical Garden - 12 minutes",
  "Phoenix Zoo - 15 minutes", 
  "Papago Park - 10 minutes",
  "Scottsdale Fashion Square - 20 minutes",
];

export default function LocationSection() {
  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
              Perfect Phoenix Location
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3" data-testid="contact-address">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold">9616 N 12th St</p>
                  <p className="text-muted-foreground">Phoenix, AZ 85020</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3" data-testid="contact-phone">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <p>480-993-8431</p>
              </div>
              
              <div className="flex items-start space-x-3" data-testid="contact-email">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <p>palmairecourt@outlook.com</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Nearby Attractions</h3>
              <ul className="space-y-2 text-muted-foreground">
                {nearbyAttractions.map((attraction, index) => (
                  <li key={index} data-testid={`attraction-${index}`}>
                    • {attraction}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.8174167891643!2d-112.05879668431856!3d33.64736798068772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b734b2b1b1b1b%3A0x1234567890abcdef!2s9616%20N%2012th%20St%2C%20Phoenix%2C%20AZ%2085020!5e0!3m2!1sen!2sus!4v1234567890123"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Palm Aire Court Location"
              ></iframe>
              <div className="p-4 text-center bg-gray-50">
                <p className="text-sm text-muted-foreground mb-2">9616 N 12th St, Phoenix, AZ 85020</p>
                <a 
                  href="https://maps.google.com/?q=9616+N+12th+St,+Phoenix,+AZ+85020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline text-sm"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
