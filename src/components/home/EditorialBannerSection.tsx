import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EditorialBannerSection() {
  return (
    <section className="section-padding">
      <div className="luxury-container">
        <div className="relative overflow-hidden rounded-lg bg-card">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            {/* Content */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 order-2 lg:order-1">
              <p className="text-primary text-xs font-medium uppercase tracking-[0.3em] mb-4">
                Editor's Pick
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
                The Minimalist<br />
                <span className="italic">Silk Collection</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                Pure silk abayas with clean lines and minimal embellishment. 
                The epitome of understated luxury, crafted for those who appreciate refined simplicity.
              </p>
              <div>
                <Link to="/shop?category=abayas">
                  <Button className="btn-luxury-primary group">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/5] lg:aspect-auto order-1 lg:order-2">
              <img
                src="/images/product-elegant-1.jpeg"
                alt="Silk Collection"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent lg:block hidden" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
