import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, ShoppingBag, Heart } from 'lucide-react';
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { MdShoppingCart, MdFavoriteBorder, MdAccountCircle } from 'react-icons/md';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const navLinks = [
  { href: '/shop?tag=new_drop', label: 'New In' },
  { href: '/shop?category=abayas', label: 'Abayas' },
  { href: '/shop?category=printed', label: 'Printed' },
  { href: '/shop?category=sets', label: 'Sets' },
  { href: '/shop?category=kaftans', label: 'Kaftans' },
  { href: '/shop?tag=sale', label: 'Sale' },
  { href: '/wholesale', label: 'Wholesale' },
];

export function Navbar() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [searchValue, setSearchValue] = useState('');
   const [isSearchOpen, setIsSearchOpen] = useState(false);
   const { cartCount, wishlist, dispatch, products } = useStore();
   const location = useLocation();
   const navigate = useNavigate();

   const suggestions = useMemo(() => {
     if (!searchValue.trim()) return [];
     const lowerValue = searchValue.toLowerCase();
     const uniqueNames = new Set(
       products
         .filter(p => p.name.toLowerCase().includes(lowerValue))
         .map(p => p.name)
     );
     return Array.from(uniqueNames).slice(0, 5); // Limit to 5 suggestions
   }, [products, searchValue]);

   const handleSearch = (query: string) => {
     if (query.trim()) {
       navigate(`/search?q=${encodeURIComponent(query.trim())}`);
       setIsSearchOpen(false);
       setSearchValue('');
     }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
     if (e.key === 'Enter') {
       handleSearch(searchValue);
     }
   };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="luxury-container">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0"
          >
            <img 
              src="/images/logo.png" 
              alt="Modest Way Fashion" 
              className="h-14 md:h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <button
                  className="p-2 text-foreground/80 hover:text-foreground transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="end">
                <Command>
                  <CommandInput
                    placeholder="Search products..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                    onKeyDown={handleKeyDown}
                  />
                  <CommandList>
                    <CommandEmpty>No products found.</CommandEmpty>
                    <CommandGroup>
                      {suggestions.map((name) => (
                        <CommandItem
                          key={name}
                          onSelect={() => handleSearch(name)}
                        >
                          {name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            <Link
              to="/wishlist"
              className="p-2 text-foreground/80 hover:text-foreground transition-colors relative group"
              aria-label="Wishlist"
            >
              <MdFavoriteBorder size={22} className="group-hover:text-red-500 transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/auth"
              className="p-2 text-foreground/80 hover:text-foreground transition-colors group"
              aria-label="Account"
            >
              <MdAccountCircle size={22} className="group-hover:text-primary transition-colors" />
            </Link>

            <button
              className="p-2 text-foreground/80 hover:text-foreground transition-colors relative group"
              onClick={() => dispatch({ type: 'TOGGLE_CART', payload: true })}
              aria-label="Cart"
            >
              <MdShoppingCart size={22} className="group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-96 pb-6" : "max-h-0"
          )}
        >
          <nav className="flex flex-col space-y-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
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
      </div>
    </header>
  );
}
