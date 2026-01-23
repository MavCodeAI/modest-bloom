import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Heart, Star, Users, Award, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="luxury-container">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-6">
                <span className="text-white">Modest</span> <span className="text-white">Way</span> <span className="text-white">Fashion</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                UAE-born. Culture-inspired. Redefining luxury modest fashion for the modern woman who values elegance, tradition, and contemporary style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-luxury-primary h-12 px-8">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-12 px-8">
                  Our Story
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 sm:py-24">
          <div className="luxury-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-sm sm:text-base">
                    Born in the heart of Dubai, <span className="text-white">Modest Way Fashion</span> emerged from a vision to create modest fashion that celebrates cultural heritage while embracing contemporary design. Our journey began in 2020, with a small collection of hand-designed abayas that quickly gained recognition for their unique blend of traditional modesty and modern elegance.
                  </p>
                  <p className="text-sm sm:text-base">
                    Today, we're proud to be one of the UAE's leading modest fashion brands, serving women across the Middle East and beyond. Each piece in our collection tells a story of craftsmanship, attention to detail, and respect for the values that matter most to our customers.
                  </p>
                  <p className="text-sm sm:text-base">
                    Our commitment goes beyond fashion – we're building a community of women who celebrate their identity through style, confidence, and grace.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 sm:py-24 bg-card/50">
          <div className="luxury-container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4">Our Values</h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                The principles that guide everything we do, from design to delivery
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-lg mb-3">Modesty First</h3>
                <p className="text-muted-foreground text-sm">
                  Every design honors the principles of modesty while celebrating contemporary fashion trends.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-lg mb-3">Quality Craftsmanship</h3>
                <p className="text-muted-foreground text-sm">
                  Premium fabrics, meticulous attention to detail, and designs that stand the test of time.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-lg mb-3">Inclusive Sizing</h3>
                <p className="text-muted-foreground text-sm">
                  Fashion for every body type, with extended sizes and custom fit options available.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-lg mb-3">Cultural Heritage</h3>
                <p className="text-muted-foreground text-sm">
                  Celebrating Middle Eastern culture through designs that respect tradition and innovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 sm:py-24">
          <div className="luxury-container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4">By the Numbers</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Our growth and impact in the modest fashion community
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">50K+</div>
                <p className="text-muted-foreground text-sm">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">200+</div>
                <p className="text-muted-foreground text-sm">Unique Designs</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">15</div>
                <p className="text-muted-foreground text-sm">Countries Served</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">4.9★</div>
                <p className="text-muted-foreground text-sm">Customer Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 sm:py-24 bg-card/50">
          <div className="luxury-container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                The passionate individuals behind <span className="text-white">Modest Way Fashion</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto mb-4"></div>
                <h3 className="font-serif text-lg mb-2">Fatima Al Maktoum</h3>
                <p className="text-muted-foreground text-sm mb-2">Founder & Creative Director</p>
                <p className="text-muted-foreground text-xs">
                  Visionary designer with over 15 years in modest fashion
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto mb-4"></div>
                <h3 className="font-serif text-lg mb-2">Sarah Hassan</h3>
                <p className="text-muted-foreground text-sm mb-2">Head of Design</p>
                <p className="text-muted-foreground text-xs">
                  Bringing contemporary elegance to traditional modest wear
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto mb-4"></div>
                <h3 className="font-serif text-lg mb-2">Amina Khalid</h3>
                <p className="text-muted-foreground text-sm mb-2">Customer Experience Lead</p>
                <p className="text-muted-foreground text-xs">
                  Ensuring every customer feels valued and beautiful
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section className="py-16 sm:py-24">
          <div className="luxury-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-6">Our Commitment to Sustainability</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-sm sm:text-base">
                    At <span className="text-white">Modest Way Fashion</span>, we believe that beauty and responsibility go hand in hand. We're committed to reducing our environmental impact while maintaining the highest standards of quality and design.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm sm:text-base">
                        <strong>Eco-friendly Fabrics:</strong> Sourcing sustainable materials that are gentle on both skin and environment
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm sm:text-base">
                        <strong>Ethical Production:</strong> Working with partners who share our values of fair labor practices
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm sm:text-base">
                        <strong>Minimal Waste:</strong> Optimizing our production processes to reduce fabric waste
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm sm:text-base">
                        <strong>Long-lasting Design:</strong> Creating timeless pieces that won't go out of style
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-square bg-gradient-to-br from-green-50 to-primary/5 rounded-2xl flex items-center justify-center">
                  <Heart className="w-24 h-24 text-green-600/30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24 bg-primary/5">
          <div className="luxury-container text-center">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-6">
              Join the Modest Way Family
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Discover modest fashion that celebrates your unique style and values. Explore our collection and find pieces that speak to your heart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-luxury-primary h-12 px-8">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-12 px-8">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
