import Hero from '@/components/hero';
import HighlightsStrip from '@/components/highlights-strip';
import FeaturedStays from '@/components/featured-stays';
import CommunitySection from '@/components/community-section';
import LocationSection from '@/components/location-section';

export default function Home() {
  return (
    <div data-testid="home-page">
      <Hero />
      <HighlightsStrip />
      <FeaturedStays />
      <CommunitySection />
      <LocationSection />
    </div>
  );
}
