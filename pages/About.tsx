import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Heart, Shield, Flame, ArrowRight, Quote, Star } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Leaf,
      title: 'Sustainable',
      description: 'We use soy wax derived from American-grown soybeans for an eco-friendly, clean burn that is biodegradable and renewable.',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Shield,
      title: 'Non-Toxic',
      description: 'Our fragrances are free from carcinogens, reproductive toxins, and other potentially hazardous chemicals.',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Heart,
      title: 'Handcrafted',
      description: 'Each candle is hand-poured in small batches with intention, care, and attention to every detail.',
      color: 'from-rose-400 to-pink-500',
      bgColor: 'bg-rose-50',
    },
    {
      icon: Flame,
      title: 'Premium Quality',
      description: 'We use only the finest fragrance oils and materials to ensure a long-lasting, beautiful burn every time.',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">

      {/* Hero Section - Enhanced */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/id/204/1920/1080"
            alt="Making candles"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/70" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-rose-300 font-semibold tracking-[0.2em] text-sm uppercase mb-6">
              <Sparkles size={16} />
              Our Story
              <Sparkles size={16} />
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Crafted with <span className="gradient-text">Passion</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Every candle tells a story of dedication, sustainability, and the art of slow craftsmanship
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Story Card - Floating */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white p-8 md:p-14 rounded-3xl shadow-2xl shadow-stone-900/10 border border-stone-100 animate-fade-in-up">
          {/* Decorative quote icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Quote className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-stone-800 mb-8 text-center">
            Handcrafted <span className="text-rose-500">Illumination</span>
          </h2>

          <div className="prose prose-stone prose-lg mx-auto text-stone-600 text-center max-w-3xl">
            <p className="text-lg md:text-xl leading-relaxed mb-6">
              Welcome to <strong className="text-stone-800">Shazeda Candles</strong>. What started as a small passion project has blossomed into a beloved collection of artisanal home fragrances, also known to our fans as <em className="text-rose-500 not-italic font-semibold">Crazy Candles</em>.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              My name is Shazeda, and I believe that a candle is more than just wax and a wick. It's a memory, a mood, and a moment of peace in a chaotic world. I founded this brand with a simple mission: to create high-quality, eco-conscious candles that look as beautiful as they smell.
            </p>
            <p className="text-lg leading-relaxed">
              Each candle is hand-poured in small batches using 100% natural soy wax, cotton wicks, and premium phthalate-free fragrance oils. We take pride in the slow process of candle making—measuring, melting, mixing, and pouring with intention and care.
            </p>
          </div>

          {/* Signature */}
          <div className="mt-10 text-center">
            <p className="font-serif text-2xl text-stone-800 italic">— Shazeda</p>
            <p className="text-sm text-stone-400 mt-1">Founder & Artisan</p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-rose-400 font-semibold tracking-[0.15em] text-sm uppercase mb-4">
              <Heart size={16} className="fill-current" />
              What We Stand For
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Our Values</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Every decision we make is guided by our commitment to quality, sustainability, and your wellbeing
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group p-8 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 card-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 ${value.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className={`w-7 h-7 bg-gradient-to-r ${value.color} bg-clip-text`} style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text' }} />
                  <value.icon className={`w-7 h-7 absolute opacity-100`} style={{ color: value.color.includes('green') ? '#22c55e' : value.color.includes('blue') ? '#3b82f6' : value.color.includes('rose') ? '#f43f5e' : '#f59e0b' }} />
                </div>
                <h3 className="font-serif text-xl text-stone-800 mb-3">{value.title}</h3>
                <p className="text-stone-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-20 bg-gradient-to-b from-stone-50 to-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-amber-500 font-semibold tracking-[0.15em] text-sm uppercase mb-4">
              <Flame size={16} className="fill-current" />
              The Art of Candle Making
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Our Process</h2>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Source', desc: 'We carefully select sustainable soy wax and premium fragrance oils from trusted suppliers.' },
              { step: '02', title: 'Craft', desc: 'Each candle is hand-poured in small batches with precise temperature control and timing.' },
              { step: '03', title: 'Cure', desc: 'Our candles cure for the optimal time to ensure the best scent throw and burn quality.' },
            ].map((item, index) => (
              <div
                key={item.step}
                className="relative p-8 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <span className="text-8xl font-serif text-stone-100 absolute top-0 left-1/2 -translate-x-1/2 select-none">{item.step}</span>
                <div className="relative pt-12">
                  <h3 className="font-serif text-2xl text-stone-800 mb-4">{item.title}</h3>
                  <p className="text-stone-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-24 bg-gradient-to-r from-stone-900 to-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <blockquote className="font-serif text-2xl md:text-3xl text-white leading-relaxed mb-8 animate-fade-in-up">
            "The attention to detail and quality of Shazeda Candles is unmatched. Every time I light one, my home transforms into a sanctuary of peace and beautiful fragrance."
          </blockquote>
          <p className="text-rose-300 font-medium">— A Happy Customer</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6 animate-fade-in-up">
            Ready to Experience the Magic?
          </h2>
          <p className="text-lg text-stone-500 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Explore our collection and find the perfect candle for your space
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-rose-400 to-rose-500 text-white font-bold text-lg rounded-full shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300 btn-premium animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Shop Our Collection
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;