import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import ratesData from '@/data/rates.json';
import { formatCurrency } from '@/lib/pricing';
import type { Rate } from '@/types';

export default function Rates() {
  const rates = ratesData as Rate[];

  const categoryLabels: Record<string, string> = {
    'trailer': 'Trailers',
    'cottage-1br': '1-Bedroom Cottages',
    'cottage-2br': '2-Bedroom Cottages',
    'cottage-2br-premium': '2-Bedroom Premium Cottages',
    'rv-site': 'RV Sites',
  };

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
          {rates.map((rate) => (
            <Card key={rate.category} className="shadow-lg" data-testid={`rate-card-${rate.category}`}>
              <CardHeader>
                <CardTitle className="text-xl">
                  {categoryLabels[rate.category] || rate.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nightly</span>
                    <p className="font-semibold text-lg">{formatCurrency(rate.nightly)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Weekly</span>
                    <p className="font-semibold text-lg">{formatCurrency(rate.weekly)}</p>
                    <Badge variant="secondary" className="text-xs">
                      Save {Math.round((1 - (rate.weekly / (rate.nightly * 7))) * 100)}%
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monthly</span>
                    <p className="font-semibold text-lg">{formatCurrency(rate.monthly)}</p>
                    <Badge variant="secondary" className="text-xs">
                      Save {Math.round((1 - (rate.monthly / (rate.nightly * 30))) * 100)}%
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">4-Month</span>
                    <p className="font-semibold text-lg">{formatCurrency(rate.fourMonth)}</p>
                    <Badge variant="secondary" className="text-xs">
                      Save {Math.round((1 - (rate.fourMonth / (rate.nightly * 120))) * 100)}%
                    </Badge>
                  </div>
                </div>
                
                {rate.cleaningFee > 0 && (
                  <div className="border-t pt-4">
                    <span className="text-muted-foreground text-sm">Cleaning Fee (one-time)</span>
                    <p className="font-semibold">{formatCurrency(rate.cleaningFee)}</p>
                  </div>
                )}
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
