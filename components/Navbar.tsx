import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Check if we're on homepage (to show transparent navbar)
  const isHomePage = location.pathname === '/';
  const showTransparent = isHomePage && !isScrolled && !isOpen;

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          showTransparent
            ? 'bg-transparent py-6'
            : 'bg-white/95 backdrop-blur-lg shadow-elegant py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo - Enhanced */}
            <Link to="/" className="flex items-center gap-3 group relative">
              {/* Decorative flame icon */}
              <div className={`relative transition-colors duration-300 ${showTransparent ? 'text-rose-300' : 'text-rose-400'}`}>
                <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className={`font-serif text-2xl md:text-3xl font-medium tracking-tight transition-colors duration-300 ${
                  showTransparent ? 'text-white' : 'text-stone-900 group-hover:text-rose-500'
                }`}>
                  Shazeda
                </span>
                <span className={`text-[10px] tracking-[0.3em] uppercase font-medium -mt-1 transition-colors duration-300 ${
                  showTransparent ? 'text-white/70' : 'text-stone-400'
                }`}>
                  Candles
                </span>
              </div>
            </Link>

            {/* Desktop Nav - Enhanced */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-all duration-300 hover-underline ${
                    location.pathname === link.path
                      ? showTransparent ? 'text-rose-300' : 'text-rose-500'
                      : showTransparent ? 'text-white/90 hover:text-white' : 'text-stone-600 hover:text-rose-500'
                  }`}
                >
                  {link.name}
                  {/* Active indicator dot */}
                  {location.pathname === link.path && (
                    <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${showTransparent ? 'bg-rose-300' : 'bg-rose-500'}`} />
                  )}
                </Link>
              ))}

              {/* CTA Button - Enhanced */}
              <Link
                to="/shop"
                className={`ml-4 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-500 flex items-center gap-2 shadow-lg btn-premium ${
                  showTransparent
                    ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-stone-900'
                    : 'bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105'
                }`}
              >
                <ShoppingBag size={16} />
                Shop Now
              </Link>
            </div>

            {/* Mobile Toggle - Enhanced */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  showTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-stone-800 hover:bg-stone-100'
                }`}
                aria-label="Toggle menu"
              >
                <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'}`}>
                  <Menu size={24} />
                </span>
                <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'}`}>
                  <X size={24} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Enhanced */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white/98 backdrop-blur-lg border-t border-stone-100 shadow-2xl transition-all duration-500 ease-out ${
            isOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="px-6 py-8 space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                style={{ animationDelay: `${index * 0.05}s` }}
                className={`block py-3 px-4 text-lg font-serif rounded-xl transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-rose-500 bg-rose-50'
                    : 'text-stone-800 hover:text-rose-500 hover:bg-stone-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4">
              <Link
                to="/shop"
                className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-rose-400 to-rose-500 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all btn-premium"
              >
                <ShoppingBag size={20} />
                Browse All Candles
              </Link>
            </div>

            {/* Decorative element */}
            <div className="pt-6 flex items-center justify-center gap-2 text-stone-400">
              <Sparkles size={14} />
              <span className="text-xs tracking-widest uppercase">Handcrafted with Love</span>
              <Sparkles size={14} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;