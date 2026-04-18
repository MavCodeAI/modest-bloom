import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const location = useLocation();
  const { cartCount, wishlist, dispatch } = useStore();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const accountHref = user ? '/account' : '/auth';

  type Item = {
    href: string;
    label: string;
    icon: typeof Home;
    badge?: number;
    action?: 'cart';
  };

  const items: Item[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: LayoutGrid },
    { href: '/wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length },
    { href: '#cart', label: 'Bag', icon: ShoppingBag, badge: cartCount, action: 'cart' },
    { href: accountHref, label: 'Account', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary mobile navigation"
    >
      <ul className="flex items-stretch justify-around h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.action !== 'cart' && isActive(item.href);

          const content = (
            <>
              <span className="relative">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={cn(
                    'transition-colors',
                    active ? 'text-primary' : 'text-foreground/70'
                  )}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  'text-[10px] mt-1 tracking-wide transition-colors',
                  active ? 'text-primary font-semibold' : 'text-foreground/60'
                )}
              >
                {item.label}
              </span>
            </>
          );

          return (
            <li key={item.label} className="flex-1">
              {item.action === 'cart' ? (
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_CART', payload: true })}
                  className="w-full h-full flex flex-col items-center justify-center"
                  aria-label="Open cart"
                >
                  {content}
                </button>
              ) : (
                <Link
                  to={item.href}
                  className="w-full h-full flex flex-col items-center justify-center"
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
