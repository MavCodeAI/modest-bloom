import React from 'react';
import { Sparkles, ShoppingBag, Tag, Box, Truck, MessageCircle, HelpCircle } from 'lucide-react';
import { AssistantLanguage } from '@/types/assistant';

interface AIQuickActionsProps {
  language: AssistantLanguage;
  onSelectAction: (actionText: string) => void;
}

export const AIQuickActions: React.FC<AIQuickActionsProps> = ({
  language,
  onSelectAction,
}) => {
  const actionsByLang = {
    en: [
      { label: 'Show Black Abayas', icon: ShoppingBag, query: 'Show me black Abayas' },
      { label: 'Occasion & Luxury', icon: Sparkles, query: 'I need an elegant Abaya for an occasion' },
      { label: 'Best Value', icon: Tag, query: 'What are your best-value abayas?' },
      { label: 'Wholesale (50+ Pcs)', icon: Box, query: 'I want to buy 50 Abayas for wholesale' },
      { label: 'Shipping to UAE/GCC', icon: Truck, query: 'Do you deliver in Dubai and UAE?' },
      { label: 'Chat on WhatsApp', icon: MessageCircle, query: 'I want to speak to someone on WhatsApp' },
    ],
    ar: [
      { label: 'العبايات السوداء', icon: ShoppingBag, query: 'أريد مشاهدة العبايات السوداء الفاخرة' },
      { label: 'عبايات مناسبات وسهرة', icon: Sparkles, query: 'أبحث عن عباية أنيقة للمناسبات الخاصة' },
      { label: 'الأنسب سعراً', icon: Tag, query: 'ما هي العبايات الأنسب سعراً؟' },
      { label: 'طلبات الجملة (50+)', icon: Box, query: 'أريد شراء 50 عباية بسعر الجملة' },
      { label: 'الشحن والتوصيل', icon: Truck, query: 'ما هي مدة التوصيل في دبي والإمارات؟' },
      { label: 'واتساب خدمة العملاء', icon: MessageCircle, query: 'التحدث مع خدمة العملاء عبر واتساب' },
    ],
  };

  const currentActions = actionsByLang[language] || actionsByLang.en;

  return (
    <div className="p-3 border-t border-border/60 bg-muted/20">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-2 px-1">
        <HelpCircle className="w-3.5 h-3.5 text-primary" />
        <span>
          {language === 'ar'
            ? 'الأسئلة المقترحة والخدمات'
            : 'Quick Concierge Prompts'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {currentActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectAction(action.query)}
              className="inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium bg-card hover:bg-primary/10 text-foreground hover:text-primary border border-border/80 hover:border-primary/40 transition-all shadow-2xs hover:scale-[1.01]"
            >
              <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
