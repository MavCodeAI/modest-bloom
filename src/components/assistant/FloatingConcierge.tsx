import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, MessageCircle, Bot } from 'lucide-react';
import { AIChatModal } from './AIChatModal';

export const FloatingConcierge: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  // Hide on admin routes and checkout to prevent any obstruction of mission-critical checkout flows
  const hideOn = ['/admin', '/checkout'];
  if (hideOn.some((path) => location.pathname.startsWith(path))) {
    return null;
  }

  const phoneNumber = '+971556020293';
  const whatsappMessage = encodeURIComponent(
    'Hello Modest Way Fashion! I am browsing your abaya collection and would like personal styling assistance.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\s/g, '')}?text=${whatsappMessage}`;

  return (
    <>
      {/* Floating Action Buttons Container */}
      <div className="fixed bottom-20 md:bottom-6 right-3 md:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto">
        {/* 1. AI Assistant Floating Launcher */}
        <div className="relative group">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-[#8A6D3B] via-[#C5A880] to-[#E5D4B8] hover:from-[#735A2F] hover:to-[#D4C3A3] text-stone-900 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-amber-200/60 relative cursor-pointer"
            aria-label="Open Modest Way AI Assistant"
          >
            {/* Sparkle badge */}
            <div className="relative">
              <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-stone-950 stroke-[2.2]" />
            </div>

            {/* Live pulsating dot indicator */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5 -mt-0.5 -mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-stone-900" />
            </span>
          </button>

          {/* Desktop Hover Tooltip */}
          <div className="hidden md:block absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-foreground text-background text-xs font-serif font-medium rounded-lg whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="font-sans font-bold text-amber-300 mr-1">AI</span> Atelier Stylist
          </div>
        </div>

        {/* 2. WhatsApp Floating Button (Preserved exactly as requested) */}
        <div className="relative group">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>

          {/* Desktop Hover Tooltip */}
          <div className="hidden md:block absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Chat on WhatsApp
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};
