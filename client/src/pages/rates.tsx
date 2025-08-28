import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { useUnits } from '@/hooks/use-api';

export default function Rates() {
  const { data: units = [], isLoading } = useUnits();

  // Extract unique rate plans from units
  const ratePlans = units.reduce((acc: any[], unit) => {
    unit.ratePlans?.forEach(plan => {
      if (plan.category && !acc.find(existing => existing.category === plan.category)) {
        acc.push(plan);
      }
    });
    return acc;
  }, []);

  const categoryLabels: Record<string, string> = {
    'TRAILER': 'Trailers',
    'COTTAGE_1BR': '1-Bedroom Cottages', 
    'COTTAGE_2BR': '2-Bedroom Cottages',
    'RV_SITE': 'RV Sites',
  };

  const formatCurrency = (cents: number | null | undefined) => {
    if (!cents) return 'Contact us';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading rates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8" data-testid="rates-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Rates & Discounts
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Transparent pricing for all our accommodations. Longer stays offer better value, 
            and seasonal discounts provide additional savings throughout the year.
          </p>
        </div>

        {/* Rate Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ratePlans.map((plan: any) => (
            <Card key={plan.category} className="shadow-lg" data-testid={`rate-card-${plan.category}`}>
              <CardHeader>
                <CardTitle className="text-xl">
                  {categoryLabels[plan.category] || plan.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nightly</span>
                    <p className="font-semibold text-lg">{formatCurrency(plan.nightly)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Weekly</span>
                    <p className="font-semibold text-lg">{formatCurrency(plan.weekly)}</p>
                    {plan.weekly && plan.nightly && (
                      <Badge variant="secondary" className="text-xs">
                        Save {Math.round((1 - (plan.weekly / (plan.nightly * 7))) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monthly</span>
                    <p className="font-semibold text-lg">{formatCurrency(plan.monthly)}</p>
                    {plan.monthly && plan.nightly && (
                      <Badge variant="secondary" className="text-xs">
                        Save {Math.round((1 - (plan.monthly / (plan.nightly * 30))) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">4-Month</span>
                    <p className="font-semibold text-lg">{formatCurrency(plan.fourMonth)}</p>
                    {plan.fourMonth && plan.nightly && (
                      <Badge variant="secondary" className="text-xs">
                        Save {Math.round((1 - (plan.fourMonth / (plan.nightly * 120))) * 100)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seasonal Discounts */}
        <Card className="mb-8" data-testid="seasonal-discounts">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Seasonal Discounts</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Spring & Fall Special</h4>
                <p className="text-muted-foreground mb-2">
                  <strong>November & April:</strong> 10% off nightly rates
                </p>
                <p className="text-sm text-muted-foreground">
                  Perfect weather months with comfortable temperatures and lower crowds.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Summer Saver</h4>
                <p className="text-muted-foreground mb-2">
                  <strong>May through October:</strong> 20% off nightly rates
                </p>
                <p className="text-sm text-muted-foreground">
                  Beat the heat with our biggest discounts during the warmer months.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-muted/50" data-testid="rate-disclaimer">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Important Information</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Rates shown are estimates. Final pricing calculated at booking with applicable discounts.</li>
                  <li>• Seasonal discounts applied automatically based on stay dates.</li>
                  <li>• Weekly, monthly, and 4-month rates require minimum stay commitments.</li>
                  <li>• All rates subject to availability and may change without notice.</li>
                  <li>• Additional fees may apply for extra guests or services.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
