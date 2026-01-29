import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Building2, Package, Globe, Truck, Award, Users, Sparkles, Shield, Clock, Mail, Phone, MessageCircle } from 'lucide-react';
import { FaStore, FaBoxOpen, FaGlobeAmericas, FaShippingFast, FaAward, FaUsers, FaShieldAlt, FaClock, FaEnvelope, FaPhoneAlt, FaComments, FaIndustry } from 'react-icons/fa';
import { RiHandHeartLine } from 'react-icons/ri';
import { AiOutlineSafety } from 'react-icons/ai';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateWholesaleQuote } from '@/hooks/useWholesaleQuotes';
import { useToast } from '@/hooks/use-toast';

const quoteSchema = z.object({
  businessName: z.string().min(2, 'Business name required'),
  contactPerson: z.string().min(2, 'Contact person required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Valid phone required'),
  region: z.string().min(1, 'Region required'),
  volume: z.string().min(1, 'Volume required'),
  message: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const features = [
  {
    icon: FaIndustry,
    title: 'Manufacturing Excellence',
    description: 'State-of-the-art facility in Dubai with 500+ skilled artisans and modern equipment.',
  },
  {
    icon: FaBoxOpen,
    title: 'Bulk Orders',
    description: 'Minimum order quantity of just 50 pieces per design with flexible sizing options.',
  },
  {
    icon: FaGlobeAmericas,
    title: 'Global Shipping',
    description: 'We ship to 50+ countries via DHL, FedEx & Aramex with full tracking.',
  },
  {
    icon: RiHandHeartLine,
    title: 'Exclusive Collections',
    description: 'Early access to new drops and limited editions before retail launch.',
  },
  {
    icon: FaUsers,
    title: 'Dedicated Support',
    description: 'Personal account manager available via WhatsApp for instant support.',
  },
  {
    icon: AiOutlineSafety,
    title: 'Quality Guarantee',
    description: 'All pieces handcrafted in UAE with premium fabrics and finishes.',
  },
];

const benefits = [
  {
    icon: FaBoxOpen,
    title: 'Low MOQ',
    description: 'Start with as few as 10 pieces per style. Perfect for boutiques of any size.',
  },
  {
    icon: FaShippingFast,
    title: 'Priority Fulfillment',
    description: 'Dedicated logistics team ensures your orders ship within 3-5 business days.',
  },
  {
    icon: FaGlobeAmericas,
    title: 'Global Shipping',
    description: 'We ship to 50+ countries via DHL, FedEx & Aramex with full tracking.',
  },
  {
    icon: RiHandHeartLine,
    title: 'Exclusive Collections',
    description: 'Early access to new drops and limited editions before retail launch.',
  },
  {
    icon: FaUsers,
    title: 'Dedicated Support',
    description: 'Personal account manager available via WhatsApp for instant support.',
  },
  {
    icon: FaShieldAlt,
    title: 'Quality Guarantee',
    description: 'All pieces handcrafted in UAE with premium fabrics and finishes.',
  },
];

const stats = [
  { value: '200+', label: 'Retail Partners' },
  { value: '35', label: 'Countries' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '48h', label: 'Response Time' },
];

const Wholesale = () => {
  const { toast } = useToast();
  const createQuote = useCreateWholesaleQuote();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteFormData) => {
    try {
      await createQuote.mutateAsync({
        business_name: data.businessName,
        contact_name: data.contactPerson,
        email: data.email,
        phone: data.phone,
        country: data.region,
        message: data.message || null,
        products: [],
        status: 'pending',
      });

      toast({
        title: 'Quote Request Submitted! ✨',
        description: 'Our wholesale team will contact you within 24 hours.',
      });

      reset();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      
      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative py-32 md:py-40 lg:py-48 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1920&q=80"
              alt="Wholesale showroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>

          <div className="relative luxury-container">
            <div className="max-w-2xl animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-primary text-sm font-medium uppercase tracking-wider">
                  Wholesale Partnership
                </span>
              </div>
              
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
                Partner With<br />
                <span className="text-gradient-purple italic">Modest Way Fashion</span>
              </h1>
              
              <p className="text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
                Bring premium UAE-made Abayas to your boutique. Enjoy exclusive pricing, 
                priority access, and dedicated support for your business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#apply">
                  <Button className="btn-luxury-primary group h-14 px-8 text-base">
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
                <Link to="/wholesale/catalog">
                  <Button variant="outline" className="btn-luxury-outline h-14 px-8 text-base">
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-12 bg-primary/5 border-y border-primary/10">
          <div className="luxury-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="font-serif text-4xl md:text-5xl text-primary mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 md:py-32">
          <div className="luxury-container">
            <div className="text-center mb-16 md:mb-20">
              <p className="text-primary text-sm font-medium uppercase tracking-[0.3em] mb-4">
                Why Choose Us
              </p>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Partner Benefits</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join our exclusive wholesale network and experience the <span className="text-gradient-pink">Modest Way Fashion</span> difference.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {benefits.map((benefit, index) => {
                const colorClasses = [
                  'hover:border-purple-primary/30 hover:shadow-purple-primary/5',
                  'hover:border-pink-rose/30 hover:shadow-pink-rose/5', 
                  'hover:border-blue-sky/30 hover:shadow-blue-sky/5'
                ];
                const iconColors = [
                  'text-purple-primary',
                  'text-pink-rose',
                  'text-blue-sky'
                ];
                const bgColors = [
                  'bg-purple-primary/10 hover:bg-purple-primary/20',
                  'bg-pink-rose/10 hover:bg-pink-rose/20',
                  'bg-blue-sky/10 hover:bg-blue-sky/20'
                ];
                
                return (
                  <div
                    key={benefit.title}
                    className={`group p-8 rounded-2xl bg-card border border-border/50 transition-all duration-500 animate-fade-in hover:shadow-xl ${colorClasses[index % 3]}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${bgColors[index % 3]}`}>
                      <benefit.icon className={`h-7 w-7 ${iconColors[index % 3]}`} />
                    </div>
                    <h3 className="font-serif text-xl mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 md:py-32 bg-card">
          <div className="luxury-container">
            <div className="text-center mb-16 md:mb-20">
              <p className="text-primary text-sm font-medium uppercase tracking-[0.3em] mb-4">
                Simple Process
              </p>
              <h2 className="font-serif text-4xl md:text-5xl">How It Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { step: '01', title: 'Submit Inquiry', desc: 'Fill out our simple form with your business details and requirements.' },
                { step: '02', title: 'Get Your Quote', desc: 'Our team reviews your request and sends a custom pricing proposal.' },
                { step: '03', title: 'Start Ordering', desc: 'Approve the quote and place your first wholesale order with us.' },
              ].map((item, index) => (
                <div 
                  key={item.step} 
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 mb-6">
                    <span className="font-serif text-3xl text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Abayas Section */}
        <section className="py-24 md:py-32 bg-card">
          <div className="luxury-container">
            <div className="text-center mb-16 md:mb-20">
              <p className="text-primary text-sm font-medium uppercase tracking-[0.3em] mb-4">
                Our Collection
              </p>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Featured Wholesale Abayas</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Premium quality abayas crafted with finest fabrics. Available for bulk orders with competitive pricing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  image: '/images/wholesale-abaya-1.jpeg',
                  title: 'Classic Black Abaya',
                  description: 'Elegant wrap-style abaya in premium matte crepe fabric',
                  price: 'From AED 180',
                  moq: 'MOQ: 10 pieces'
                },
                {
                  image: '/images/wholesale-abaya-2.jpeg',
                  title: 'Navy Embroidered Kaftan',
                  description: 'Luxurious navy kaftan with intricate gold embroidery details',
                  price: 'From AED 320',
                  moq: 'MOQ: 10 pieces'
                },
                {
                  image: '/images/wholesale-abaya-3.jpeg',
                  title: 'Emerald Heritage Abaya',
                  description: 'Rich emerald green with traditional hand-embroidered patterns',
                  price: 'From AED 380',
                  moq: 'MOQ: 10 pieces'
                }
              ].map((abaya, index) => (
                <div 
                  key={abaya.title}
                  className="group bg-background rounded-2xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-500 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src={abaya.image} 
                      alt={abaya.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl mb-2">{abaya.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{abaya.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold">{abaya.price}</span>
                      <span className="text-xs text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">{abaya.moq}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/wholesale/catalog">
                <Button variant="outline" className="btn-luxury-outline">
                  View Full Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Sample Review Section */}
        <section className="py-24 md:py-32 bg-primary/5">
          <div className="luxury-container">
            <div className="text-center mb-16 md:mb-20">
              <p className="text-primary text-sm font-medium uppercase tracking-[0.3em] mb-4">
                Quality Assurance
              </p>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Review Your Sample</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our team will send you a comprehensive video of your sample piece for any notes and final amendments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  icon: Package,
                  title: 'Sample Creation',
                  desc: 'We create a sample piece based on your selected design and customizations.',
                  color: 'purple'
                },
                {
                  icon: MessageCircle,
                  title: 'Video Review',
                  desc: 'Receive a detailed video showcasing your sample from all angles with close-up details.',
                  color: 'pink'
                },
                {
                  icon: Sparkles,
                  title: 'Final Amendments',
                  desc: 'Share your feedback and we\'ll make any necessary adjustments before bulk production.',
                  color: 'blue'
                }
              ].map((item, index) => {
                const colorConfig = {
                  purple: {
                    bg: 'bg-purple-primary/10 hover:bg-purple-primary/20',
                    text: 'text-purple-primary',
                    border: 'border-purple-primary/30'
                  },
                  pink: {
                    bg: 'bg-pink-rose/10 hover:bg-pink-rose/20',
                    text: 'text-pink-rose',
                    border: 'border-pink-rose/30'
                  },
                  blue: {
                    bg: 'bg-blue-sky/10 hover:bg-blue-sky/20',
                    text: 'text-blue-sky',
                    border: 'border-blue-sky/30'
                  }
                };
                
                const config = colorConfig[item.color as keyof typeof colorConfig];
                
                return (
                  <div 
                    key={item.title} 
                    className="text-center animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className={`w-16 h-16 rounded-full ${config.bg} flex items-center justify-center mx-auto mb-6 transition-colors duration-300`}>
                      <item.icon className={`h-8 w-8 ${config.text}`} />
                    </div>
                    <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-background border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">100% Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply" className="py-24 md:py-32">
          <div className="luxury-container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Left - Form */}
              <div className="animate-fade-in">
                <p className="text-primary text-sm font-medium uppercase tracking-[0.3em] mb-4">
                  Get Started
                </p>
                <h2 className="font-serif text-4xl md:text-5xl mb-6">
                  Request a Quote
                </h2>
                <p className="text-muted-foreground text-lg mb-10">
                  Fill out the form and our wholesale team will get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-sm font-medium">Business Name *</Label>
                      <Input
                        id="businessName"
                        {...register('businessName')}
                        className="h-12 bg-card border-border/50 focus:border-primary"
                        placeholder="Your boutique name"
                      />
                      {errors.businessName && (
                        <p className="text-destructive text-sm">{errors.businessName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson" className="text-sm font-medium">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        {...register('contactPerson')}
                        className="h-12 bg-card border-border/50 focus:border-primary"
                        placeholder="Full name"
                      />
                      {errors.contactPerson && (
                        <p className="text-destructive text-sm">{errors.contactPerson.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="h-12 bg-card border-border/50 focus:border-primary"
                        placeholder="business@example.com"
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        className="h-12 bg-card border-border/50 focus:border-primary"
                        placeholder="+971 50 000 0000"
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Region *</Label>
                      <Select onValueChange={(value) => setValue('region', value)}>
                        <SelectTrigger className="h-12 bg-card border-border/50">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="uae">UAE</SelectItem>
                          <SelectItem value="gcc">GCC (Saudi, Qatar, Kuwait, Bahrain, Oman)</SelectItem>
                          <SelectItem value="mena">MENA Region</SelectItem>
                          <SelectItem value="asia">Asia Pacific</SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="americas">Americas</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.region && (
                        <p className="text-destructive text-sm">{errors.region.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Expected Volume *</Label>
                      <Select onValueChange={(value) => setValue('volume', value)}>
                        <SelectTrigger className="h-12 bg-card border-border/50">
                          <SelectValue placeholder="Select volume" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10-50">10-50 pieces</SelectItem>
                          <SelectItem value="51-100">51-100 pieces</SelectItem>
                          <SelectItem value="101-500">101-500 pieces</SelectItem>
                          <SelectItem value="500+">500+ pieces</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.volume && (
                        <p className="text-destructive text-sm">{errors.volume.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">Additional Message</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      className="min-h-[120px] bg-card border-border/50 focus:border-primary resize-none"
                      placeholder="Tell us about your boutique, target customers, and any specific requirements..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-luxury-primary h-14 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </div>

              {/* Right - Contact Info */}
              <div className="lg:pl-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="sticky top-32">
                  <div className="p-8 md:p-10 rounded-2xl bg-card border border-border/50">
                    <h3 className="font-serif text-2xl mb-6">Contact Us Directly</h3>
                    <p className="text-muted-foreground mb-8">
                      Prefer to speak with us directly? Reach out through any of these channels.
                    </p>

                    <div className="space-y-6">
                      <a 
                        href="mailto:modestwayfashion@gmail.com"
                        className="flex items-center gap-4 p-4 rounded-xl bg-background hover:bg-primary/5 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">modestwayfashion@gmail.com</p>
                        </div>
                      </a>

                      <a 
                        href="tel:+971556020293"
                        className="flex items-center gap-4 p-4 rounded-xl bg-background hover:bg-primary/5 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">+971 55 602 0293</p>
                        </div>
                      </a>

                      <a 
                        href="https://wa.me/971556020293"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl bg-background hover:bg-primary/5 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <MessageCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">WhatsApp</p>
                          <p className="font-medium">+971 55 602 0293</p>
                        </div>
                      </a>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border/50">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Response within 24 hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-6 p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                    <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-serif text-lg mb-1">Trusted by 200+ Boutiques</p>
                    <p className="text-sm text-muted-foreground">Across 35 countries worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog CTA */}
        <section className="py-24 md:py-32 bg-card">
          <div className="luxury-container">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80"
                  alt="Catalog preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
              </div>
              
              <div className="relative p-12 md:p-20">
                <div className="max-w-xl">
                  <p className="text-primary text-sm font-medium uppercase tracking-[0.3em] mb-4">
                    Explore Our Range
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl mb-6">
                    Browse Wholesale Catalog
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8">
                    View our complete collection of wholesale-eligible products. 
                    Custom pricing available upon request.
                  </p>
                  <Link to="/wholesale/catalog">
                    <Button className="btn-luxury-primary group h-14 px-8">
                      View Full Catalog
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
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

export default Wholesale;
