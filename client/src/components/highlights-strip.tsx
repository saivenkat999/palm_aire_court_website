import { Wifi, Mail, ChefHat, Droplets, Target, Users } from "lucide-react";

const highlights = [
  { icon: Wifi, label: "Wi-Fi", testId: "highlight-wifi" },
  { icon: Mail, label: "USPS Delivery", testId: "highlight-mail" },
  { icon: ChefHat, label: "Pavilion BBQ", testId: "highlight-bbq" },
  { icon: Droplets, label: "RO Water", testId: "highlight-water" },
  { icon: Target, label: "Shuffleboard", testId: "highlight-shuffleboard" },
  { icon: Users, label: "Activities", testId: "highlight-activities" },
];

export default function HighlightsStrip() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted transition-colors"
              data-testid={highlight.testId}
            >
              <highlight.icon className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium">{highlight.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
