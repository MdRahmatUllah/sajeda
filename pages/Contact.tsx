import React from 'react';
import { MessageCircle, Phone, Shirt, Instagram, Sparkles, Clock, Heart, CheckCircle, ArrowRight, MapPin } from 'lucide-react';
import { CONTACT_PHONE, INSTAGRAM_LINK, TIKTOK_LINK, VINTED_LINK, INSTAGRAM_HANDLE } from '../constants';

const Contact: React.FC = () => {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      subtitle: 'Fastest Response',
      description: 'Chat with us directly for quick answers about products, orders, or custom requests.',
      cta: 'Start Chat',
      href: `https://wa.me/${CONTACT_PHONE.replace(/\+/g, '')}`,
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      shadow: 'shadow-green-500/20',
      badge: 'Recommended',
    },
    {
      icon: Phone,
      title: 'Call Us',
      subtitle: 'Direct Line',
      description: 'Prefer to talk? Give us a call during business hours for immediate assistance.',
      cta: 'Call Now',
      href: `tel:${CONTACT_PHONE}`,
      gradient: 'from-blue-400 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      shadow: 'shadow-blue-500/20',
    },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: INSTAGRAM_LINK,
      handle: INSTAGRAM_HANDLE,
      description: 'Behind the scenes, new releases & candle inspiration',
      gradient: 'from-rose-400 via-pink-500 to-amber-400',
      followers: '2.5K+',
    },
    {
      name: 'TikTok',
      icon: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      href: TIKTOK_LINK,
      handle: '@shazedacandles',
      description: 'Watch our candle-making process & tips',
      gradient: 'from-stone-800 to-stone-900',
      followers: '1.2K+',
    },
    {
      name: 'Vinted',
      icon: Shirt,
      href: VINTED_LINK,
      handle: 'shazeda_candles',
      description: 'Shop special deals & limited editions',
      gradient: 'from-teal-400 to-cyan-500',
      followers: 'Shop',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">

      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/id/319/1920/1080"
            alt="Contact us"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900/80" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-rose-300 font-semibold tracking-[0.2em] text-sm uppercase mb-6">
              <Heart size={16} className="fill-current" />
              We'd Love to Hear From You
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Have a question about a scent? Need a custom order? We're here to help make your candle dreams come true.
          </p>
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">

        {/* Primary Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <a
              key={method.title}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`group relative bg-gradient-to-br ${method.bgGradient} p-8 md:p-10 rounded-3xl border border-white/50 shadow-xl ${method.shadow} hover:shadow-2xl transition-all duration-500 card-lift animate-fade-in-up overflow-hidden`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Badge */}
              {method.badge && (
                <span className="absolute top-6 right-6 px-3 py-1 bg-white/90 backdrop-blur-sm text-green-600 text-xs font-bold rounded-full shadow-sm">
                  {method.badge}
                </span>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${method.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <method.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-serif text-2xl text-stone-800">{method.title}</h3>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{method.subtitle}</span>
                </div>
                <p className="text-stone-600 leading-relaxed">{method.description}</p>
              </div>

              {/* CTA */}
              <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${method.gradient} text-white font-semibold rounded-full shadow-lg ${method.shadow} group-hover:shadow-xl transition-all`}>
                {method.cta}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>

        {/* Response Time & Trust Indicators */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-stone-100 mb-16 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-amber-500" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-800">Quick Response</h4>
                <p className="text-stone-500 text-sm">Usually within 1 hour</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-800">Trusted Seller</h4>
                <p className="text-stone-500 text-sm">100% positive feedback</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center">
                <MapPin className="w-7 h-7 text-rose-500" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-800">UK Based</h4>
                <p className="text-stone-500 text-sm">Fast domestic shipping</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-rose-400 font-semibold tracking-[0.15em] text-sm uppercase mb-4">
              <Sparkles size={16} />
              Follow Our Journey
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">Connect on Social</h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              Join our community for behind-the-scenes content, new releases, and exclusive deals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 card-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon & Stats Row */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${social.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {typeof social.icon === 'function' ? <social.icon /> : <social.icon className="w-7 h-7" />}
                  </div>
                  <span className="px-3 py-1 bg-stone-100 text-stone-600 text-sm font-semibold rounded-full">
                    {social.followers}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl text-stone-800 mb-1">{social.name}</h3>
                <p className="text-rose-400 text-sm font-medium mb-3">{social.handle}</p>
                <p className="text-stone-500 text-sm">{social.description}</p>

                {/* Hover indicator */}
                <div className="mt-6 flex items-center gap-2 text-stone-400 group-hover:text-rose-500 transition-colors">
                  <span className="text-sm font-medium">Follow</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-10 h-10 text-rose-400 mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
            Ready to Find Your Perfect Scent?
          </h2>
          <p className="text-stone-400 mb-8 max-w-xl mx-auto">
            Browse our handcrafted collection and discover candles made with love and the finest ingredients.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-rose-400 to-rose-500 text-white font-bold text-lg rounded-full shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300 btn-premium"
          >
            Shop Our Collection
            <ArrowRight size={22} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;