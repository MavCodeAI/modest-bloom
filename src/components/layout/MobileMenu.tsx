import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/shop?tag=new_drop', label: 'New In' },
  { href: '/shop?category=abayas', label: 'Abayas' },
  { href: '/shop?category=printed', label: 'Printed' },
  { href: '/shop?category=sets', label: 'Sets' },
  { href: '/shop?category=kaftans', label: 'Kaftans' },
  { href: '/shop?tag=sale', label: 'Sale' },
  { href: '/wholesale', label: 'Wholesale' },
];

export function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "md:hidden overflow-hidden transition-all duration-300",
        isOpen ? "max-h-96 pb-6" : "max-h-0"
      )}
    >
      <nav className="flex flex-col space-y-4 pt-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={onClose}
            className={cn(
              "text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary",
              location.pathname + location.search === link.href
                ? "text-primary"
                : "text-foreground/70"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}