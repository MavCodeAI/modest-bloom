import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/lib/data';

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-card">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-medium uppercase tracking-[0.2em] mb-3">
            Our Clients
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">What They Say</h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative bg-background/50 rounded-lg p-8 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 star-gold fill-current" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 text-sm leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
