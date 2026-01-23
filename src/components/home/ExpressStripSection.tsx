import { Truck, Globe, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Dispatch from Dubai',
    description: 'Same-day dispatch for UAE orders',
  },
  {
    icon: Globe,
    title: 'Worldwide Shipping',
    description: 'Express delivery to 50+ countries',
  },
  {
    icon: Clock,
    title: 'Easy Returns',
    description: '14-day hassle-free returns',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
];

export function ExpressStripSection() {
  return (
    <section className="py-12 border-y border-border">
      <div className="luxury-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <feature.icon className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
