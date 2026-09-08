import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const styleLinks = [
  { href: '/shop?category=basic', label: 'Basic', desc: 'Everyday essentials' },
  { href: '/shop?category=printed', label: 'Printed', desc: 'Bold patterns' },
  { href: '/shop?category=embroidery', label: 'Embroidery', desc: 'Hand-crafted detail' },
  { href: '/shop?category=beaded', label: 'Beaded', desc: 'Statement embellishments' },
];

const occasionLinks = [
  { href: '/shop?occasion=daily', label: 'Daily', desc: 'Comfort for every day' },
  { href: '/shop?occasion=eid', label: 'Eid', desc: 'Festive elegance' },
  { href: '/shop?occasion=wedding', label: 'Wedding', desc: 'Couture for celebrations' },
  { href: '/shop?occasion=travel', label: 'Travel', desc: 'Light & wrinkle-free' },
];

interface NavLinksProps {
  className?: string;
}

export function NavLinks({ className }: NavLinksProps) {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const linkClass = (href: string) =>
    cn(
      'text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary',
      currentPath === href ? 'text-primary' : 'text-foreground/70'
    );

  return (
    <nav className={cn('flex items-center gap-6 lg:gap-8', className)}>
      <Link to="/shop?tag=new_drop" className={linkClass('/shop?tag=new_drop')}>
        New In
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium tracking-wide uppercase bg-transparent text-foreground/70 hover:text-primary data-[state=open]:text-primary px-0 h-auto">
              Shop Collections
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid grid-cols-2 gap-6 p-6 w-[560px]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">
                    Shop by Silhouette & Cut
                  </p>
                  <ul className="space-y-1">
                    {styleLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="block rounded-md p-2 hover:bg-muted transition-colors group"
                        >
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">
                            {link.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{link.desc}</p>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="/shop"
                        className="block rounded-md p-2 hover:bg-muted transition-colors group font-semibold text-primary text-xs uppercase tracking-wider mt-2 border-t border-border pt-2"
                      >
                        Browse All Abayas →
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="border-l border-border pl-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">
                    Shop by Occasion
                  </p>
                  <ul className="space-y-1">
                    {occasionLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="block rounded-md p-2 hover:bg-muted transition-colors group"
                        >
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">
                            {link.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{link.desc}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Link to="/size-guide" className={linkClass('/size-guide')}>
        Size Guide
      </Link>

      <Link 
        to="/wholesale" 
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border",
          location.pathname.startsWith('/wholesale')
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
        )}
      >
        <span>Wholesale B2B</span>
        <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse" />
      </Link>

      <Link to="/about" className={linkClass('/about')}>
        Atelier
      </Link>

      <Link to="/contact" className={linkClass('/contact')}>
        Contact
      </Link>
    </nav>
  );
}
