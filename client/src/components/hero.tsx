import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/cottage/exterior.webp')"
        }}
      />
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="font-display font-bold text-4xl md:text-6xl mb-6 leading-tight">
          Palm Aire Court — Phoenix, Arizona
        </h1>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-95">
          A welcoming desert community offering comfortable accommodations and vibrant activities in the heart of Phoenix
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/stays">
            <Button 
              size="lg" 
              className="bg-white text-primary px-8 py-4 text-lg font-semibold hover:bg-gray-50 shadow-lg"
              data-testid="hero-check-availability"
            >
              Check Availability
            </Button>
          </Link>
          <Link href="/rates">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-primary"
              data-testid="hero-see-rates"
            >
              See Rates
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
