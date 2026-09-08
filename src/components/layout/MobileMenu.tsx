import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Sparkles, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';

const styleLinks = [
  { href: '/shop?category=basic', label: 'Basic Essentials' },
  { href: '/shop?category=printed', label: 'Printed Silk & Crepe' },
  { href: '/shop?category=embroidery', label: 'Artisan Embroidery' },
  { href: '/shop?category=beaded', label: 'Hand-Beaded Luxury' },
];

const occasionLinks = [
  { href: '/shop?occasion=daily', label: 'Daily Wear' },
  { href: '/shop?occasion=eid', label: 'Eid & Festive' },
  { href: '/shop?occasion=wedding', label: 'Wedding & Evening' },
  { href: '/shop?occasion=travel', label: 'Travel Modest Wear' },
];

export function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const linkClass = (href: string) =>
    cn(
      'text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary py-1',
      currentPath === href ? 'text-primary font-semibold' : 'text-foreground/80'
    );

  const sectionLabel = 'text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2.5';

  return (
    <div
      className={cn(
        'md:hidden overflow-hidden transition-all duration-300',
        isOpen ? 'max-h-[85vh] pb-8 overflow-y-auto' : 'max-h-0'
      )}
    >
      <nav className="flex flex-col space-y-6 pt-4">
        {/* Featured Direct Links */}
        <div className="flex flex-col space-y-3 pb-4 border-b border-border">
          <Link 
            to="/shop?tag=new_drop" 
            onClick={onClose} 
            className="flex items-center justify-between py-1 text-sm font-semibold uppercase tracking-wide text-primary"
          >
            <span>✨ New In (Latest Drops)</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </Link>
          <Link to="/shop" onClick={onClose} className={linkClass('/shop')}>
            All Abayas & Kaftans
          </Link>
        </div>

        {/* Shop by Style */}
        <div>
          <p className={sectionLabel}>Shop by Style</p>
          <div className="flex flex-col space-y-2.5 pl-1">
            {styleLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={onClose} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Shop by Occasion */}
        <div>
          <p className={sectionLabel}>Shop by Occasion</p>
          <div className="flex flex-col space-y-2.5 pl-1">
            {occasionLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={onClose} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Wholesale & Sizing & Information */}
        <div className="border-t border-border pt-4 flex flex-col space-y-3">
          <Link
            to="/wholesale"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-semibold text-xs uppercase tracking-wider"
          >
            <span>Wholesale & Boutique B2B</span>
            <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">MOQ 12</span>
          </Link>

          <Link
            to="/size-guide"
            onClick={onClose}
            className="flex items-center gap-2 py-1 text-sm font-medium uppercase tracking-wide text-foreground/80 hover:text-primary"
          >
            <Ruler className="w-4 h-4 text-muted-foreground" />
            <span>Abaya Size Guide (50–60")</span>
          </Link>

          <Link to="/about" onClick={onClose} className={linkClass('/about')}>
            About Dubai Atelier
          </Link>

          <Link to="/contact" onClick={onClose} className={linkClass('/contact')}>
            Contact Customer Care
          </Link>

          <a
            href="https://wa.me/971556020293"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center gap-2.5 p-3 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#128C7E] font-medium text-xs mt-2"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Direct WhatsApp Concierge (+971 55 602 0293)</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
