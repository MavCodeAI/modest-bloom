import { Star, Quote, CheckCircle2, MapPin, ShoppingBag } from 'lucide-react';
import { testimonials } from '@/lib/data';

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-card/60 border-t border-border/60">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            Client Feedback & Reviews
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground">
            Verified GCC & International Buyers
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-3">
            Real feedback from women who wear our Dubai-tailored abayas and ensembles daily.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative bg-background rounded-xl p-6 border border-border/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Stars & Verified */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 star-gold fill-current" />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Order
                    </span>
                  )}
                </div>

                {/* Purchased Product Tag */}
                <div className="mb-3.5 flex items-center gap-1.5 text-[11px] text-muted-foreground bg-accent/40 px-2.5 py-1 rounded-md border border-border/40">
                  <ShoppingBag className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="truncate font-medium text-foreground">{testimonial.productPurchased}</span>
                  <span className="text-primary flex-shrink-0">({testimonial.sizeBought})</span>
                </div>

                {/* Review Text */}
                <p className="text-foreground/90 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  "{testimonial.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div>
                  <p className="font-medium text-xs sm:text-sm text-foreground">{testimonial.name}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-primary/70" />
                    {testimonial.location}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground">{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

