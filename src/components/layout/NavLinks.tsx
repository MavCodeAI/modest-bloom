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
    <nav className={cn('flex items-center', className)}>
      <Link to="/shop?tag=new_drop" className={cn(linkClass('/shop?tag=new_drop'), 'mr-8')}>
        New In
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium tracking-wide uppercase bg-transparent text-foreground/70 hover:text-primary data-[state=open]:text-primary px-0 h-auto">
              Shop
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid grid-cols-2 gap-6 p-6 w-[560px]">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">
                    Shop by Style
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
                  </ul>
                </div>
                <div className="border-l border-border pl-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">
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
    </nav>
  );
}
