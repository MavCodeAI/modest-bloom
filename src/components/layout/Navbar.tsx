import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { MdShoppingCart, MdFavoriteBorder, MdAccountCircle } from 'react-icons/md';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { SearchBar } from './SearchBar';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount, wishlist, dispatch } = useStore();

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
          <div className="hidden md:flex">
            <NavLinks />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <SearchBar isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
            
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
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      </div>
    </header>
  );
}
