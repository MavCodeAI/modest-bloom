import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Package, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WholesaleStripSection() {
  return (
    <section className="section-padding bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
      <div className="luxury-container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Content */}
          <div className="max-w-xl">
            <p className="text-primary text-sm font-medium uppercase tracking-[0.2em] mb-3">
              B2B Partnership
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Wholesale Program
            </h2>
            <p className="text-muted-foreground mb-6">
              Join our exclusive wholesale program and bring Modest Way's luxury collection to your boutique. 
              Competitive pricing, priority access to new collections, and dedicated support.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-5 w-5 text-primary" />
                <span>MOQ from 10 pieces</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-5 w-5 text-primary" />
                <span>Priority fulfillment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-5 w-5 text-primary" />
                <span>Global shipping</span>
              </div>
            </div>

            <Link to="/wholesale">
              <Button className="btn-luxury-primary group">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-serif text-4xl text-primary mb-2">200+</p>
              <p className="text-sm text-muted-foreground">Retail Partners</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-primary mb-2">35</p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-primary mb-2">98%</p>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
