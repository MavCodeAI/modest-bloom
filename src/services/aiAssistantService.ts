// Modest Way Fashion - AI Assistant Service
// Clean architecture separating the UI from the underlying AI engine.
// Currently powered by a deterministic, multilingual Mock Engine.
// Future Phase: Replace MockAIAssistantService with RealAIService (Gemini / LLM API) with zero UI refactoring.

import {
  AssistantLanguage,
  ChatMessage,
  IAIAssistantService,
  SendMessageOptions,
  AssistantResponse,
  AIAssistantConfig,
  WholesaleState,
  MockAssistantProduct,
} from '@/types/assistant';
import { DEFAULT_AI_CONFIG } from '@/data/mockAssistantData';
import { filterCatalog, searchCatalog } from '@/services/assistantCatalog';

export class MockAIAssistantService implements IAIAssistantService {
  private config: AIAssistantConfig;

  constructor(initialConfig?: AIAssistantConfig) {
    // Attempt to load stored admin config if available
    const saved = localStorage.getItem('mwf_ai_assistant_config');
    if (saved) {
      try {
        this.config = { ...DEFAULT_AI_CONFIG, ...JSON.parse(saved) };
      } catch (e) {
        this.config = initialConfig || { ...DEFAULT_AI_CONFIG };
      }
    } else {
      this.config = initialConfig || { ...DEFAULT_AI_CONFIG };
    }
  }

  public getConfig(): AIAssistantConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AIAssistantConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('mwf_ai_assistant_config', JSON.stringify(this.config));
  }

  public getStarterQuestions(lang: AssistantLanguage): string[] {
    return this.config.starterQuestions[lang] || this.config.starterQuestions.en;
  }

  /**
   * Helper to detect language from input string
   */
  public detectLanguage(text: string, currentLang?: AssistantLanguage): AssistantLanguage {
    // Check for Arabic specific characters / words
    if (/[\u0600-\u06FF\u0750-\u077F]/.test(text)) {
      return 'ar';
    }
    return currentLang || 'en';
  }

  /**
   * Main conversation processor simulating AI natural reasoning and structured response output
   */
  public async sendMessage(
    text: string,
    options?: SendMessageOptions
  ): Promise<AssistantResponse> {
    const rawText = text.trim();
    const activeLang = options?.language || this.detectLanguage(rawText, 'en');
    const isRTL = activeLang === 'ar';
    const lower = rawText.toLowerCase();
    const wholesaleState = options?.wholesaleState || { step: 'idle' };

    // Simulate realistic AI response latency (450ms)
    await new Promise((res) => setTimeout(res, 450));

    // Handle Active Wholesale Multi-Step Conversation State
    if (wholesaleState.step !== 'idle' && wholesaleState.step !== 'completed') {
      return this.handleWholesaleFlow(rawText, wholesaleState, activeLang, isRTL);
    }

    // 1. Check for Wholesale Intent
    if (
      lower.includes('wholesale') ||
      lower.includes('bulk') ||
      lower.includes('50 abaya') ||
      lower.includes('100 abaya') ||
      lower.includes('boutique order') ||
      lower.includes('جملة') ||
      lower.includes('كميات')
    ) {
      return this.startWholesaleFlow(rawText, activeLang, isRTL);
    }

    // 2. Check for Human Support / WhatsApp Handoff Intent
    if (
      lower.includes('speak to someone') ||
      lower.includes('human') ||
      lower.includes('agent') ||
      lower.includes('representative') ||
      lower.includes('call') ||
      lower.includes('phone') ||
      lower.includes('whatsapp') ||
      lower.includes('تحدث مع شخص') ||
      lower.includes('خدمة العملاء') ||
      lower.includes('مندوب')
    ) {
      return this.generateHumanSupportResponse(activeLang, isRTL);
    }

    // 3. Check for Price Inquiries (e.g. Under 300 AED)
    if (
      lower.includes('under 300') ||
      lower.includes('under aed 300') ||
      lower.includes('below 300') ||
      lower.includes('cheap') ||
      lower.includes('affordable') ||
      lower.includes('budget') ||
      lower.includes('price') ||
      lower.includes('أقل من 300') ||
      lower.includes('رخيصة') ||
      lower.includes('ميزانية')
    ) {
      return await this.generateBudgetResponse(activeLang, isRTL);
    }

    // 4. Check for Occasion / Luxury Recommendation
    if (
      lower.includes('occasion') ||
      lower.includes('wedding') ||
      lower.includes('party') ||
      lower.includes('elegant') ||
      lower.includes('luxury') ||
      lower.includes('velvet') ||
      lower.includes('embroidery') ||
      lower.includes('eid') ||
      lower.includes('مناسبات') ||
      lower.includes('أعراس') ||
      lower.includes('سهرة') ||
      lower.includes('فاخر')
    ) {
      return await this.generateOccasionResponse(activeLang, isRTL);
    }

    // 5. Check for Black Abayas / Specific Search
    if (
      lower.includes('black') ||
      lower.includes('noir') ||
      lower.includes('dark') ||
      lower.includes('اسود') ||
      lower.includes('سوداء')
    ) {
      return await this.generateBlackAbayaResponse(activeLang, isRTL);
    }

    // 6. Check for Shipping / Delivery Questions
    if (
      lower.includes('deliver') ||
      lower.includes('shipping') ||
      lower.includes('dubai') ||
      lower.includes('uae') ||
      lower.includes('courier') ||
      lower.includes('cod') ||
      lower.includes('توصيل') ||
      lower.includes('شحن') ||
      lower.includes('مدة')
    ) {
      return this.generateShippingResponse(activeLang, isRTL);
    }

    // 7. Check for Return / Exchange Policy
    if (
      lower.includes('return') ||
      lower.includes('exchange') ||
      lower.includes('refund') ||
      lower.includes('ارجاع') ||
      lower.includes('استبدال') ||
      lower.includes('استرجاع')
    ) {
      return this.generateReturnsResponse(activeLang, isRTL);
    }

    // 8. Check for Sizing / Measurements
    if (
      lower.includes('size') ||
      lower.includes('length') ||
      lower.includes('height') ||
      lower.includes('52') ||
      lower.includes('54') ||
      lower.includes('56') ||
      lower.includes('مقاس') ||
      lower.includes('طول')
    ) {
      return this.generateSizingResponse(activeLang, isRTL);
    }

    // 9. Try a real catalog search before falling back
    const found = await searchCatalog(rawText);
    if (found.length > 0) {
      return this.buildProductResponse(found, activeLang, isRTL);
    }

    // Default Fallback Exploration Response
    return this.generateGeneralHelpResponse(activeLang, isRTL);
  }

  // --- Specialized Scenario Generators ---

  private buildProductResponse(
    products: MockAssistantProduct[],
    lang: AssistantLanguage,
    isRTL: boolean
  ): AssistantResponse {
    const text =
      lang === 'ar'
        ? 'إليكِ ما وجدته في مجموعتنا الحالية:'
        : 'Here is what I found in our current collection:';

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date(),
        language: lang,
        isRTL,
        actionType: 'product_search',
        products,
        quickReplies:
          lang === 'ar'
            ? ['دليل المقاسات', 'الأنسب سعراً', 'واتساب']
            : ['Size guide', 'Best value pieces', 'Chat on WhatsApp'],
      },
    };
  }

  private async generateBlackAbayaResponse(lang: AssistantLanguage, isRTL: boolean): Promise<AssistantResponse> {
    const products = await filterCatalog((p) =>
      [p.name, p.category, p.color, ...(p.colors || []), ...p.tags]
        .join(' ')
        .toLowerCase()
        .includes('black')
    );

    let text = 'Of course! Here are our signature pure black abayas, crafted from premium Japanese Silk and authentic Korean Nida with breathable, crease-resistant drape:';
    if (lang === 'ar') {
      text = 'بكل سرور! إليكِ تشكيلتنا المميزة من العبايات السوداء الكلاسيكية المصنوعة من الحرير الياباني وقماش الندى الكوري الفاخر:';
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date(),
        language: lang,
        isRTL,
        actionType: 'product_search',
        products,
        quickReplies: lang === 'ar'
          ? ['دليل المقاسات', 'الأنسب سعراً', 'محادثة عبر واتساب']
          : ['How to pick size?', 'Best value pieces', 'Chat on WhatsApp'],
      },
    };
  }

  private async generateOccasionResponse(lang: AssistantLanguage, isRTL: boolean): Promise<AssistantResponse> {
    const products = await filterCatalog((p) =>
      /luxury|occasion|wedding|eid|embroider|beaded|party/i.test(
        [p.name, p.category, p.description, ...p.tags].join(' ')
      )
    );

    let text = 'For weddings and prestigious events, I highly recommend our hand-embellished luxury collection with intricate gold zardozi threadwork and Swarovski crystal pleating:';
    if (lang === 'ar') {
      text = 'لحفلات الزفاف والمناسبات الراقية، أرشح لكِ تشكيلة العبايات الفاخرة المطرزة يدوياً بخيوط القصب الذهبية والكريستال:';
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date(),
        language: lang,
        isRTL,
        actionType: 'product_recommendation',
        products,
        quickReplies: lang === 'ar'
          ? ['هل تشمل الشيلة؟', 'استفسار عن أسعار الجملة', 'استشارة عبر واتساب']
          : ['Does it include Sheila?', 'Wholesale pricing', 'Consult on WhatsApp'],
      },
    };
  }

  private async generateBudgetResponse(lang: AssistantLanguage, isRTL: boolean): Promise<AssistantResponse> {
    const all = await filterCatalog(() => true, 100);
    const sorted = [...all].sort((a, b) => a.price - b.price);
    const products = sorted.slice(0, 4);

    let text = 'Here are our most affordable pieces available right now, sorted by best value:';
    if (lang === 'ar') {
      text = 'إليكِ القطع الأنسب سعراً المتوفرة حالياً، مرتبة من الأقل سعراً:';
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date(),
        language: lang,
        isRTL,
        actionType: 'price_filter',
        products,
        quickReplies: lang === 'ar'
          ? ['تكلفة التوصيل', 'العبايات السوداء', 'طلب عبر واتساب']
          : ['Delivery fees?', 'Black abayas', 'Order on WhatsApp'],
      },
    };
  }

  private startWholesaleFlow(
    _input: string,
    lang: AssistantLanguage,
    isRTL: boolean
  ): AssistantResponse {
    let text = 'Absolutely! Modest Way Fashion is a premier B2B manufacturer and exporter based in Dubai. We offer tiered factory pricing starting from 25 pieces with custom branding, sizing, and international air freight.\n\nTo tailor the best proposal, what styles are you looking for?';
    if (lang === 'ar') {
      text = 'أهلاً بك! نحن في مودست واي فاشن نوفر خدمات البيع بالجملة والتصدير للشركات والبوتيكات في الخليج والعالم بأسعار المصنع التنافسية (الحد الأدنى 25 قطعة).\n\nما هي الموديلات أو الأقمشة التي تفضلونها لطلبيتكم؟';
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date(),
        language: lang,
        isRTL,
        actionType: 'wholesale_flow',
        wholesaleStep: 'style',
        quickReplies: lang === 'ar'
          ? ['عبايات سوداء وندى كوري', 'عبايات مناسبات وتطريز فاخر', 'تشكيلة منوعة (50 قطعة)', 'متابعة عبر واتساب مباشرة']
          : ['Classic Black & Korean Nida', 'Luxury Embroidered Occasion', 'Mixed Boutique Assortment (50+)', 'Continue on WhatsApp'],
      },
      updatedWholesaleState: { step: 'style' },
    };
  }

  private handleWholesaleFlow(
    input: string,
    state: WholesaleState,
    lang: AssistantLanguage,
    isRTL: boolean
  ): AssistantResponse {
    const nextState: WholesaleState = { ...state };

    if (state.step === 'style') {
      nextState.style = input;
      nextState.step = 'quantity';

      let text = `Excellent choice (${input}). How many pieces are you planning for this production batch?`;
      if (lang === 'ar') {
        text = `اختيار رائع (${input}). ما هي الكمية التقريبية المطلوبة لهذا الطلب؟`;
      }

      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date(),
          language: lang,
          isRTL,
          actionType: 'wholesale_flow',
          wholesaleStep: 'quantity',
          quickReplies: ['25 - 50 Pieces', '50 - 100 Pieces', '100 - 500 Pieces', '500+ Bulk Production'],
        },
        updatedWholesaleState: nextState,
      };
    }

    if (state.step === 'quantity') {
      nextState.quantity = input;
      nextState.step = 'destination';

      let text = `Noted: ${input}. Which city or country should we calculate air freight and customs clearance for?`;
      if (lang === 'ar') {
        text = `تم تسجيل الكمية: ${input}. ما هي وجهة الشحن (المدينة والدولة) لاحتساب تكلفة الشحن الجوي؟`;
      }

      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date(),
          language: lang,
          isRTL,
          actionType: 'wholesale_flow',
          wholesaleStep: 'destination',
          quickReplies: ['Dubai / UAE Local', 'Riyadh / Saudi Arabia (KSA)', 'Kuwait / Qatar / Oman', 'UK / USA / International'],
        },
        updatedWholesaleState: nextState,
      };
    }

    if (state.step === 'destination') {
      nextState.destination = input;
      nextState.step = 'completed';

      const wholesaleSummary = `Wholesale Inquiry Summary:
• Style: ${nextState.style || 'Custom Assortment'}
• Volume: ${nextState.quantity || '50 Pcs'}
• Destination: ${nextState.destination || 'UAE / GCC'}`;

      const whatsappText = encodeURIComponent(
        `Hello Modest Way B2B Team! I have submitted a wholesale inquiry:\n- Style: ${nextState.style}\n- Quantity: ${nextState.quantity}\n- Shipping to: ${nextState.destination}\nPlease send the wholesale line sheet and FOB price list.`
      );

      let text = `Thank you! I have compiled your wholesale quotation summary:\n\n${wholesaleSummary}\n\nOur Senior B2B Accounts Director in Dubai is ready to provide tier discounts and factory fabric swatches. Click below to continue directly on WhatsApp with your pre-filled inquiry.`;
      if (lang === 'ar') {
        text = `شكراً جزيلاً! تم تجهيز ملخص طلب الجملة الخاص بكم:\n\n${wholesaleSummary}\n\nمدير مبيعات الجملة في دبي بانتظاركم لتقديم جدول الأسعار النهائي وكتالوج الأقمشة. اضغط أدناه للمتابعة عبر واتساب مباشرة:`;
      }

      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date(),
          language: lang,
          isRTL,
          actionType: 'whatsapp_handoff',
          whatsappHandoff: {
            show: true,
            customText: whatsappText,
            buttonLabel: lang === 'ar' ? 'متابعة طلب الجملة عبر واتساب' : 'Continue Wholesale on WhatsApp',
          },
          quickReplies: lang === 'ar'
            ? ['طلب جملة جديد', 'تصفح الكتالوج']
            : ['Start New Inquiry', 'Browse Catalog'],
        },
        updatedWholesaleState: nextState,
      };
    }

    return this.generateGeneralHelpResponse(lang, isRTL);
  }

  private generateHumanSupportResponse(lang: AssistantLanguage, isRTL: boolean): AssistantResponse {
    let text = 'Our personal shopping concierges and master tailors are available on WhatsApp to assist with bespoke measurements, urgent delivery, or payment queries:';
    if (lang === 'ar') {
      text = 'فريق خدمة العملاء والمصممين لدينا متواجدون الآن عبر واتساب لمساعدتك في تفصيل المقاسات والطلبات المستعجلة:';
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date(),
        language: lang,
        isRTL,
        actionType: 'whatsapp_handoff',
        whatsappHandoff: {
          show: true,
          buttonLabel: lang === 'ar' ? 'تحدث معنا عبر واتساب' : 'Chat on WhatsApp with Stylist',
        },
        quickReplies: lang === 'ar'
          ? ['عنوان البوتيك في دبي', 'العبايات السوداء', 'دليل المقاسات']
          : ['Showroom Location', 'Black Abayas', 'Size Guide'],
      },
    };
  }

  private generateShippingResponse(lang: AssistantLanguage, isRTL: boolean): AssistantResponse {
    const k = this.config.businessKnowledge;
    let text = `Yes, we deliver across all 7 Emirates and globally:\n• **Dubai & Sharjah Express:** 1–2 business days (AED 80 or Free over AED ${k.freeShippingThreshold})\n• **Standard UAE Delivery:** 2–4 business days (AED ${k.standardShippingFee})\n• **Cash on Delivery (COD):** Available across UAE (+AED ${k.codFee} fee)\n• **Complimentary Delivery:** On all orders above AED ${k.freeShippingThreshold}`;
    if (lang === 'ar') {
      text = `نعم، نوفر التوصيل السريع لجميع إمارات الدولة والشحن الدولي:\n• **دبي والشارقة إكسبريس:** 1 - 2 يوم عمل (مجاناً للطلبات فوق 500 درهم)\n• **التوصيل القياسي للإمارات:** 2 - 4 أيام عمل (50 درهم)\n• **الدفع عند الاستلام (COD):** متاح في كافة أنحاء الإمارات (+20 درهم)\n• **شحن مجاني:** لكافة الطلبات بقيمة 500 درهم فأكثر.`;
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date(),
        language: lang,
        isRTL,
        actionType: 'shipping_info',
        quickReplies: lang === 'ar'
          ? ['سياسة الاستبدال والاسترجاع', 'مشاهدة العبايات', 'واتساب']
          : ['Return Policy', 'Show Black Abayas', 'Chat on WhatsApp'],
      },
    };
  }

  private generateReturnsResponse(lang: AssistantLanguage, isRTL: boolean): AssistantResponse {
    let text = `We offer a seamless **14-day return and exchange policy** on all standard unworn items with original tags intact. Custom-tailored bespoke lengths are eligible for free alteration adjustments.`;
    if (lang === 'ar') {
      text = `نوفر سياسة مرنة للاستبدال والاسترجاع خلال **14 يوماً** من الاستلام للمنتجات غير المستخدمة في تغليفها الأصلي.`;
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date(),
        language: lang,
        isRTL,
        actionType: 'returns_info',
        quickReplies: lang === 'ar'
          ? ['محادثة خدمة العملاء', 'تصفح العبايات']
          : ['Contact Concierge', 'Browse Abayas'],
      },
    };
  }

  private generateSizingResponse(lang: AssistantLanguage, isRTL: boolean): AssistantResponse {
    let text = `Our standard abayas are measured by total length in inches (from shoulder to floor):\n• **Size 50:** Height 4'11" - 5'1" (150 - 155 cm)\n• **Size 52:** Height 5'1" - 5'3" (155 - 160 cm)\n• **Size 54:** Height 5'3" - 5'5" (160 - 165 cm) *(Most Popular)*\n• **Size 56:** Height 5'5" - 5'7" (165 - 170 cm)\n• **Size 58 & 60:** Height 5'7"+ (170 - 180 cm)\n\nWe also offer complimentary bespoke tailoring adjustments!`;
    if (lang === 'ar') {
      text = `تعتمد مقاسات العبايات على طول القامة من الكتف إلى الأرض بالبوصة:\n• **مقاس 50:** الطول 150 - 155 سم\n• **مقاس 52:** الطول 155 - 160 سم\n• **مقاس 54:** الطول 160 - 165 سم *(الأكثر طلباً)*\n• **مقاس 56:** الطول 165 - 170 سم\n• **مقاس 58 و 60:** الطول 170 - 180 سم.`;
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date(),
        language: lang,
        isRTL,
        actionType: 'size_guide_info',
        quickReplies: lang === 'ar'
          ? ['عرض عبايات مقاس 54', 'استشارة الخياط عبر واتساب']
          : ['Show Size 54 Abayas', 'Custom Tailoring on WhatsApp'],
      },
    };
  }

  private generateGeneralHelpResponse(lang: AssistantLanguage, isRTL: boolean): AssistantResponse {
    let text = 'I am delighted to assist you with Modest Way Fashion collections. What are you looking for today?';
    if (lang === 'ar') {
      text = 'يسعدني مساعدتك في استكشاف تصاميم مودست واي فاشن. كيف يمكنني خدمتك اليوم؟';
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date(),
        language: lang,
        isRTL,
        actionType: 'text_response',
        quickReplies: lang === 'ar'
          ? ['عبايات سوداء', 'عبايات مناسبات', 'الأنسب سعراً', 'طلبات الجملة', 'واتساب']
          : ['Black Abayas', 'Occasion Abayas', 'Best value pieces', 'Wholesale Inquiry', 'Chat on WhatsApp'],
      },
    };
  }
}

// Global Singleton Instance ready for injection
export const aiAssistantService = new MockAIAssistantService();
