import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Ruler, ArrowRight } from 'lucide-react';

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24">
        <div className="luxury-container py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-4">
              <Ruler className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4">Size Guide</h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive size guide. Our modest fashion is designed to provide comfort and elegance for every body type.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Abayas Size Chart */}
            <div className="bg-card rounded-lg p-6 sm:p-8 border border-border">
              <h2 className="font-serif text-xl sm:text-2xl mb-6">Abayas Size Chart</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium">Size</th>
                      <th className="text-left py-3 px-2 font-medium">Bust (cm)</th>
                      <th className="text-left py-3 px-2 font-medium">Length (cm)</th>
                      <th className="text-left py-3 px-2 font-medium">Shoulder (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">XS</td>
                      <td className="py-3 px-2">84-88</td>
                      <td className="py-3 px-2">140-145</td>
                      <td className="py-3 px-2">36-38</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">S</td>
                      <td className="py-3 px-2">89-94</td>
                      <td className="py-3 px-2">146-150</td>
                      <td className="py-3 px-2">39-41</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">M</td>
                      <td className="py-3 px-2">95-100</td>
                      <td className="py-3 px-2">151-155</td>
                      <td className="py-3 px-2">42-44</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">L</td>
                      <td className="py-3 px-2">101-106</td>
                      <td className="py-3 px-2">156-160</td>
                      <td className="py-3 px-2">45-47</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">XL</td>
                      <td className="py-3 px-2">107-112</td>
                      <td className="py-3 px-2">161-165</td>
                      <td className="py-3 px-2">48-50</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2">XXL</td>
                      <td className="py-3 px-2">113-118</td>
                      <td className="py-3 px-2">166-170</td>
                      <td className="py-3 px-2">51-53</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kaftans Size Chart */}
            <div className="bg-card rounded-lg p-6 sm:p-8 border border-border">
              <h2 className="font-serif text-xl sm:text-2xl mb-6">Kaftans Size Chart</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium">Size</th>
                      <th className="text-left py-3 px-2 font-medium">Bust (cm)</th>
                      <th className="text-left py-3 px-2 font-medium">Length (cm)</th>
                      <th className="text-left py-3 px-2 font-medium">Sleeve (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">XS</td>
                      <td className="py-3 px-2">82-86</td>
                      <td className="py-3 px-2">130-135</td>
                      <td className="py-3 px-2">55-57</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">S</td>
                      <td className="py-3 px-2">87-92</td>
                      <td className="py-3 px-2">136-140</td>
                      <td className="py-3 px-2">58-60</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">M</td>
                      <td className="py-3 px-2">93-98</td>
                      <td className="py-3 px-2">141-145</td>
                      <td className="py-3 px-2">61-63</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">L</td>
                      <td className="py-3 px-2">99-104</td>
                      <td className="py-3 px-2">146-150</td>
                      <td className="py-3 px-2">64-66</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">XL</td>
                      <td className="py-3 px-2">105-110</td>
                      <td className="py-3 px-2">151-155</td>
                      <td className="py-3 px-2">67-69</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2">XXL</td>
                      <td className="py-3 px-2">111-116</td>
                      <td className="py-3 px-2">156-160</td>
                      <td className="py-3 px-2">70-72</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* How to Measure */}
          <div className="mt-12 bg-card rounded-lg p-6 sm:p-8 border border-border">
            <h2 className="font-serif text-xl sm:text-2xl mb-6">How to Measure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">Bust</h3>
                <p className="text-muted-foreground text-sm">
                  Measure around the fullest part of your bust, keeping the tape measure level and comfortable.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">Length</h3>
                <p className="text-muted-foreground text-sm">
                  Measure from the top of your shoulder down to your desired length, typically ankle or floor length.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">Shoulder</h3>
                <p className="text-muted-foreground text-sm">
                  Measure from the edge of one shoulder to the edge of the other, across your upper back.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">Sleeve</h3>
                <p className="text-muted-foreground text-sm">
                  Measure from your shoulder down to your wrist or desired sleeve length.
                </p>
              </div>
            </div>
          </div>

          {/* Size Tips */}
          <div className="mt-12 bg-primary/5 rounded-lg p-6 sm:p-8">
            <h2 className="font-serif text-xl sm:text-2xl mb-6">Size Tips & Recommendations</h2>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">
                  If you're between sizes, we recommend sizing up for a more comfortable fit, especially for abayas.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">
                  Our abayas are designed for a modest, relaxed fit. Consider your preferred style when choosing size.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">
                  Kaftans typically have a more flowing silhouette, so you may prefer your usual size or one size smaller.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground">
                  All measurements are approximate and may vary slightly by design and fabric type.
                </p>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="mt-12 text-center">
            <h2 className="font-serif text-xl sm:text-2xl mb-4">Need Help Finding Your Size?</h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">
              Our customer service team is here to help you find the perfect fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 btn-luxury-primary h-12 px-6 text-sm sm:text-base"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="mailto:modestwayfashion@gmail.com"
                className="inline-flex items-center justify-center gap-2 border border-border bg-card hover:bg-accent h-12 px-6 rounded-md text-sm sm:text-base transition-colors"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SizeGuide;
