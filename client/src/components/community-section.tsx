import { Coffee, Film, Music, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const activities = [
  {
    icon: Coffee,
    title: "Morning Coffee",
    schedule: "9:30 AM Daily",
    testId: "activity-coffee"
  },
  {
    icon: Film,
    title: "Movie Nights",
    schedule: "Weekly Events",
    testId: "activity-movies"
  },
  {
    icon: Music,
    title: "Hymn Sings",
    schedule: "Community Events",
    testId: "activity-hymns"
  },
  {
    icon: Utensils,
    title: "Fellowship Meals",
    schedule: "Regular Dinners",
    testId: "activity-meals"
  },
];

export default function CommunitySection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
              Vibrant Community Life
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our welcoming community for daily activities, social gatherings, 
              and lasting friendships in the Arizona sunshine.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {activities.map((activity, index) => (
                <div key={index} className="text-center" data-testid={activity.testId}>
                  <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <activity.icon className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">{activity.schedule}</p>
                </div>
              ))}
            </div>
            
            <Link href="/amenities">
              <Button data-testid="see-all-activities">
                See All Activities
              </Button>
            </Link>
          </div>
          
          <div>
            <img
              src="https://placehold.co/600x400/F2CC8F/000000?text=Community+Activities+%26+Fellowship"
              alt="Community activities - seniors enjoying games and fellowship"
              className="rounded-xl shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
