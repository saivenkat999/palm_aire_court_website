import { Coffee, Film, Music, Utensils, Gamepad2, Heart, Calendar, Users2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AmenitiesList from '@/components/amenities-list';
import amenitiesData from '@/data/amenities.json';
import type { Amenity } from '@/types';

const communityActivities = [
  {
    icon: Coffee,
    title: "Morning Coffee Time",
    description: "Join fellow residents every morning at 9:30 AM for coffee, conversation, and community updates in our comfortable pavilion.",
    schedule: "Daily 9:30 AM",
    testId: "activity-coffee-time"
  },
  {
    icon: Film,
    title: "Movie Nights",
    description: "Weekly movie screenings featuring classic films, recent releases, and community favorites in our recreation area.",
    schedule: "Weekly",
    testId: "activity-movie-nights"
  },
  {
    icon: Music,
    title: "Hymn Sings & Music",
    description: "Community music gatherings featuring traditional hymns, folk songs, and musical fellowship for all skill levels.",
    schedule: "Bi-weekly",
    testId: "activity-hymn-sings"
  },
  {
    icon: Utensils,
    title: "Fellowship Meals",
    description: "Shared community dinners and potluck gatherings that bring neighbors together over delicious food.",
    schedule: "Monthly",
    testId: "activity-fellowship-meals"
  },
  {
    icon: Gamepad2,
    title: "Puzzles & Games",
    description: "Board games, card games, jigsaw puzzles, and brain teasers available in our recreation area daily.",
    schedule: "Daily",
    testId: "activity-games"
  },
  {
    icon: Heart,
    title: "Wellness Activities",
    description: "Light exercise classes, walking groups, and wellness workshops designed for active seniors.",
    schedule: "Weekly",
    testId: "activity-wellness"
  },
  {
    icon: Calendar,
    title: "Seasonal Events",
    description: "Holiday celebrations, seasonal parties, and special community events throughout the year.",
    schedule: "Seasonal",
    testId: "activity-seasonal"
  },
  {
    icon: Users2,
    title: "Social Clubs",
    description: "Various interest groups and clubs including book clubs, crafting circles, and hobby groups.",
    schedule: "Variable",
    testId: "activity-clubs"
  },
];

export default function Amenities() {
  const amenities = amenitiesData as Amenity[];
  const communityAmenities = amenities.filter(amenity => amenity.category === 'community');
  const unitAmenities = amenities.filter(amenity => amenity.category === 'unit');

  return (
    <div className="min-h-screen bg-background py-8" data-testid="amenities-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Amenities & Community Life
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the comfort and convenience of Palm Aire Court with our comprehensive amenities 
            and vibrant community activities designed for your enjoyment and well-being.
          </p>
        </div>

        {/* Community Amenities */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">
              Community Amenities
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Shared facilities and services that make Palm Aire Court your home away from home
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <AmenitiesList 
              amenityIds={communityAmenities.map(a => a.id)}
              className="col-span-full"
            />
          </div>
        </section>

        {/* Unit Amenities */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">
              In-Unit Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Modern conveniences and comfort features available in our accommodations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AmenitiesList 
              amenityIds={unitAmenities.map(a => a.id)}
              className="col-span-full"
            />
          </div>
        </section>

        {/* Community Activities */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">
              Community Activities
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Engaging activities and social opportunities that foster friendship and community spirit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {communityActivities.map((activity, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow" data-testid={activity.testId}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-3">
                      <activity.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {activity.schedule}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {activity.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Special Features */}
        <section>
          <Card className="bg-muted/50 border-primary/20" data-testid="special-features">
            <CardContent className="pt-8">
              <div className="text-center mb-6">
                <h3 className="font-display font-bold text-xl mb-4">
                  What Makes Palm Aire Court Special
                </h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div data-testid="feature-community">
                  <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users2 className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Welcoming Community</h4>
                  <p className="text-sm text-muted-foreground">
                    A friendly neighborhood atmosphere where lasting friendships are formed
                  </p>
                </div>
                
                <div data-testid="feature-location">
                  <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Year-Round Activities</h4>
                  <p className="text-sm text-muted-foreground">
                    Something happening every day with seasonal events and regular programming
                  </p>
                </div>
                
                <div data-testid="feature-comfort">
                  <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Comfortable Living</h4>
                  <p className="text-sm text-muted-foreground">
                    Modern amenities and well-maintained facilities for your peace of mind
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
