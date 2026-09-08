import { useState } from 'react';
import logo from '@/assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { MdShoppingCart, MdFavoriteBorder, MdAccountCircle } from 'react-icons/md';
import { useStore } from '@/hooks/useStore';
import { useAuth } from '@/contexts/AuthContext';
import { SearchBar } from './SearchBar';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount, wishlist, dispatch } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate(user ? '/account' : '/auth');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
      <div className="luxury-container">
        <div className="flex items-center justify-between h-20 sm:h-24 md:h-28">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center py-1.5 group" aria-label="Modest Way Fashion Dubai">
            <img
              src={logo}
              alt="Modest Way Fashion Dubai"
              className="h-16 sm:h-20 md:h-24 lg:h-26 w-auto max-w-[240px] sm:max-w-[320px] md:max-w-[420px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <NavLinks />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <SearchBar isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />

            {/* Desktop-only: wishlist + account + cart icons (mobile uses bottom nav) */}
            <Link
              to="/wishlist"
              className="hidden md:inline-flex p-2 text-foreground/80 hover:text-foreground transition-colors relative group"
              aria-label="Wishlist"
            >
              <MdFavoriteBorder size={22} className="group-hover:text-secondary transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={handleAccountClick}
              className="hidden md:inline-flex p-2 text-foreground/80 hover:text-foreground transition-colors group"
              aria-label={user ? 'Account' : 'Sign in'}
            >
              <MdAccountCircle size={22} className="group-hover:text-primary transition-colors" />
            </button>

            <button
              className="hidden md:inline-flex p-2 text-foreground/80 hover:text-foreground transition-colors relative group"
              onClick={() => dispatch({ type: 'TOGGLE_CART', payload: true })}
              aria-label="Cart"
            >
              <MdShoppingCart size={22} className="group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button — moved to RIGHT for thumb reach */}
            <button
              className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      </div>
    </header>
  );
}
