import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Package, Globe, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WholesaleStripSection() {
  return (
    <section className="section-padding bg-card border-t border-border/60">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="lg:col-span-7">
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-3">
              Boutiques & Retailers
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-foreground">
              Wholesale & Custom Production
            </h2>
            <p className="text-muted-foreground text-base mb-6 leading-relaxed">
              Supply your boutique with authentic UAE-tailored abayas, kaftans, and matching sets. 
              We offer low minimum order quantities, flexible customization, and worldwide express dispatch.
            </p>

            {/* Terms List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90 font-medium">
                <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>MOQ 12 pcs / color</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90 font-medium">
                <Package className="h-4 w-4 text-primary flex-shrink-0" />
                <span>7–8 business days</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90 font-medium">
                <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                <span>DHL, FedEx, Aramex</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/wholesale">
                <Button className="btn-luxury-primary group h-11 px-7">
                  Wholesale Inquiry
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/wholesale/catalog">
                <Button variant="outline" className="h-11 px-7 border-border hover:bg-accent">
                  Browse B2B Catalog
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Feature Card */}
          <div className="lg:col-span-5 bg-background border border-border/80 rounded-xl p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-foreground">
              What We Offer Partners
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Direct Dubai manufacturer pricing without middlemen</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Comprehensive video sample review before bulk cutting</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Custom sizing, hem adjustments & private label options</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Dedicated account assistance via WhatsApp</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
