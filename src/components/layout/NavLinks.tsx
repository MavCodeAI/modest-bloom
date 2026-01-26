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

interface NavLinksProps {
  className?: string;
}

export function NavLinks({ className }: NavLinksProps) {
  const location = useLocation();

  return (
    <nav className={cn('flex items-center space-x-8', className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
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
  );
}