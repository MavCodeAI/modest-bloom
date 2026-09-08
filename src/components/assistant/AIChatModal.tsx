import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  X,
  Send,
  MessageCircle,
  Globe,
  ChevronDown,
  RotateCcw,
  Store,
  Check,
} from 'lucide-react';
import {
  ChatMessage,
  AssistantLanguage,
  WholesaleState,
} from '@/types/assistant';
import { aiAssistantService } from '@/services/aiAssistantService';
import { AIChatMessageComponent } from './AIChatMessage';
import { AIQuickActions } from './AIQuickActions';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [language, setLanguage] = useState<AssistantLanguage>('en');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [wholesaleState, setWholesaleState] = useState<WholesaleState>({ step: 'idle' });
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const config = aiAssistantService.getConfig();

  const initWelcomeMessage = useCallback(
    (lang: AssistantLanguage) => {
      const welcomeText = config.welcomeMessages[lang] || config.welcomeMessages.en;
      const starterMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: welcomeText,
        timestamp: new Date(),
        language: lang,
        isRTL: lang === 'ar',
        quickReplies:
          lang === 'ar'
            ? ['العبايات السوداء', 'أقل من 300 درهم', 'طلب جملة (50+)', 'واتساب فوري']
            : ['Show Black Abayas', 'Under AED 300', 'Wholesale Inquiry (50+)', 'Chat on WhatsApp'],
      };
      setMessages([starterMessage]);
      setWholesaleState({ step: 'idle' });
    },
    [config.welcomeMessages]
  );

  // Initialize welcome message upon open or language switch if empty
  useEffect(() => {
    if (messages.length === 0) {
      initWelcomeMessage(language);
    }
  }, [language, messages.length, initWelcomeMessage]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 200);
    }
  }, [isOpen]);

  // Auto scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLanguageChange = (newLang: AssistantLanguage) => {
    setLanguage(newLang);
    setIsLangDropdownOpen(false);
    initWelcomeMessage(newLang);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || isTyping) return;

    // Detect language if auto-detect matches RTL
    const detectedLang = aiAssistantService.detectLanguage(messageText, language);
    const isRTL = detectedLang === 'ar';

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
      language: detectedLang,
      isRTL,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // If user changed language through natural typing, update active lang
    if (detectedLang !== language) {
      setLanguage(detectedLang);
    }

    try {
      const response = await aiAssistantService.sendMessage(messageText, {
        language: detectedLang,
        wholesaleState,
      });

      setMessages((prev) => [...prev, response.message]);

      if (response.updatedWholesaleState) {
        setWholesaleState(response.updatedWholesaleState);
      }
    } catch (err) {
      console.error('Failed to get assistant response:', err);
      const fallbackMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text:
          language === 'ar'
            ? 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب.'
            : 'I apologize, I encountered a brief issue processing that. Please feel free to rephrase or speak with our live team on WhatsApp.',
        timestamp: new Date(),
        language,
        isRTL: language === 'ar',
        whatsappHandoff: {
          show: true,
          customText: encodeURIComponent('Hello Modest Way Fashion! I need assistance with an inquiry.'),
          buttonLabel: 'Chat on WhatsApp',
        },
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    initWelcomeMessage(language);
  };

  if (!isOpen) return null;

  const currentLangLabel = language === 'ar' ? 'العربية' : 'English';
  const isCurrentRTL = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop overlay dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Chat Container */}
      <div
        className="relative w-full sm:max-w-lg h-[90vh] sm:h-[620px] max-h-[92vh] bg-background border border-border sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom-6 duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-stone-100 border-b border-stone-700/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8A6D3B] via-[#C5A880] to-[#E5D4B8] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-stone-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-sm tracking-wide text-amber-200">
                  Modest Way Concierge
                </h3>
                <span className="text-[10px] font-sans px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                  AI Atelier
                </span>
              </div>
              <p className="text-[11px] text-stone-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Dubai Showroom • Available 24/7
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-stone-800/80 hover:bg-stone-700 text-amber-200 rounded-lg border border-stone-700 transition-colors"
                title="Change Assistant Language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currentLangLabel}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-stone-900 border border-stone-700 rounded-lg shadow-xl py-1 z-30 text-xs">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-stone-800 ${
                      language === 'en' ? 'text-amber-300 font-semibold' : 'text-stone-200'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ar')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-right font-sans hover:bg-stone-800 ${
                      language === 'ar' ? 'text-amber-300 font-semibold' : 'text-stone-200'
                    }`}
                  >
                    <span>العربية</span>
                    {language === 'ar' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Reset Chat */}
            <button
              onClick={handleResetChat}
              className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wholesale Banner Indicator if in wholesale flow */}
        {wholesaleState.step !== 'idle' && wholesaleState.step !== 'completed' && (
          <div className="px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] font-medium text-amber-700 dark:text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              <span>
                Wholesale Inquiry Flow: Step{' '}
                {wholesaleState.step === 'style'
                  ? '1 of 3 (Design Selection)'
                  : wholesaleState.step === 'quantity'
                  ? '2 of 3 (Order Quantity)'
                  : '3 of 3 (Destination / Handoff)'}
              </span>
            </div>
            <button
              onClick={handleResetChat}
              className="text-[10px] underline hover:text-amber-900 dark:hover:text-amber-100"
            >
              Cancel Flow
            </button>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-muted/10">
          {messages.map((message) => (
            <AIChatMessageComponent
              key={message.id}
              message={message}
              currentLanguage={language}
              onQuickReplyClick={(reply) => handleSendMessage(reply)}
              onProductClick={onClose}
            />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 my-2 animate-in fade-in">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-card border border-border/80 rounded-tl-xs shadow-xs">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Panel */}
        <AIQuickActions
          language={language}
          onSelectAction={(actionText) => handleSendMessage(actionText)}
        />

        {/* Message Input Footer */}
        <div className="p-3 border-t border-border bg-background flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === 'ar'
                    ? 'اسأل عن العبايات، الأسعار، أو طلبات الجملة...'
                    : 'Ask about abayas, sizes, wholesale or delivery...'
                }
                dir={isCurrentRTL ? 'rtl' : 'ltr'}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground transition-all pr-10"
              />
            </div>

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs flex-shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground px-1">
            <span>
              {language === 'ar'
                ? 'دار أزياء دبي • خدمة فورية'
                : 'Modest Way Fashion • Dubai Atelier'}
            </span>
            <a
              href="https://wa.me/971556020293"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366] fill-[#25D366]" />
              WhatsApp Care
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
