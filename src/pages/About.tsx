import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight, Scissors, ShieldCheck, Sparkles, Truck, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />
      
      <main className="pt-16 md:pt-24">
        {/* Editorial Header */}
        <section className="py-16 sm:py-20 border-b border-border/60 bg-card/30">
          <div className="luxury-container">
            <div className="max-w-3xl">
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-4">
                Our Heritage & Craft
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-6 leading-tight">
                Rooted in Dubai. Tailored for Modest Elegance.
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
                Modest Way Fashion creates contemporary abayas, kaftans, and modest ensembles that balance rich Middle Eastern tailoring traditions with modern, effortless silhouettes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop">
                  <Button className="btn-luxury-primary h-12 px-7">
                    Explore New Arrivals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/wholesale">
                  <Button variant="outline" className="h-12 px-7 border-border hover:bg-accent">
                    Wholesale Partnerships
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Narrative */}
        <section className="py-16 sm:py-24">
          <div className="luxury-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground">
                  Artisanal Craftsmanship from the UAE
                </h2>
                <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
                  <p>
                    From our design studio in Dubai, Modest Way Fashion began with a single focus: designing abayas that drape gracefully, feel lightweight in warm climates, and hold their refined structure through seasons of wear.
                  </p>
                  <p>
                    Every silhouette in our collection is drafted with careful attention to proportion, neckline modesty, sleeve breadth, and hemline drop. We source premium Korean Nida, matte crepe, crushed silks, and plush velvets that offer both breathability and opacity.
                  </p>
                  <p>
                    Whether catering to individual clients across the GCC or supplying selective boutiques worldwide, we maintain rigorous quality standards across every single seam.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-border/80 shadow-sm">
                  <img
                    src="/images/product-banner-1.jpeg"
                    alt="Modest Way Fashion Studio"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars of Design */}
        <section className="py-16 sm:py-24 bg-card border-y border-border/60">
          <div className="luxury-container">
            <div className="max-w-2xl mb-12">
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                Standards
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground">
                The Principles Behind Every Garment
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-background border border-border/70">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                  <Scissors className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">Precise Length Sizing</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Available in standardized lengths from 50 to 60 inches to ensure proper floor-clearance and tailored fit across different heights.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-background border border-border/70">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">Selected Textiles</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We prioritize breathable weaves with natural drape, wrinkle resistance, and deep colorfast dyes that endure frequent wear.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-background border border-border/70">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">Quality Inspection</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every abaya is individually checked for hem alignment, embroidery consistency, and secure hardware before dispatch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Wholesale & Retail Banner */}
        <section className="py-16 sm:py-20">
          <div className="luxury-container">
            <div className="rounded-2xl bg-card border border-border p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">
                  Interested in Wholesale or Custom Orders?
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  We collaborate with boutique owners and retailers internationally. Inquire about minimum order quantities, custom colorways, and express shipping rates.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 flex-shrink-0">
                <Link to="/wholesale">
                  <Button className="btn-luxury-primary h-12 px-8">
                    Wholesale Program
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="h-12 px-8 border-border hover:bg-accent">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
