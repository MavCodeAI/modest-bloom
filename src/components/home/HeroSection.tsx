import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/product-banner-1.jpeg"
          alt="Luxury Abaya Collection"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 luxury-container text-center md:text-left py-20 sm:py-24">
        <div className="max-w-2xl mx-auto md:mx-0">
          <p className="text-primary text-xs sm:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 animate-fade-in">
            New Collection 2024
          </p>
          
          <h1 className="editorial-heading mb-4 sm:mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            UAE-born.
            <br />
            <span className="italic text-primary">Culture-inspired.</span>
          </h1>
          
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-lg mx-auto md:mx-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Discover our latest collection of luxury abayas, kaftans, and modest wear, crafted for the modern woman.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/wholesale" className="w-full sm:w-auto">
              <Button className="btn-luxury-primary group w-full sm:w-auto">
                Wholesale Partnership
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/shop?tag=new_drop" className="w-full sm:w-auto">
              <Button className="btn-luxury-outline w-full sm:w-auto">
                View New Arrivals
              </Button>
            </Link>
          </div>

          {/* Wholesale Info Strip */}
          <div className="mt-8 sm:mt-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link 
              to="/wholesale" 
              className="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-primary/20 transition-all group"
            >
              <span className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full">
                <Building2 className="h-4 w-4 text-primary" />
              </span>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  Wholesale Partnership Available
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  MOQ 10 pieces • 200+ retail partners worldwide
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
