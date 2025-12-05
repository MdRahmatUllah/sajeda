import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Instagram, Mail, Shirt, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_LINK, TIKTOK_LINK, VINTED_LINK } from '../constants';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    let timer: any;
    if (clickCount > 0) {
      timer = setTimeout(() => setClickCount(0), 1000);
    }

    if (clickCount >= 5) {
      navigate('/admin');
      setClickCount(0);
    }

    return () => clearTimeout(timer);
  }, [clickCount, navigate]);

  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClickCount(prev => prev + 1);
  };

  return (
    <footer className="relative bg-gradient-to-b from-stone-900 to-stone-950 text-stone-300 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand - Enhanced */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-rose-400" />
              <h3 className="font-serif text-3xl text-white">Shazeda</h3>
            </div>
            <p className="text-stone-400 leading-relaxed mb-6">
              Handcrafted in small batches with sustainable soy wax and premium fragrance oils. Illuminate your moments with warmth and elegance.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-rose-400 font-semibold hover:text-rose-300 transition-colors group"
            >
              Shop Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Navigation - Enhanced */}
          <div>
            <h4 className="font-serif text-xl text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-rose-500/50" />
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop All', path: '/shop' },
                { name: 'Our Story', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-stone-400 hover:text-rose-300 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-rose-400 group-hover:w-3 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections - Enhanced */}
          <div>
            <h4 className="font-serif text-xl text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-rose-500/50" />
              Collections
            </h4>
            <ul className="space-y-3">
              {['Floral Series', 'Luxury Home', 'Gift Sets', 'Seasonal'].map((collection) => (
                <li key={collection}>
                  <Link
                    to="/shop"
                    className="text-stone-400 hover:text-rose-300 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-rose-400 group-hover:w-3 transition-all duration-300" />
                    {collection}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / Contact - Enhanced */}
          <div>
            <h4 className="font-serif text-xl text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-rose-500/50" />
              Connect
            </h4>
            <p className="text-stone-400 mb-6">Follow us for inspiration, new releases, and behind-the-scenes moments.</p>
            <div className="flex gap-3 mb-6">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-stone-800/80 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-rose-500 hover:to-amber-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-rose-500/20"
                title="Instagram"
              >
                <Instagram size={20} className="text-stone-300 group-hover:text-white transition-colors" />
              </a>
              <a
                href={TIKTOK_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-stone-800/80 rounded-xl flex items-center justify-center hover:bg-stone-700 transition-all duration-300 hover:scale-110"
                title="TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-stone-300 group-hover:text-white transition-colors">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href={VINTED_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-stone-800/80 rounded-xl flex items-center justify-center hover:bg-teal-600 transition-all duration-300 hover:scale-110"
                title="Vinted"
              >
                <Shirt size={20} className="text-stone-300 group-hover:text-white transition-colors" />
              </a>
              {/* <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group w-11 h-11 bg-stone-800/80 rounded-xl flex items-center justify-center hover:bg-stone-700 transition-all duration-300 hover:scale-110"
                title="Email"
              >
                <Mail size={20} className="text-stone-300 group-hover:text-white transition-colors" />
              </a> */}
            </div>
            <p className="text-sm text-stone-500">
              {INSTAGRAM_HANDLE}
            </p>
          </div>
        </div>

        {/* Bottom bar - Enhanced */}
        <div className="border-t border-stone-800/50 mt-16 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              onClick={handleSecretClick}
              className="text-sm text-stone-500 cursor-default select-none flex items-center gap-2"
            >
              &copy; {new Date().getFullYear()} Shazeda Candles. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <span>Made with</span>
              <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse-soft" />
              <span>in small batches</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;