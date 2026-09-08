import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ShieldCheck, Lock, Eye, FileText, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Data Protection & Privacy</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Modest Way Fashion ("we", "our", or "us") is dedicated to protecting your privacy and ensuring your personal information is treated with care, transparency, and high security standards in compliance with UAE Data Protection regulations.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Last updated: January 2026 • Governed under the Laws of the United Arab Emirates
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
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                  1. Information We Collect
                </h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                When you visit our website, create an account, place an order, or communicate with our Dubai atelier, we may collect the following categories of personal data:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground list-disc pl-5">
                <li><strong className="text-foreground">Identity & Contact:</strong> Full name, email address, contact phone number, and delivery addresses across UAE emirates and international destinations.</li>
                <li><strong className="text-foreground">Order & Transactional:</strong> Items purchased, sizes, custom tailoring specifications, order history, billing preference, and transaction timestamps.</li>
                <li><strong className="text-foreground">Technical & Browsing:</strong> IP address, device type, browser settings, and interaction logs strictly used to optimize store performance and responsiveness.</li>
                <li><strong className="text-foreground">B2B Wholesale Inquiries:</strong> Commercial registration details, company name, representative contact, and volume requirements.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="bg-card rounded-xl p-6 sm:p-8 border border-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                  2. How We Use Your Information
                </h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We use the collected information solely for legitimate retail and operational purposes, including:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-muted-foreground list-disc pl-5">
                <li>Processing, packing, tailoring, and delivering your online orders to your chosen address.</li>
                <li>Providing real-time order status, courier tracking, and customer service updates.</li>
                <li>Authenticating account access and securing our administrative systems.</li>
                <li>Responding to wholesale quote requests and custom sizing inquiries.</li>
                <li>Complying with UAE commercial accounting, tax, and consumer protection requirements.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="bg-card rounded-xl p-6 sm:p-8 border border-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                  3. Payment Security & Third-Party Processors
                </h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Your payment details are never stored directly on our servers. All online card transactions are processed securely through PCI-DSS certified payment gateways utilizing 256-bit SSL encryption. For Cash on Delivery (COD) orders, payment is handled securely upon physical delivery by our certified courier partners.
              </p>
            </div>

            {/* Section 4 */}
            <div className="bg-card rounded-xl p-6 sm:p-8 border border-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                  4. Your Privacy Rights & Data Requests
                </h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                You have the right to request access to your personal data, update inaccuracies, request deletion of your account, or withdraw marketing consent at any time. To exercise any of these rights, please contact our privacy representative directly.
              </p>
            </div>

            {/* Section 5: Contact */}
            <div className="bg-primary/5 rounded-xl p-6 sm:p-8 border border-primary/20 space-y-4">
              <h3 className="font-serif text-xl text-foreground">Questions Regarding Privacy?</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                For questions regarding this policy or your personal data, reach out to our privacy officer:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <a href="mailto:modestwayfashion@gmail.com" className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>modestwayfashion@gmail.com</span>
                </a>
                <a href="tel:+971556020293" className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+971 55 602 0293</span>
                </a>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Dubai Design District, UAE</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
