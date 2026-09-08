import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-[90svh] lg:min-h-[95svh] flex items-center justify-center overflow-hidden border-b border-border/40">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/product-banner-1.jpeg"
          alt="Luxury Abaya Collection"
          className="w-full h-full object-cover object-center"
        />
        {/* Natural Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 luxury-container text-center md:text-left py-20 sm:py-24">
        <div className="max-w-2xl mx-auto md:mx-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
              Dubai Atelier Collection
            </span>
          </div>
          
          <h1 className="editorial-heading mb-5">
            UAE-born.
            <br />
            <span className="italic text-primary">Culture-inspired.</span>
          </h1>
          
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            Discover tailored luxury abayas, kaftans, and contemporary modest wear crafted with premium fabrics and artisanal detail in Dubai.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center md:justify-start">
            <Link to="/shop?tag=new_drop" className="w-full sm:w-auto">
              <Button className="btn-luxury-primary group w-full sm:w-auto h-12 px-8">
                Shop New Drops
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/shop?category=abayas" className="w-full sm:w-auto">
              <Button variant="outline" className="btn-luxury-outline w-full sm:w-auto h-12 px-8">
                Explore Abayas
              </Button>
            </Link>
          </div>

          {/* Clean B2B wholesale note */}
          <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground">
            <span>Boutique & wholesale orders available</span>
            <span>•</span>
            <Link to="/wholesale" className="text-primary hover:underline font-medium">
              Wholesale Program →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
