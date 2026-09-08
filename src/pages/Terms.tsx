import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Scale, CheckCircle2, AlertCircle, ShoppingBag, Truck, RotateCcw, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />
      <CartDrawer />

      <main className="pt-20 sm:pt-24 md:pt-28">
        {/* Header */}
        <section className="py-16 md:py-20 border-b border-border/60 bg-card/40">
          <div className="luxury-container">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <Scale className="w-3.5 h-3.5" />
                <span>Legal & Consumer Terms</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
                Terms of Service
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Welcome to Modest Way Fashion. These Terms and Conditions govern your access to and use of our website, bespoke tailoring services, retail store, and B2B wholesale platform.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Effective Date: January 2026 • Jurisdiction: Dubai, United Arab Emirates
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="luxury-container max-w-4xl space-y-10">
            {/* Section 1 */}
            <div className="bg-card rounded-xl p-6 sm:p-8 border border-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                  1. Products, Pricing & Availability
                </h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                All prices on Modest Way Fashion are listed in United Arab Emirates Dirhams (AED) and are inclusive of standard applicable VAT where required by UAE law.
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground list-disc pl-5">
                <li>We make every effort to display accurate colorways, fabric textures, and sizing details. However, variations may occur due to device screen calibrations and artisanal dye lots.</li>
                <li>Product availability is subject to change. In the unlikely event an ordered item is out of stock, our customer concierge will contact you immediately for an alternative or full immediate refund.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="bg-card rounded-xl p-6 sm:p-8 border border-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                  2. Orders, Shipping & Cash on Delivery
                </h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Once an order is confirmed, dispatch is scheduled across all 7 Emirates (Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain) as well as international destinations.
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground list-disc pl-5">
                <li><strong className="text-foreground">Standard Delivery:</strong> 3–5 business days across the UAE (AED 50 standard fee, free above AED 500).</li>
                <li><strong className="text-foreground">Express Delivery:</strong> 1–2 business days for Dubai & Sharjah (AED 80 fee).</li>
                <li><strong className="text-foreground">Cash on Delivery (COD):</strong> Requires a valid UAE contact number and exact cash payable to the courier upon delivery (AED 20 COD handling fee).</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="bg-card rounded-xl p-6 sm:p-8 border border-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                  3. Return & Exchange Policy
                </h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We accept returns and exchanges within 14 calendar days of receipt for unused items in their original packaging with security tags attached.
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground list-disc pl-5">
                <li>Items that have been worn, altered, washed, or damaged post-delivery are not eligible for return.</li>
                <li>Custom-tailored bespoke abayas or custom-altered lengths are non-refundable unless there is an evident manufacturing defect.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="bg-card rounded-xl p-6 sm:p-8 border border-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                  4. Governing Law & Dispute Resolution
                </h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the federal laws of the United Arab Emirates and the local laws applicable in the Emirate of Dubai. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts in Dubai, UAE.
              </p>
            </div>

            {/* Contact Support */}
            <div className="bg-muted/40 rounded-xl p-6 sm:p-8 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-1">Need Clarification?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Our customer concierge in Dubai is available 7 days a week.</p>
              </div>
              <div className="flex gap-3">
                <Link to="/contact">
                  <button className="btn-luxury-primary px-5 py-2.5 text-sm font-medium rounded-md">
                    Contact Concierge
                  </button>
                </Link>
                <Link to="/faq">
                  <button className="border border-border bg-card hover:bg-accent px-5 py-2.5 text-sm font-medium rounded-md transition-colors">
                    View FAQ
                  </button>
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

export default Terms;
