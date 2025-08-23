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
            <img
              src="https://placehold.co/600x400/E07A5F/ffffff?text=Phoenix+Map+%26+Desert+Landscape"
              alt="Phoenix city map and surrounding desert landscape"
              className="rounded-xl shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
