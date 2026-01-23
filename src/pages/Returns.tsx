import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RefreshCw, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Returns = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24">
        <div className="luxury-container py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-4">
              <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4">Returns & Exchanges</h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              We want you to love your modest fashion pieces. If you're not completely satisfied, our hassle-free return policy ensures you can shop with confidence.
            </p>
          </div>

          {/* Return Policy Overview */}
          <div className="bg-card rounded-lg p-6 sm:p-8 border border-border mb-12">
            <h2 className="font-serif text-xl sm:text-2xl mb-6">Our Return Policy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-lg mb-2">14-Day Window</h3>
                <p className="text-muted-foreground text-sm">
                  Return or exchange within 14 days of delivery
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-lg mb-2">Original Condition</h3>
                <p className="text-muted-foreground text-sm">
                  Items must be unworn, unwashed, and with tags attached
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-lg mb-2">Full Refund</h3>
                <p className="text-muted-foreground text-sm">
                  Complete refund or exchange for eligible items
                </p>
              </div>
            </div>
          </div>

          {/* Return Eligibility */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-card rounded-lg p-6 sm:p-8 border border-border">
              <h2 className="font-serif text-xl sm:text-2xl mb-6">Eligible for Return</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Wrong Size or Fit</h3>
                    <p className="text-muted-foreground text-sm">
                      If the size doesn't fit as expected, we'll help you find the perfect match.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Manufacturing Defects</h3>
                    <p className="text-muted-foreground text-sm">
                      Quality issues or defects are covered under our warranty.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Wrong Item Delivered</h3>
                    <p className="text-muted-foreground text-sm">
                      If you receive a different item than ordered, we'll correct it immediately.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Damaged in Transit</h3>
                    <p className="text-muted-foreground text-sm">
                      Items damaged during delivery are eligible for return or exchange.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 sm:p-8 border border-border">
              <h2 className="font-serif text-xl sm:text-2xl mb-6">Non-Returnable Items</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Worn or Used Items</h3>
                    <p className="text-muted-foreground text-sm">
                      Items showing signs of wear, stains, or alterations cannot be returned.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Missing Tags or Labels</h3>
                    <p className="text-muted-foreground text-sm">
                      Returns must include all original tags, labels, and packaging.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">After 14 Days</h3>
                    <p className="text-muted-foreground text-sm">
                      Returns beyond the 14-day window cannot be accepted.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Final Sale Items</h3>
                    <p className="text-muted-foreground text-sm">
                      Items marked as final sale are not eligible for return or exchange.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-card rounded-lg p-6 sm:p-8 border border-border mb-12">
            <h2 className="font-serif text-xl sm:text-2xl mb-6">How to Return</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Contact Us</h3>
                <p className="text-muted-foreground text-sm">
                  Email or call our customer service to initiate your return.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Package Item</h3>
                <p className="text-muted-foreground text-sm">
                  Pack the item securely with all tags and original packaging.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Ship to Us</h3>
                <p className="text-muted-foreground text-sm">
                  Send the package to our returns center using the provided address.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h3 className="font-medium mb-2">Get Refund</h3>
                <p className="text-muted-foreground text-sm">
                  Once approved, your refund will be processed within 5-7 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Exchange Information */}
          <div className="bg-primary/5 rounded-lg p-6 sm:p-8 mb-12">
            <h2 className="font-serif text-xl sm:text-2xl mb-6">Exchanges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">Exchange Process</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Same 14-day return policy applies</li>
                  <li>• Exchange for different size or color of same item</li>
                  <li>• Price differences will be charged or refunded</li>
                  <li>• Subject to item availability</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">Exchange Shipping</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Free exchange shipping for UAE customers</li>
                  <li>• International customers pay return shipping</li>
                  <li>• New item ships once return is received</li>
                  <li>• Express exchange available for AED 30</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-card rounded-lg p-6 sm:p-8 border border-border mb-12">
            <h2 className="font-serif text-xl sm:text-2xl mb-6">Refund Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">Refund Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Original Payment Method</h4>
                      <p className="text-muted-foreground text-sm">
                        Refunds are processed to your original payment method.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Store Credit</h4>
                      <p className="text-muted-foreground text-sm">
                        Opt for store credit and receive 5% bonus value.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">Refund Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Processing Time</h4>
                      <p className="text-muted-foreground text-sm">
                        5-7 business days after we receive your return.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Bank Processing</h4>
                      <p className="text-muted-foreground text-sm">
                        Additional 3-5 business days for bank processing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-12">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-lg mb-3">Important Notes</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Return shipping costs are the customer's responsibility unless the item is defective.</li>
                  <li>• We recommend using a trackable shipping service for returns.</li>
                  <li>• Modest Way reserves the right to deny returns that don't meet our policy requirements.</li>
                  <li>• Custom orders and personalized items cannot be returned.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center">
            <h2 className="font-serif text-xl sm:text-2xl mb-4">Need Help with Returns?</h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">
              Our customer service team is ready to assist you with any return or exchange inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 btn-luxury-primary h-12 px-6 text-sm sm:text-base"
              >
                Start Return Process
              </a>
              <a
                href="mailto:modestwayfashion@gmail.com"
                className="inline-flex items-center justify-center gap-2 border border-border bg-card hover:bg-accent h-12 px-6 rounded-md text-sm sm:text-base transition-colors"
              >
                Email Support
              </a>
              <a
                href="tel:+971556020293"
                className="inline-flex items-center justify-center gap-2 border border-border bg-card hover:bg-accent h-12 px-6 rounded-md text-sm sm:text-base transition-colors"
              >
                Call +971 55 602 0293
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Returns;
