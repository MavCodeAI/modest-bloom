import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Truck, Clock, MapPin, Shield, CheckCircle } from 'lucide-react';

const Shipping = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24">
        <div className="luxury-container py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-4">
              <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4">Shipping & Delivery</h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              We deliver modest fashion elegance right to your doorstep. Fast, secure, and reliable shipping across the UAE and beyond.
            </p>
          </div>

          {/* Shipping Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="font-serif text-lg">Standard Delivery</h3>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-2xl font-bold text-primary">AED 50</p>
                <p className="text-muted-foreground text-sm">3-5 business days</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Available across UAE</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Order tracking included</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Free on orders above AED 500</span>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-primary" />
                <h3 className="font-serif text-lg">Express Delivery</h3>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-2xl font-bold text-primary">AED 80</p>
                <p className="text-muted-foreground text-sm">1-2 business days</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Dubai & Sharjah only</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Priority processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Real-time tracking</span>
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="font-serif text-lg">International</h3>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-2xl font-bold text-primary">From AED 150</p>
                <p className="text-muted-foreground text-sm">7-14 business days</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Worldwide delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Customs handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Insurance included</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Delivery Process */}
          <div className="bg-card rounded-lg p-6 sm:p-8 border border-border mb-12">
            <h2 className="font-serif text-xl sm:text-2xl mb-6">Our Delivery Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Order Processing</h3>
                <p className="text-muted-foreground text-sm">
                  Your order is carefully processed and quality checked within 24 hours.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Dispatch</h3>
                <p className="text-muted-foreground text-sm">
                  Your package is handed to our trusted delivery partners with tracking enabled.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Transit</h3>
                <p className="text-muted-foreground text-sm">
                  Your order travels safely to your location with real-time tracking updates.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h3 className="font-medium mb-2">Delivery</h3>
                <p className="text-muted-foreground text-sm">
                  Receive your modest fashion pieces with care and enjoy your new look.
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Guidelines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-card rounded-lg p-6 sm:p-8 border border-border">
              <h2 className="font-serif text-xl sm:text-2xl mb-6">Shipping Guidelines</h2>
              <div className="space-y-4 text-sm sm:text-base">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Secure Packaging</h3>
                    <p className="text-muted-foreground">
                      All items are carefully packaged in premium materials to ensure they arrive in perfect condition.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Delivery Address</h3>
                    <p className="text-muted-foreground">
                      Please provide a complete and accurate address. We're not responsible for deliveries to incorrect addresses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Delivery Times</h3>
                    <p className="text-muted-foreground">
                      Delivery times are estimates and may vary during peak seasons or due to unforeseen circumstances.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 sm:p-8 border border-border">
              <h2 className="font-serif text-xl sm:text-2xl mb-6">Important Notes</h2>
              <div className="space-y-4 text-sm sm:text-base">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Orders placed before 2 PM are processed the same day (excluding weekends and holidays).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    You'll receive tracking details via email once your order is dispatched.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    International orders may be subject to customs duties and taxes.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Someone must be available to receive the package at the delivery address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COD Information */}
          <div className="bg-primary/5 rounded-lg p-6 sm:p-8 mb-12">
            <h2 className="font-serif text-xl sm:text-2xl mb-6">Cash on Delivery (COD)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">Available Areas</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dubai, Abu Dhabi, Sharjah</li>
                  <li>• Ajman, Umm Al Quwain, Ras Al Khaimah</li>
                  <li>• Fujairah and selected international locations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">COD Fee</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AED 20 additional fee applies</li>
                  <li>• Exact amount required at delivery</li>
                  <li>• Package opened before payment confirmation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center">
            <h2 className="font-serif text-xl sm:text-2xl mb-4">Shipping Questions?</h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">
              Our customer service team is here to help with any shipping inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 btn-luxury-primary h-12 px-6 text-sm sm:text-base"
              >
                Contact Support
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

export default Shipping;
