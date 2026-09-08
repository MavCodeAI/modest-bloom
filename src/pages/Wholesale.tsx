import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowRight, 
  Building2, 
  Package, 
  Globe, 
  Truck, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Mail, 
  Phone, 
  MessageCircle,
  Video,
  FileCheck
} from 'lucide-react';
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

const partnerAssurances = [
  {
    icon: Package,
    title: 'Low Minimum Quantities',
    description: 'Order from 12 pieces per colorway with flexible size breakdowns across sizes 50 to 60.',
  },
  {
    icon: Truck,
    title: 'Express Dispatch',
    description: 'Standard orders dispatched within 7–8 business days via DHL, FedEx, and Aramex.',
  },
  {
    icon: Layers,
    title: 'Direct UAE Tailoring',
    description: 'Crafted with premium Korean Nida, textured crepes, and precision stitching in Dubai.',
  },
  {
    icon: Video,
    title: 'Pre-Production Video Review',
    description: 'Receive full 360-degree video inspection of sample pieces for approval before cutting.',
  },
  {
    icon: MessageCircle,
    title: 'Direct Atelier WhatsApp',
    description: 'One-on-one communication with our Dubai team for rapid sizing and custom adjustments.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Verification',
    description: 'Rigorous seam, hem, and hardware inspection on every piece prior to international export.',
  },
];

const Wholesale = () => {
  const { toast } = useToast();
  const createQuote = useCreateWholesaleQuote();
  const [selectedVolumeTier, setSelectedVolumeTier] = useState<number>(36);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const tiers = [
    { qty: 12, label: '12 Pcs (Starter)', estRate: 'AED 185 – 220', markup: '2.5x MSRP', leadTime: '6–7 Days', customLabels: 'Standard Modest Way tags', sampleReview: 'Photo & Video' },
    { qty: 36, label: '36 Pcs (Boutique)', estRate: 'AED 165 – 195', markup: '2.8x MSRP', leadTime: '7–8 Days', customLabels: 'Free Woven Labels', sampleReview: '360° Live Video' },
    { qty: 72, label: '72 Pcs (Retailer)', estRate: 'AED 145 – 175', markup: '3.0x MSRP', leadTime: '8–10 Days', customLabels: 'Custom Branding & Tags', sampleReview: 'Physical Sample + Video' },
    { qty: 150, label: '150+ Pcs (Enterprise)', estRate: 'AED 125 – 155', markup: '3.5x MSRP', leadTime: '10–12 Days', customLabels: 'Full Custom Packaging', sampleReview: 'Full Sample Suite' },
  ];

  const currentTier = tiers.find(t => t.qty === selectedVolumeTier) || tiers[1];

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
        title: 'Quote Request Received',
        description: 'Our wholesale team in Dubai will review your requirements and respond within 24 hours.',
      });

      reset();
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />
      <CartDrawer />
      
      <main className="pt-16 md:pt-24">
        {/* Editorial Hero Header */}
        <section className="relative py-20 md:py-28 lg:py-32 border-b border-border/60 bg-card/40">
          <div className="luxury-container">
            <div className="max-w-3xl">
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-4">
                B2B & Boutique Partnerships
              </p>
              
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl mb-6 leading-tight text-foreground">
                Wholesale Abayas & Custom Atelier Production
              </h1>
              
              <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-8 leading-relaxed">
                Supply your boutique with authentic UAE-tailored modest wear. We offer manageable minimum order quantities, private labeling, custom sizing, and worldwide courier logistics.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <a href="#apply">
                  <Button className="btn-luxury-primary h-12 px-8 text-base shadow-sm">
                    Request Pricing Proposal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a
                  href={`https://wa.me/971556020293?text=${encodeURIComponent(
                    "Hi Modest Way Fashion Dubai, I am a boutique buyer interested in receiving your latest Wholesale Abaya Linesheet, MOQ terms, and sample availability."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="h-12 px-6 text-sm font-medium border-border/80 bg-background/50 hover:bg-background text-foreground transition-colors flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Inquire via WhatsApp B2B</span>
                  </Button>
                </a>
                <Link to="/wholesale/catalog">
                  <Button variant="ghost" className="h-12 px-5 text-sm font-medium text-muted-foreground hover:text-foreground">
                    Browse B2B Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Wholesale Terms Bar */}
        <section className="py-8 bg-card border-b border-border/60">
          <div className="luxury-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div className="border-l-2 border-primary/40 pl-4">
                <p className="font-serif text-2xl font-bold text-foreground">12 Pcs</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Low MOQ per Color</p>
              </div>
              <div className="border-l-2 border-primary/40 pl-4">
                <p className="font-serif text-2xl font-bold text-foreground">7–8 Days</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Production Lead Time</p>
              </div>
              <div className="border-l-2 border-primary/40 pl-4">
                <p className="font-serif text-2xl font-bold text-foreground">50–60"</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Standard Length Range</p>
              </div>
              <div className="border-l-2 border-primary/40 pl-4">
                <p className="font-serif text-2xl font-bold text-foreground">24 Hours</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Quote Turnaround</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 md:py-28">
          <div className="luxury-container">
            <div className="max-w-2xl mb-16">
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-2">
                Program Overview
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Built for Independent Boutiques & Global Retailers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerAssurances.map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-xl bg-card border border-border/70 hover:border-border transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Volume Tier & Margin Simulator */}
        <section className="py-16 md:py-24 bg-card/60 border-y border-border/60">
          <div className="luxury-container">
            <div className="max-w-3xl mb-12">
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-2">
                Transparent Volume Pricing
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Boutique Tier & Margin Simulator
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Select your intended opening order volume to view estimated piece rates, lead times, private label inclusions, and retail margin potential.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Tier Selection Buttons */}
              <div className="lg:col-span-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Select Order Tier:
                </p>
                {tiers.map((t) => (
                  <button
                    key={t.qty}
                    type="button"
                    onClick={() => setSelectedVolumeTier(t.qty)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      selectedVolumeTier === t.qty
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-background hover:border-foreground/40'
                    }`}
                  >
                    <div>
                      <p className={`font-semibold text-sm ${selectedVolumeTier === t.qty ? 'text-primary' : 'text-foreground'}`}>
                        {t.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Estimated Rate: {t.estRate}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      selectedVolumeTier === t.qty ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {t.markup}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tier Details Card */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-background border border-primary/20 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Active Selection</span>
                    <h3 className="font-serif text-2xl font-bold text-foreground">{currentTier.label}</h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">Estimated Wholesale Rate</p>
                    <p className="text-xl font-serif font-bold text-primary">{currentTier.estRate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-lg bg-card border border-border/60">
                    <p className="text-xs text-muted-foreground">Lead Time</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{currentTier.leadTime}</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-card border border-border/60">
                    <p className="text-xs text-muted-foreground">Branding / Labels</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{currentTier.customLabels}</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-card border border-border/60 col-span-2 sm:col-span-1">
                    <p className="text-xs text-muted-foreground">Sample Verification</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{currentTier.sampleReview}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 text-xs text-muted-foreground space-y-1.5">
                  <p className="font-semibold text-foreground">💡 Wholesale Atelier Advantage:</p>
                  <p>All pieces are cut from Grade-A Korean Nida and Japanese crepe fabrics in Dubai with custom length grading (50" to 60") and express worldwide air courier.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a href="#apply" className="flex-1">
                    <Button className="w-full btn-luxury-primary h-11 text-xs sm:text-sm font-semibold">
                      Lock In This Tier Proposal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/971556020293?text=${encodeURIComponent(
                      `Hi Modest Way Fashion Dubai, I am interested in placing an order in the *${currentTier.label}* (${currentTier.estRate}). Can we discuss linesheet styles and lead time?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full sm:w-auto h-11 px-4 text-xs font-semibold flex items-center gap-2 border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Discuss on WhatsApp</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Production Workflow */}
        <section className="py-20 md:py-28 bg-card border-y border-border/60">
          <div className="luxury-container">
            <div className="max-w-2xl mb-16">
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-2">
                How It Works
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                From Inquiry to Delivery
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: FileCheck,
                  step: 'Step 1', 
                  title: 'Submit Inquiry', 
                  desc: 'Share your boutique details, target quantities, and desired styles.' 
                },
                { 
                  icon: Video,
                  step: 'Step 2', 
                  title: 'Sample Video Review', 
                  desc: 'We review fabric swatches and send comprehensive video demonstrations of sample cuts.' 
                },
                { 
                  icon: Building2,
                  step: 'Step 3', 
                  title: 'Price & Order Approval', 
                  desc: 'Receive transparent tiered pricing and finalized lead-time schedules.' 
                },
                { 
                  icon: Globe,
                  step: 'Step 4', 
                  title: 'Atelier Cutting & Dispatch', 
                  desc: 'Pieces are precision tailored in Dubai and shipped tracked via express air freight.' 
                },
              ].map((item) => (
                <div key={item.step} className="p-6 rounded-xl bg-background border border-border/80">
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-3">
                    {item.step}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Wholesale Styles */}
        <section className="py-20 md:py-28">
          <div className="luxury-container">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-2">
                  Sample Selection
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">Popular Wholesale Styles</h2>
              </div>
              <Link to="/wholesale/catalog">
                <Button variant="outline" className="btn-luxury-outline">
                  View Full B2B Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  image: '/images/wholesale-abaya-1.jpeg',
                  title: 'Classic Wrap Abaya',
                  description: 'Flowing wrap cut tailored in premium matte Korean Nida fabric.',
                  price: 'Wholesale Tiered Pricing',
                  moq: 'MOQ: 12 pcs / color'
                },
                {
                  image: '/images/wholesale-abaya-2.jpeg',
                  title: 'Embroidered Navy Kaftan',
                  description: 'Occasion kaftan with tonal threadwork and structured sleeve cuffs.',
                  price: 'Wholesale Tiered Pricing',
                  moq: 'MOQ: 12 pcs / color'
                },
                {
                  image: '/images/wholesale-abaya-3.jpeg',
                  title: 'Emerald Heritage Abaya',
                  description: 'Rich jewel-toned silhouette with delicate artisan finishings.',
                  price: 'Wholesale Tiered Pricing',
                  moq: 'MOQ: 12 pcs / color'
                }
              ].map((abaya) => (
                <div 
                  key={abaya.title}
                  className="group bg-card rounded-xl overflow-hidden border border-border/70 hover:border-border transition-colors"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-muted">
                    <img 
                      src={abaya.image} 
                      alt={abaya.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-1.5">{abaya.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-4">{abaya.description}</p>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-border/50">
                      <span className="text-foreground font-medium">{abaya.price}</span>
                      <span className="text-primary font-medium">{abaya.moq}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form & Contact Info */}
        <section id="apply" className="py-20 md:py-28 bg-card border-t border-border/60">
          <div className="luxury-container">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Form */}
              <div className="lg:col-span-7">
                <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-2">
                  Inquire Now
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                  Request Wholesale Pricing & Samples
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed">
                  Provide your boutique details below. Our wholesale manager will respond with our complete linesheet, volume pricing, and fabric sample options.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="businessName" className="text-xs font-medium uppercase tracking-wider">Boutique / Company Name *</Label>
                      <Input
                        id="businessName"
                        {...register('businessName')}
                        className="h-11 bg-background border-border"
                        placeholder="e.g. Al Noor Boutique"
                      />
                      {errors.businessName && (
                        <p className="text-destructive text-xs">{errors.businessName.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contactPerson" className="text-xs font-medium uppercase tracking-wider">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        {...register('contactPerson')}
                        className="h-11 bg-background border-border"
                        placeholder="Your full name"
                      />
                      {errors.contactPerson && (
                        <p className="text-destructive text-xs">{errors.contactPerson.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="h-11 bg-background border-border"
                        placeholder="orders@yourboutique.com"
                      />
                      {errors.email && (
                        <p className="text-destructive text-xs">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider">Phone / WhatsApp *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        className="h-11 bg-background border-border"
                        placeholder="+971 50 000 0000"
                      />
                      {errors.phone && (
                        <p className="text-destructive text-xs">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium uppercase tracking-wider">Delivery Region *</Label>
                      <Select onValueChange={(value) => setValue('region', value)}>
                        <SelectTrigger className="h-11 bg-background border-border">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="uae">UAE</SelectItem>
                          <SelectItem value="gcc">GCC (Saudi Arabia, Qatar, Kuwait, Bahrain, Oman)</SelectItem>
                          <SelectItem value="mena">Middle East & North Africa</SelectItem>
                          <SelectItem value="uk_europe">United Kingdom & Europe</SelectItem>
                          <SelectItem value="north_america">United States & Canada</SelectItem>
                          <SelectItem value="other">Other International</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.region && (
                        <p className="text-destructive text-xs">{errors.region.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium uppercase tracking-wider">Estimated Order Quantity *</Label>
                      <Select onValueChange={(value) => setValue('volume', value)}>
                        <SelectTrigger className="h-11 bg-background border-border">
                          <SelectValue placeholder="Select volume tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12-50">12 – 50 pieces</SelectItem>
                          <SelectItem value="51-100">51 – 100 pieces</SelectItem>
                          <SelectItem value="101-300">101 – 300 pieces</SelectItem>
                          <SelectItem value="300+">300+ pieces</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.volume && (
                        <p className="text-destructive text-xs">{errors.volume.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-medium uppercase tracking-wider">Specific Requirements (Optional)</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      className="min-h-[100px] bg-background border-border resize-none text-sm"
                      placeholder="Mention preferred fabric types, custom label requirements, or specific design inquiries..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-luxury-primary h-12 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting Request...' : 'Submit Wholesale Inquiry'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Direct Contact Sidebar */}
              <div className="lg:col-span-5">
                <div className="p-6 sm:p-8 rounded-xl bg-background border border-border/80 space-y-6">
                  <h3 className="font-serif text-xl font-semibold text-foreground">Direct B2B Inquiries</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Have an urgent retail inquiry or customized bulk production request? Reach our Dubai team directly.
                  </p>

                  <div className="space-y-3">
                    <a 
                      href="mailto:modestwayfashion@gmail.com"
                      className="flex items-center gap-3.5 p-3.5 rounded-lg border border-border/60 hover:bg-card transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Email Orders</p>
                        <p className="text-sm font-medium text-foreground truncate">modestwayfashion@gmail.com</p>
                      </div>
                    </a>

                    <a 
                      href="tel:+971556020293"
                      className="flex items-center gap-3.5 p-3.5 rounded-lg border border-border/60 hover:bg-card transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Direct Phone</p>
                        <p className="text-sm font-medium text-foreground">+971 55 602 0293</p>
                      </div>
                    </a>

                    <a 
                      href="https://wa.me/971556020293"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3.5 p-3.5 rounded-lg border border-border/60 hover:bg-card transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">WhatsApp Atelier</p>
                        <p className="text-sm font-medium text-foreground">+971 55 602 0293</p>
                      </div>
                    </a>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center gap-2.5 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Sunday – Thursday: 9:00 AM – 6:00 PM (GST)</span>
                  </div>
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
