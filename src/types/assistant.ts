// Modest Way Fashion - AI Assistant Types & Interfaces
// Structured for future AI service backend plug-in

export type AssistantLanguage = 'en' | 'ar';

export interface MockAssistantProduct {
  id: string;
  name: string;
  nameUrdu?: string;
  nameArabic?: string;
  sku: string;
  price: number;
  originalPrice?: number;
  wholesalePrice?: number;
  category: string;
  color: string;
  sizes: string[];
  inStock: boolean;
  image: string;
  description: string;
  descriptionUrdu?: string;
  descriptionArabic?: string;
  tags: string[];
}

export type MessageSender = 'user' | 'assistant' | 'system';

export type AssistantActionType =
  | 'text_response'
  | 'product_search'
  | 'product_recommendation'
  | 'price_filter'
  | 'wholesale_flow'
  | 'shipping_info'
  | 'returns_info'
  | 'size_guide_info'
  | 'whatsapp_handoff'
  | 'language_switch';

export interface WholesaleState {
  step: 'idle' | 'style' | 'quantity' | 'destination' | 'contact' | 'completed';
  style?: string;
  quantity?: string | number;
  destination?: string;
  contact?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: Date;
  language?: AssistantLanguage;
  isRTL?: boolean;
  actionType?: AssistantActionType;
  products?: MockAssistantProduct[];
  quickReplies?: string[];
  whatsappHandoff?: {
    show: boolean;
    customText?: string;
    phoneNumber?: string;
    buttonLabel?: string;
  };
  wholesaleStep?: WholesaleState['step'];
  metadata?: Record<string, unknown>;
}

export interface AIAssistantConfig {
  enabled: boolean;
  assistantName: string;
  titleBadge: string;
  defaultLanguage: AssistantLanguage;
  welcomeMessages: Record<AssistantLanguage, string>;
  starterQuestions: Record<AssistantLanguage, string[]>;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  businessKnowledge: {
    location: string;
    showroomAddress: string;
    operatingHours: string;
    deliveryTimeUAE: string;
    freeShippingThreshold: number;
    standardShippingFee: number;
    codFee: number;
    returnWindowDays: number;
    wholesaleMinQty: number;
  };
}

export interface SendMessageOptions {
  language?: AssistantLanguage;
  wholesaleState?: WholesaleState;
  context?: {
    currentPage?: string;
    cartCount?: number;
  };
}

export interface AssistantResponse {
  message: ChatMessage;
  updatedWholesaleState?: WholesaleState;
}

export interface IAIAssistantService {
  sendMessage(text: string, options?: SendMessageOptions): Promise<AssistantResponse>;
  getStarterQuestions(lang: AssistantLanguage): string[];
  getConfig(): AIAssistantConfig;
  updateConfig(newConfig: Partial<AIAssistantConfig>): void;
}
