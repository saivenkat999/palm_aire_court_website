import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Sun, Mountain, TreePine, Camera, ShoppingBag } from 'lucide-react';

const nearbyAttractions = [
  {
    icon: TreePine,
    name: "Desert Botanical Garden",
    distance: "12 minutes",
    description: "World-renowned desert plant collection with trails and seasonal exhibits",
    testId: "attraction-botanical-garden"
  },
  {
    icon: Camera,
    name: "Phoenix Zoo",
    distance: "15 minutes", 
    description: "Arizona's largest zoo featuring animals from around the world",
    testId: "attraction-zoo"
  },
  {
    icon: Mountain,
    name: "Papago Park",
    distance: "10 minutes",
    description: "Iconic red rock formations perfect for hiking and photography",
    testId: "attraction-papago"
  },
  {
    icon: ShoppingBag,
    name: "Scottsdale Fashion Square",
    distance: "20 minutes",
    description: "Premier shopping destination with luxury brands and dining",
    testId: "attraction-fashion-square"
  },
  {
    icon: Sun,
    name: "South Mountain Park",
    distance: "25 minutes",
    description: "One of the largest municipal parks in the US with desert trails",
    testId: "attraction-south-mountain"
  },
  {
    icon: Camera,
    name: "Old Town Scottsdale",
    distance: "22 minutes",
    description: "Historic downtown area with galleries, shops, and southwestern charm",
    testId: "attraction-old-town"
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background py-8" data-testid="about-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
            About Palm Aire Court
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A family-owned desert oasis where hospitality meets comfort in Phoenix, Arizona
          </p>
        </div>

        {/* Meet the Owners */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">
                Meet the Owners
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Howard and Jayme Eigsti are proud parents of seven children and grandparents to 24 (and counting!) grandchildren. They are grain farmers in Illinois with a passion for hospitality.
                </p>
                <p>
                  Several years ago, they purchased their first Airbnb in Phoenix, where they discovered a love for hosting guests. This experience inspired them to buy Palm Aire Court, allowing them to expand their ability to welcome travelers, provide exceptional hospitality, and make guests feel at home, even when they're far from home.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <img
                src="/assets/About.jpeg"
                alt="Howard and Jayme Eigsti, owners of Palm Aire Court"
                className="rounded-xl shadow-lg w-full max-w-md object-contain"
              />
            </div>
          </div>
        </section>

        {/* Community Values */}
        <section className="mb-16">
          <Card className="bg-muted/50 border-primary/20" data-testid="community-values">
            <CardContent className="pt-8">
              <div className="text-center mb-8">
                <h3 className="font-display font-bold text-2xl mb-4">
                  What We Value
                </h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center" data-testid="value-community">
                  <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Sun className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Community Spirit</h4>
                  <p className="text-sm text-muted-foreground">
                    We believe in the power of community. Our daily coffee times, shared meals, 
                    and group activities create lasting bonds between neighbors.
                  </p>
                </div>
                
                <div className="text-center" data-testid="value-comfort">
                  <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Comfort & Quality</h4>
                  <p className="text-sm text-muted-foreground">
                    Every detail matters. From our reverse osmosis water system to our 
                    well-appointed units, we strive for excellence in every aspect.
                  </p>
                </div>
                
                <div className="text-center" data-testid="value-location">
                  <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Mountain className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Prime Location</h4>
                  <p className="text-sm text-muted-foreground">
                    Perfectly positioned to enjoy both the tranquility of desert living 
                    and easy access to Phoenix's many attractions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Nearby Attractions */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">
              Explore the Valley
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Palm Aire Court's central Phoenix location puts you within easy reach 
              of the area's most popular destinations and hidden gems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyAttractions.map((attraction, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow" data-testid={attraction.testId}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                      <attraction.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{attraction.name}</h3>
                        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                          {attraction.distance}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {attraction.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <Card className="bg-primary text-primary-foreground" data-testid="contact-section">
            <CardContent className="pt-8 text-center">
              <h3 className="font-display font-bold text-2xl mb-4">
                Ready to Experience Palm Aire Court?
              </h3>
              <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                We'd love to welcome you to our community. Contact us today to learn more 
                about our accommodations, current availability, and what makes Palm Aire Court 
                the perfect choice for your Phoenix area stay.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div data-testid="contact-phone-section">
                  <p className="font-semibold mb-1">Call Us</p>
                  <p className="text-primary-foreground/90">480-993-8431</p>
                </div>
                <div data-testid="contact-email-section">
                  <p className="font-semibold mb-1">Email Us</p>
                  <p className="text-primary-foreground/90">palmairecourt@outlook.com</p>
                </div>
                <div data-testid="contact-address-section">
                  <p className="font-semibold mb-1">Visit Us</p>
                  <p className="text-primary-foreground/90">9616 N 12th St<br />Phoenix, AZ 85020</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
