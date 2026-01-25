import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, Phone, MapPin, MessageSquare, Clock, Send } from 'lucide-react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaComments, FaClock, FaPaperPlane, FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
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
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Message Sent!',
      description: 'We\'ll get back to you within 24 hours.',
    });

    // Reset form
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24">
        <div className="luxury-container py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-4">
              <FaComments className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              We're here to help with your modest fashion needs. Reach out to us for any questions, concerns, or styling advice.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="font-serif text-xl mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaPhoneAlt className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        +971 55 602 0293
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Sunday - Thursday: 9 AM - 6 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        modestwayfashion@gmail.com
                      </p>
                      <p className="text-muted-foreground text-xs">
                        We respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Visit Us</h3>
                      <p className="text-muted-foreground text-sm">
                        Dubai Design District<br />
                        Building 7, Dubai, UAE
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="font-serif text-xl mb-4">Business Hours</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monday - Thursday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Friday</span>
                    <span>2:00 PM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saturday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-6">
                <h2 className="font-serif text-xl mb-4">Quick Responses</h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Email responses within 24 hours</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Phone support during business hours</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>WhatsApp support available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 sm:p-8 border border-border">
                <h2 className="font-serif text-xl sm:text-2xl mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 h-11"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 h-11"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 h-11"
                        placeholder="+971 XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-sm">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="mt-1 h-11"
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="mt-1 min-h-[120px]"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">Popular Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Order Status', 'Size Guide', 'Shipping Info', 'Returns', 'Product Info', 'Wholesale'].map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            subject: topic,
                            message: `I would like to inquire about ${topic}.` 
                          }))}
                          className="px-3 py-1 bg-background border border-border rounded-md text-xs hover:bg-accent transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-luxury-primary h-12 text-sm sm:text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <MdSend className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* FAQ Preview */}
              <div className="mt-8 bg-card rounded-lg p-6 border border-border">
                <h2 className="font-serif text-xl mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">How do I track my order?</h3>
                    <p className="text-muted-foreground text-sm">
                      You'll receive tracking details via email once your order is dispatched. Use the tracking number on our website or the courier's site.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">What is your return policy?</h3>
                    <p className="text-muted-foreground text-sm">
                      We offer 14-day returns for unworn items with original tags. See our Returns page for complete details.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Do you offer international shipping?</h3>
                    <p className="text-muted-foreground text-sm">
                      Yes, we ship worldwide. Shipping costs and delivery times vary by location.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/faq"
                    className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    View all FAQs →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-12 text-center">
            <h2 className="font-serif text-xl sm:text-2xl mb-6">Connect With Us</h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">
              Follow us on social media for the latest modest fashion trends and exclusive offers.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.instagram.com/modest_way_fashion?igsh=OXkzb3k1aWd0ZHl4&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1C4XdXZDWi/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@modestwayfashion?_r=1&_t=ZS-93Knz5mBfZY"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/971556020293"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
