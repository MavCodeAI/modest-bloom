import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HelpCircle, ChevronDown, ChevronUp, Search, Package, Truck, RefreshCw, CreditCard, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqData = [
    {
      category: 'Order & Shipping',
      icon: Package,
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard shipping within UAE takes 3-5 business days. Express shipping (Dubai & Sharjah) takes 1-2 business days. International shipping takes 7-14 business days depending on the destination.'
        },
        {
          q: 'Do you offer international shipping?',
          a: 'Yes, we ship worldwide! International shipping starts from AED 150 and includes tracking and insurance. Delivery times vary by country.'
        },
        {
          q: 'How can I track my order?',
          a: 'Once your order is dispatched, you\'ll receive a tracking number via email. You can use this number on our website or the courier\'s tracking page to monitor your delivery.'
        },
        {
          q: 'What are your shipping costs?',
          a: 'Standard UAE shipping is AED 50 (free on orders above AED 500). Express shipping is AED 80. International shipping starts from AED 150 depending on the destination.'
        },
        {
          q: 'Do you offer Cash on Delivery (COD)?',
          a: 'Yes, COD is available across UAE for an additional AED 20 fee. You\'ll need to pay the exact amount when your order arrives.'
        }
      ]
    },
    {
      category: 'Returns & Exchanges',
      icon: RefreshCw,
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer 14-day returns for unworn, unwashed items with original tags attached. Items must be in their original condition and packaging.'
        },
        {
          q: 'How do I initiate a return?',
          a: 'Contact our customer service via email or phone to initiate your return. We\'ll provide you with return instructions and a return authorization number.'
        },
        {
          q: 'Who pays for return shipping?',
          a: 'Customers are responsible for return shipping costs unless the item is defective or we sent the wrong item. We recommend using a trackable shipping service.'
        },
        {
          q: 'Can I exchange an item for a different size?',
          a: 'Yes, exchanges are allowed within 14 days. You can exchange for a different size or color of the same item, subject to availability.'
        },
        {
          q: 'How long do refunds take?',
          a: 'Refunds are processed within 5-7 business days after we receive your return. It may take an additional 3-5 business days for the amount to appear in your account.'
        }
      ]
    },
    {
      category: 'Products & Sizing',
      icon: User,
      questions: [
        {
          q: 'How do I find the right size?',
          a: 'Check our comprehensive Size Guide page for detailed measurements. If you\'re between sizes, we recommend sizing up for a more comfortable fit.'
        },
        {
          q: 'What materials are your abayas made from?',
          a: 'We use high-quality fabrics including premium crepe, chiffon, and Nida fabric. Each product description specifies the material composition.'
        },
        {
          q: 'How should I care for my abaya?',
          a: 'Most of our abayas should be dry cleaned or hand washed in cold water. Always check the care label on your specific garment. Avoid harsh detergents and direct sunlight when drying.'
        },
        {
          q: 'Do you offer custom sizing?',
          a: 'Yes, we offer custom sizing for select designs. Contact our customer service team with your measurements for a quote and timeline.'
        },
        {
          q: 'Are your designs modest?',
          a: 'All our designs are created with modesty in mind. We ensure proper coverage while maintaining contemporary style and elegance.'
        }
      ]
    },
    {
      category: 'Payment & Account',
      icon: CreditCard,
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit/debit cards, PayPal, and Cash on Delivery (COD) for UAE orders. All online payments are secure and encrypted.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your credit card details on our servers.'
        },
        {
          q: 'Can I cancel or modify my order?',
          a: 'Orders can be cancelled or modified within 2 hours of placement. After that, please contact our customer service, and we\'ll do our best to accommodate your request.'
        },
        {
          q: 'Do you offer payment plans?',
          a: 'Currently, we don\'t offer payment plans. However, we frequently have sales and promotions that can help you get the best value.'
        },
        {
          q: 'Why was my payment declined?',
          a: 'Payment declines can occur due to various reasons. Please check with your bank or try a different payment method. If issues persist, contact our customer service.'
        }
      ]
    }
  ];

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(item => 
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24">
        <div className="luxury-container py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-4">
              <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Find answers to common questions about our modest fashion, shipping, returns, and more.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8 sm:space-y-12">
            {filteredFAQ.map((category, categoryIndex) => {
              const Icon = category.icon;
              const categoryStartIndex = faqData
                .slice(0, categoryIndex)
                .reduce((acc, cat) => acc + cat.questions.length, 0);

              return (
                <div key={category.category}>
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="w-6 h-6 text-primary" />
                    <h2 className="font-serif text-xl sm:text-2xl">{category.category}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {category.questions.map((item, questionIndex) => {
                      const globalIndex = categoryStartIndex + questionIndex;
                      const isExpanded = expandedItems.includes(globalIndex);
                      
                      return (
                        <div key={globalIndex} className="bg-card rounded-lg border border-border overflow-hidden">
                          <button
                            onClick={() => toggleExpanded(globalIndex)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent transition-colors"
                          >
                            <h3 className="font-medium text-sm sm:text-base pr-4">{item.q}</h3>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>
                          
                          {isExpanded && (
                            <div className="px-6 pb-4">
                              <div className="border-t border-border pt-4">
                                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                  {item.a}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredFAQ.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-xl mb-2">No results found</h3>
              <p className="text-muted-foreground text-sm sm:text-base mb-6">
                Try searching with different keywords or browse our FAQ categories.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Still Need Help */}
          <div className="mt-12 sm:mt-16 bg-primary/5 rounded-lg p-6 sm:p-8 text-center">
            <h2 className="font-serif text-xl sm:text-2xl mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">
              Can't find the answer you're looking for? Our customer service team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center btn-luxury-primary h-12 px-6 text-sm sm:text-base"
              >
                Contact Support
              </a>
              <a
                href="mailto:modestwayfashion@gmail.com"
                className="inline-flex items-center justify-center border border-border bg-card hover:bg-accent h-12 px-6 rounded-md text-sm sm:text-base transition-colors"
              >
                Email Us
              </a>
              <a
                href="tel:+971556020293"
                className="inline-flex items-center justify-center border border-border bg-card hover:bg-accent h-12 px-6 rounded-md text-sm sm:text-base transition-colors"
              >
                Call +971 55 602 0293
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="/shipping"
              className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors text-center"
            >
              <Truck className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-2">Shipping Info</h3>
              <p className="text-muted-foreground text-xs">
                Learn about our delivery options
              </p>
            </a>
            
            <a
              href="/returns"
              className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors text-center"
            >
              <RefreshCw className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-2">Returns</h3>
              <p className="text-muted-foreground text-xs">
              Our return and exchange policy
              </p>
            </a>
            
            <a
              href="/size-guide"
              className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors text-center"
            >
              <User className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-2">Size Guide</h3>
              <p className="text-muted-foreground text-xs">
                Find your perfect fit
              </p>
            </a>
            
            <a
              href="/contact"
              className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors text-center"
            >
              <HelpCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-2">Contact Us</h3>
              <p className="text-muted-foreground text-xs">
                Get in touch with our team
              </p>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
