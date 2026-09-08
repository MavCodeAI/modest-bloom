import { Truck, Globe, Scissors, CreditCard } from 'lucide-react';

const assurances = [
  {
    icon: Truck,
    title: 'Dubai Dispatch',
    description: 'Fast fulfillment across the UAE & GCC',
  },
  {
    icon: Globe,
    title: 'Worldwide Express',
    description: 'Tracked delivery via DHL & Aramex',
  },
  {
    icon: Scissors,
    title: 'Modest Tailoring',
    description: 'Precise sizing from 50 to 60 length',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    description: 'Cards & Cash on Delivery across UAE',
  },
];

export function ExpressStripSection() {
  return (
    <section className="py-8 sm:py-10 border-y border-border/60 bg-card/40">
      <div className="luxury-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {assurances.map((item) => (
            <div key={item.title} className="flex items-start gap-4 p-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold text-foreground mb-0.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-snug">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
