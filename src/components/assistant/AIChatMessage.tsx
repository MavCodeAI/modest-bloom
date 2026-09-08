import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, AssistantLanguage } from '@/types/assistant';
import { AIChatProductCard } from './AIChatProductCard';
import { AIChatCodeBlock } from './AIChatCodeBlock';
import { MessageCircle, Sparkles, User, ExternalLink } from 'lucide-react';

interface AIChatMessageProps {
  message: ChatMessage;
  currentLanguage: AssistantLanguage;
  onQuickReplyClick?: (replyText: string) => void;
  onProductClick?: () => void;
}

export const AIChatMessageComponent: React.FC<AIChatMessageProps> = ({
  message,
  currentLanguage,
  onQuickReplyClick,
  onProductClick,
}) => {
  const isUser = message.sender === 'user';
  const isRTL = message.isRTL || message.language === 'ar';

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(date));
  };

  const whatsappUrl = message.whatsappHandoff?.customText
    ? `https://wa.me/971556020293?text=${message.whatsappHandoff.customText}`
    : `https://wa.me/971556020293?text=${encodeURIComponent(
        'Hello Modest Way Fashion! I would like to speak with a customer care stylist.'
      )}`;

  return (
    <div
      className={`flex flex-col gap-1.5 my-3 ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      <div className={`flex items-start gap-2 max-w-[92%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs shadow-xs border border-border">
              <User className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-xs font-bold shadow-xs border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Bubble */}
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-xs'
              : 'bg-card border border-border/80 text-foreground rounded-tl-xs'
          } ${isRTL ? 'font-sans text-right' : 'text-left'}`}
        >
          {/* Main message text with rich Markdown parsing */}
          {isUser ? (
            <div className="whitespace-pre-line break-words">{message.text}</div>
          ) : (
            <div className="break-words space-y-1.5 text-xs sm:text-sm leading-relaxed">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 font-medium hover:text-primary/80 inline-flex items-center gap-0.5"
                    >
                      {children}
                      <ExternalLink className="w-3 h-3 inline-block opacity-70" />
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className={`my-1.5 space-y-1 ${isRTL ? 'mr-3.5 list-disc' : 'ml-3.5 list-disc'}`}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className={`my-1.5 space-y-1 ${isRTL ? 'mr-3.5 list-decimal' : 'ml-3.5 list-decimal'}`}>
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="leading-relaxed marker:text-primary">{children}</li>,
                  h1: ({ children }) => <h1 className="font-serif font-bold text-base my-2 text-foreground">{children}</h1>,
                  h2: ({ children }) => <h2 className="font-serif font-semibold text-sm my-1.5 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="font-semibold text-xs my-1 text-foreground">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote
                      className={`border-primary/40 bg-muted/30 my-2 py-1 px-2.5 rounded-sm italic ${
                        isRTL ? 'border-r-2 pr-2.5 pl-1.5' : 'border-l-2 pl-2.5 pr-1.5'
                      }`}
                    >
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="my-2.5 border-border/70" />,
                  pre: ({ children }) => <div className="my-2">{children}</div>,
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    const isMultiLine = codeString.includes('\n');

                    // If it has a language tag or multiple lines, render full syntax highlighted code block with Copy button
                    if (match || isMultiLine) {
                      const lang = match ? match[1] : 'text';
                      return <AIChatCodeBlock language={lang} code={codeString} />;
                    }

                    // Single-line inline code
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded bg-muted/90 text-[11px] font-mono font-medium text-primary border border-border/50"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          )}

          {/* WhatsApp Handoff Box if requested */}
          {message.whatsappHandoff?.show && (
            <div className="mt-3 pt-3 border-t border-border/60">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium text-xs rounded-xl shadow-xs transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{message.whatsappHandoff.buttonLabel || 'Chat on WhatsApp with Stylist'}</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Product Cards Grid */}
      {message.products && message.products.length > 0 && (
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className="w-full pl-9 pr-2 my-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        >
          {message.products.map((product) => (
            <AIChatProductCard
              key={product.id}
              product={product}
              language={currentLanguage}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      )}

      {/* Quick Reply Pills */}
      {message.quickReplies && message.quickReplies.length > 0 && (
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className="flex flex-wrap gap-1.5 pl-9 pr-2 mt-1"
        >
          {message.quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => onQuickReplyClick && onQuickReplyClick(reply)}
              className="text-[11px] sm:text-xs py-1 px-2.5 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary font-medium transition-colors cursor-pointer hover:border-primary"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Timestamp */}
      <div className={`px-9 text-[10px] text-muted-foreground ${isUser ? 'text-right' : 'text-left'}`}>
        {formatTime(message.timestamp)}
      </div>
    </div>
  );
};
