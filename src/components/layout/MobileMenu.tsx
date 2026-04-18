import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const styleLinks = [
  { href: '/shop?category=basic', label: 'Basic' },
  { href: '/shop?category=printed', label: 'Printed' },
  { href: '/shop?category=embroidery', label: 'Embroidery' },
  { href: '/shop?category=beaded', label: 'Beaded' },
];

const occasionLinks = [
  { href: '/shop?occasion=daily', label: 'Daily' },
  { href: '/shop?occasion=eid', label: 'Eid' },
  { href: '/shop?occasion=wedding', label: 'Wedding' },
  { href: '/shop?occasion=travel', label: 'Travel' },
];

const otherLinks = [
  { href: '/shop?tag=new_drop', label: 'New In' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/wholesale', label: 'Wholesale (B2B)' },
];

export function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const linkClass = (href: string) =>
    cn(
      'text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary',
      currentPath === href ? 'text-primary' : 'text-foreground/70'
    );

  const sectionLabel = 'text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3';

  return (
    <div
      className={cn(
        'md:hidden overflow-hidden transition-all duration-300',
        isOpen ? 'max-h-[600px] pb-6' : 'max-h-0'
      )}
    >
      <nav className="flex flex-col space-y-5 pt-4">
        <div className="flex flex-col space-y-3">
          {otherLinks.slice(0, 1).map((link) => (
            <Link key={link.href} to={link.href} onClick={onClose} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <p className={sectionLabel}>Shop by Style</p>
          <div className="flex flex-col space-y-3">
            {styleLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={onClose} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className={sectionLabel}>Shop by Occasion</p>
          <div className="flex flex-col space-y-3">
            {occasionLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={onClose} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4 flex flex-col space-y-3">
          {otherLinks.slice(1).map((link) => (
            <Link key={link.href} to={link.href} onClick={onClose} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
