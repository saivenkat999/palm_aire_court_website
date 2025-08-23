import { useState } from 'react';
import { MessageCircle, X, Calendar, Calculator, Bed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocation } from 'wouter';
import unitsData from '@/data/units.json';
import ratesData from '@/data/rates.json';
import availabilityData from '@/data/availability.json';
import { isDateRangeAvailable } from '@/lib/date';
import { formatCurrency } from '@/lib/pricing';
import type { Unit, Rate, AvailabilityEntry } from '@/types';

export default function ChatbotWidget() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<string>('');

  const units = unitsData as Unit[];
  const rates = ratesData as Rate[];
  const availability = availabilityData as AvailabilityEntry[];

  const checkAvailability = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const availableUnits = units.filter(unit => 
      isDateRangeAvailable(unit.id, today, tomorrow, availability)
    );

    setResults(`Found ${availableUnits.length} units available for today:\n\n${
      availableUnits.map(unit => `• ${unit.name} (${unit.type})`).join('\n')
    }`);
    setShowResults(true);
  };

  const getQuote = () => {
    // Sample quote for a 7-night stay
    const sampleUnit = units[0];
    const sampleRate = rates.find(r => r.category === sampleUnit.rateCategory);
    
    if (sampleRate) {
      const weeklyRate = sampleRate.weekly / 7;
      const total = (weeklyRate * 7) + sampleRate.cleaningFee;
      
      setResults(`Sample 7-night quote for ${sampleUnit.name}:\n\n` +
                `Base rate: ${formatCurrency(weeklyRate)}/night\n` +
                `7 nights: ${formatCurrency(weeklyRate * 7)}\n` +
                `Cleaning fee: ${formatCurrency(sampleRate.cleaningFee)}\n` +
                `Total: ${formatCurrency(total)}\n\n` +
                `*Seasonal discounts may apply`);
    } else {
      setResults('Unable to generate quote. Please contact us directly.');
    }
    setShowResults(true);
  };

  const goToBooking = () => {
    setIsOpen(false);
    setLocation('/stays');
  };

  const actions = [
    {
      icon: Calendar,
      label: "Check Availability",
      action: checkAvailability,
      testId: "chatbot-availability"
    },
    {
      icon: Calculator,
      label: "Get a Quote", 
      action: getQuote,
      testId: "chatbot-quote"
    },
    {
      icon: Bed,
      label: "Go to Booking",
      action: goToBooking,
      testId: "chatbot-booking"
    },
  ];

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg hover:scale-105 transition-all"
          data-testid="chatbot-toggle"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Chatbot Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md" data-testid="chatbot-modal">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>How can we help?</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                data-testid="chatbot-close"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start p-3 h-auto"
                onClick={action.action}
                data-testid={action.testId}
              >
                <action.icon className="w-4 h-4 mr-2 text-primary" />
                {action.label}
              </Button>
            ))}
          </div>
          
          {showResults && (
            <div className="mt-4 p-4 border-t border-border" data-testid="chatbot-results">
              <div className="text-sm text-muted-foreground whitespace-pre-line">
                {results}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setShowResults(false)}
                data-testid="chatbot-clear-results"
              >
                Clear
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
