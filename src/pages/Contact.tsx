import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Message Received',
      description: 'Our customer care team in Dubai will respond within 24 hours.',
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />
      
      <main className="pt-16 md:pt-24">
        {/* Header */}
        <section className="py-16 md:py-24 border-b border-border/60 bg-card/40">
          <div className="luxury-container">
            <div className="max-w-2xl">
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                Customer Care & Atelier Inquiries
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
                Contact Modest Way Fashion
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Whether you need advice on abaya sizing, order tracking, custom tailoring specifications, or wholesale partnership inquiries, our Dubai team is here to assist.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="luxury-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Contact Information & Channels */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 sm:p-8 rounded-xl bg-card border border-border/70 space-y-6">
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-foreground mb-1">Direct Channels</h2>
                    <p className="text-xs text-muted-foreground">Reach our support and atelier staff directly.</p>
                  </div>

                  <div className="space-y-4">
                    <a 
                      href="https://wa.me/971556020293" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-3.5 rounded-lg border border-border/60 hover:bg-background transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">WhatsApp Assistance</p>
                        <p className="text-sm font-semibold text-foreground">+971 55 602 0293</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Quickest for sizing & order updates</p>
                      </div>
                    </a>

                    <a 
                      href="tel:+971556020293"
                      className="flex items-start gap-4 p-3.5 rounded-lg border border-border/60 hover:bg-background transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">Phone Support</p>
                        <p className="text-sm font-semibold text-foreground">+971 55 602 0293</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Sun – Thu: 9:00 AM – 6:00 PM (GST)</p>
                      </div>
                    </a>

                    <a 
                      href="mailto:modestwayfashion@gmail.com"
                      className="flex items-start gap-4 p-3.5 rounded-lg border border-border/60 hover:bg-background transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">Email Inquiries</p>
                        <p className="text-sm font-semibold text-foreground truncate">modestwayfashion@gmail.com</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Responses within 24 hours</p>
                      </div>
                    </a>

                    <div className="flex items-start gap-4 p-3.5 rounded-lg border border-border/60 bg-background/50">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">Atelier Location</p>
                        <p className="text-sm font-semibold text-foreground">Dubai Design District</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Building 7, Dubai, United Arab Emirates</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operating Schedule */}
                <div className="p-6 rounded-xl bg-card border border-border/70 space-y-3">
                  <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Atelier & Office Hours</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Sunday – Thursday</span>
                      <span className="font-medium text-foreground">9:00 AM – 6:00 PM (GST)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Friday</span>
                      <span className="font-medium text-foreground">2:00 PM – 7:00 PM (GST)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium text-foreground">Closed for atelier inventory</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-7">
                <div className="p-6 sm:p-8 md:p-10 rounded-xl bg-card border border-border/70">
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">Send a Direct Inquiry</h2>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    Leave your contact details and message below. We will get back to you promptly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wider">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="h-11 bg-background border-border"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="h-11 bg-background border-border"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider">Phone / WhatsApp</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="h-11 bg-background border-border"
                          placeholder="+971 50 000 0000"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider">Inquiry Topic *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="h-11 bg-background border-border"
                          placeholder="e.g. Sizing query, Wholesale, Order status"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-medium uppercase tracking-wider">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="min-h-[140px] bg-background border-border resize-none text-sm"
                        placeholder="Please write your questions or order notes..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-luxury-primary h-12 text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending Inquiry...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
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

export default Contact;
