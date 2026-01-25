import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Music } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="luxury-container section-padding">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4 sm:space-y-6">
            <h2 className="font-serif text-xl sm:text-2xl">
              <span className="text-white">Modest</span>
              <span className="text-white"> Way</span>
              <span className="text-white"> Fashion</span>
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              UAE-born. Culture-inspired. Redefining luxury modest fashion for the modern woman.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/modest_way_fashion?igsh=OXkzb3k1aWd0ZHl4&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="https://www.facebook.com/share/1C4XdXZDWi/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="https://www.tiktok.com/@modestwayfashion?_r=1&_t=ZS-93Knz5mBfZY" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Music size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-serif text-base sm:text-lg text-foreground">Shop</h3>
            <nav className="flex flex-col space-y-2 sm:space-y-3">
              <Link to="/shop?tag=new_drop" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                New Arrivals
              </Link>
              <Link to="/shop?category=abayas" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                Abayas
              </Link>
              <Link to="/shop?category=kaftans" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                Kaftans
              </Link>
              <Link to="/shop?tag=sale" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                Sale
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-serif text-base sm:text-lg text-foreground">Company</h3>
            <nav className="flex flex-col space-y-2 sm:space-y-3">
              <Link to="/about" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link to="/faq" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
              <Link to="/wholesale" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                Wholesale
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-serif text-base sm:text-lg text-foreground">Customer Care</h3>
            <nav className="flex flex-col space-y-2 sm:space-y-3">
              <Link to="/shipping" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                Shipping & Delivery
              </Link>
              <Link to="/returns" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                Returns & Exchanges
              </Link>
              <Link to="/size-guide" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                Size Guide
              </Link>
              <Link to="/wholesale" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                Wholesale Inquiries
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-serif text-base sm:text-lg text-foreground">Contact</h3>
            <div className="flex flex-col space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Dubai Design District<br />Building 7, Dubai, UAE
                </span>
              </div>
              <a href="tel:+971556020293" className="flex items-center space-x-3 hover:text-primary transition-colors group">
                <Phone size={16} className="sm:w-[18px] sm:h-[18px] text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-primary">+971 55 602 0293</span>
              </a>
              <a href="mailto:modestwayfashion@gmail.com" className="flex items-center space-x-3 hover:text-primary transition-colors group">
                <Mail size={16} className="sm:w-[18px] sm:h-[18px] text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-primary break-all">modestwayfashion@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © 2026 Modest Way Fashion. All rights reserved.
          </p>
          <div className="flex space-x-4 sm:space-x-6">
            <Link to="/privacy" className="text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
