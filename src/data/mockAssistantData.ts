// Modest Way Fashion - Mock AI Assistant Knowledge Base & Catalog Data
// NOTE: This is structured mock data for UI/UX demonstration.
// In future phases, this layer will be replaced with real backend AI & Vector Store services.

import { MockAssistantProduct, AIAssistantConfig } from '@/types/assistant';

export const DEFAULT_AI_CONFIG: AIAssistantConfig = {
  enabled: true,
  assistantName: 'Modest Way Atelier AI',
  titleBadge: 'Atelier Stylist & Concierge',
  defaultLanguage: 'en',
  welcomeMessages: {
    en: 'Salam! Welcome to Modest Way Fashion. I am your Atelier AI Stylist. How may I assist you today? I can help you discover luxury abayas, check sizes, find prices under AED 300, or assist with wholesale inquiries.',
    ur: 'السلام علیکم! موڈسٹ وے فیشن میں خوش آمدید۔ میں آپ کا ایٹیلیئر اے آئی اسسٹنٹ ہوں۔ میں آپ کے لیے بلیک و فینسی عبایا کی تلاش، سائز گائیڈ، ۳۰۰ درہم سے کم قیمت عبایا، یا ہول سیل کی معلومات میں مدد کر سکتا ہوں۔',
    ar: 'مرحباً بكم في مودست واي فاشن! أنا مستشاركم ومساعدكم الذكي. يسعدني مساعدتكم في اختيار العبايات الفاخرة، مقاسات العبايات، العروض، أو الاستفسار عن طلبات الجملة.'
  },
  starterQuestions: {
    en: [
      'Show me black Abayas',
      'I need an elegant Abaya for an occasion',
      'Do you have anything under AED 300?',
      'I want to buy 50 Abayas for wholesale',
      'Do you deliver in Dubai and UAE?',
      'I want to speak to someone on WhatsApp'
    ],
    ur: [
      'مجھے بلیک عبایا چاہیے',
      'کسی خاص تقریب کے لیے خوبصورت عبایا دکھائیں',
      'کیا ۳۰۰ درہم سے کم میں عبایا ہیں؟',
      'مجھے ۵۰ عبایا ہول سیل میں چاہئیں',
      'دبئی اور یو اے ای میں ڈیلیوری کی کیا شرائط ہیں؟',
      'کسٹمر کیئر سے واٹس ایپ پر بات کرنی ہے'
    ],
    ar: [
      'أريد مشاهدة العبايات السوداء الفاخرة',
      'أبحث عن عباية أنيقة للمناسبات الخاصة',
      'هل تتوفر عبايات بأقل من 300 درهم؟',
      'أريد شراء 50 عباية بسعر الجملة',
      'ما هي مدة التوصيل في دبي والإمارات؟',
      'التحدث مع خدمة العملاء عبر واتساب'
    ]
  },
  whatsappNumber: '+971556020293',
  whatsappDefaultMessage: 'Hello Modest Way Fashion! I am contacting you regarding your Abaya collection.',
  businessKnowledge: {
    location: 'Dubai Design District (d3), Dubai, United Arab Emirates',
    showroomAddress: 'Boutique 402, Building 7, Dubai Design District, Dubai, UAE',
    operatingHours: 'Saturday to Thursday: 10:00 AM – 10:00 PM | Friday: 2:00 PM – 10:00 PM',
    deliveryTimeUAE: '1–2 business days for Dubai & Sharjah (Express), 2–4 business days across other Emirates',
    freeShippingThreshold: 500,
    standardShippingFee: 50,
    codFee: 20,
    returnWindowDays: 14,
    wholesaleMinQty: 25
  }
};

export const MOCK_ASSISTANT_PRODUCTS: MockAssistantProduct[] = [
  {
    id: 'prod-black-silk-01',
    name: 'Midnight Noir Japanese Silk Abaya',
    nameUrdu: 'مڈ نائٹ نوئر جاپانی سلک عبایا',
    nameArabic: 'عباية حرير ياباني كلاسيكية باللون الأسود الملكي',
    sku: 'MWF-BLK-001',
    price: 349,
    originalPrice: 420,
    wholesalePrice: 165,
    category: 'Black Abayas',
    color: 'Deep Onyx Black',
    sizes: ['52', '54', '56', '58', '60'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    description: 'Tailored from premium Japanese midnight silk with hand-finished sleeve piping and matching chiffon sheila.',
    descriptionUrdu: 'پریمیم جاپانی مڈ نائٹ سلک سے تیار کردہ نفیس بلیک عبایا، میچنگ شیلا کے ساتھ۔',
    descriptionArabic: 'مصنوعة من الحرير الياباني الفاخر بلمسات يدوية على الأكمام مع شيلة مطابقة.',
    tags: ['black', 'silk', 'bestseller', 'classic']
  },
  {
    id: 'prod-royal-embroidered-02',
    name: 'Royal Velvet Embroidered Occasion Abaya',
    nameUrdu: 'شاہی مخمل اور زری کڑھائی والا عبایا',
    nameArabic: 'عباية مخملية مطرزة للمناسبات الفاخرة',
    sku: 'MWF-OCC-002',
    price: 499,
    originalPrice: 620,
    wholesalePrice: 240,
    category: 'Luxury Abayas',
    color: 'Black & Antique Gold',
    sizes: ['50', '52', '54', '56', '58'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80',
    description: 'Lavish occasion wear featuring French zardozi gold thread embroidery along the front placket and sleeve cuffs.',
    descriptionUrdu: 'شادی اور تقریبات کے لیے شاہی زری اور زردوزی کڑھائی سے آراستہ ڈیزائنر عبایا۔',
    descriptionArabic: 'مثالية للأعراس والمناسبات الكبرى مع تطريز خيوط القصب الذهبية والأكمام الراقية.',
    tags: ['luxury', 'occasion', 'embroidery', 'velvet', 'gold']
  },
  {
    id: 'prod-daily-linen-03',
    name: 'Everyday Breathable Linen Open Abaya',
    nameUrdu: 'ایوری ڈے بریتھ ایبل کاٹن لینن اوپن عبایا',
    nameArabic: 'عباية كتان يومية مفتوحة خفيفة وعملية',
    sku: 'MWF-OPN-003',
    price: 249,
    originalPrice: 299,
    wholesalePrice: 110,
    category: 'Open Abayas',
    color: 'Mocha Taupe',
    sizes: ['52', '54', '56', '58'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
    description: 'Lightweight, ultra-breathable linen abaya tailored for everyday Dubai climate and effortless layering.',
    descriptionUrdu: 'روزمرہ استعمال اور گرم موسم کے لیے انتہائی آرام دہ اور ہلکا پھلکا اوپن عبایا۔',
    descriptionArabic: 'عباية كتان صيفية خفيفة وعملية ومثالية للدوام والارتداء اليومي.',
    tags: ['budget', 'under_300', 'linen', 'open_cut', 'casual']
  },
  {
    id: 'prod-korean-nida-04',
    name: 'Signature Korean Nida Classic Cut',
    nameUrdu: 'سگنیچر کورین نِدا کلاسک بلیک عبایا',
    nameArabic: 'عباية ندى كورية كلاسيكية انسيابية',
    sku: 'MWF-KOR-004',
    price: 279,
    originalPrice: 320,
    wholesalePrice: 125,
    category: 'Black Abayas',
    color: 'Matte Jet Black',
    sizes: ['52', '54', '56', '58', '60'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    description: 'Crafted from authentic high-grade Korean Nida fabric known for wrinkle-resistance, drape, and matte elegance.',
    descriptionUrdu: 'اصلی کورین ندا فیبرک سے تیار کردہ دیرپا اور شکن سے پاک آرام دہ کلاسک عبایا۔',
    descriptionArabic: 'قماش ندى كوري أصلي مقاوم للتجاعيد وبقصة انسيابية مريحة وراقية.',
    tags: ['budget', 'under_300', 'nida', 'black', 'daily']
  },
  {
    id: 'prod-crystal-pleated-05',
    name: 'Crystal Pleated Organza Luxury Layer',
    nameUrdu: 'کرسٹل پلیٹڈ اورگینزا فینسی عبایا',
    nameArabic: 'عباية أورجانزا بليسيه مع لمسات كريستالية',
    sku: 'MWF-ORG-005',
    price: 549,
    originalPrice: 650,
    wholesalePrice: 275,
    category: 'Luxury Abayas',
    color: 'Champagne Sand',
    sizes: ['54', '56', '58'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80',
    description: 'Statement luxury piece featuring heat-set accordion pleating and Swarovski crystal hand embellishment.',
    descriptionUrdu: 'شاندار اورگینزا فیبرک اور سواروسکی کرسٹل کے باریک کام والا خاص تقریباتی ڈیزائن۔',
    descriptionArabic: 'تصميم ساحر من الأورجانزا المكسرة المرصعة بالكريستال اللامع.',
    tags: ['luxury', 'occasion', 'crystal', 'pleated', 'champagne']
  },
  {
    id: 'prod-minimal-open-06',
    name: 'Minimalist Raw Silk Flare Open Abaya',
    nameUrdu: 'منیملسٹ را سلک اوپن فلیر عبایا',
    nameArabic: 'عباية قماش خام حريري بقصة واسعة أنيقة',
    sku: 'MWF-SLK-006',
    price: 289,
    originalPrice: 340,
    wholesalePrice: 130,
    category: 'Open Abayas',
    color: 'Sage Olive',
    sizes: ['52', '54', '56', '58'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
    description: 'Clean lines, hidden magnetic closure, and flared hem in raw texture silk blend.',
    descriptionUrdu: 'خوبصورت زیتونی رنگ میں سادہ اور نفیس را سلک اوپن عبایا۔',
    descriptionArabic: 'قصة عصرية مفتوحة بلون زيتي هادئ مع خياطة خفية.',
    tags: ['budget', 'under_300', 'open_cut', 'raw_silk']
  }
];

export interface IntentMatch {
  type: 'search' | 'recommendation' | 'price' | 'wholesale' | 'shipping' | 'returns' | 'human' | 'sizing' | 'general';
  confidence: number;
  extractedKeywords?: string[];
  priceThreshold?: number;
}
