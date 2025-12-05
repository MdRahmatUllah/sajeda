
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, Leaf, Heart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useContent } from '../context/ContentContext';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { products } = useProducts();
  const { heroContent } = useContent();
  const featuredProducts = products.filter(p => p.isBestSeller).slice(0, 3);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Enhanced with parallax and animations */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-300/5 rounded-full blur-3xl" />
        </div>

        {/* Background Image with Enhanced Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroContent.backgroundImageUrl}
            alt="Candle Hero"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover scale-105 transition-transform duration-[20s] hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900/60 via-stone-900/40 to-rose-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />
          {/* Subtle grain texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 /%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 /%3E%3C/svg%3E')]" />
        </div>

        {/* Decorative floating candle flame icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Sparkles className={`absolute top-[15%] left-[10%] w-6 h-6 text-amber-300/40 animate-float transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0s' }} />
          <Sparkles className={`absolute top-[25%] right-[15%] w-4 h-4 text-rose-300/40 animate-float transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1s' }} />
          <Sparkles className={`absolute bottom-[30%] left-[20%] w-5 h-5 text-amber-200/30 animate-float transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '2s' }} />
        </div>

        {/* Hero Content - Enhanced animations */}
        <div className={`relative z-10 text-center max-w-4xl px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Animated Badge */}
          <span className={`inline-flex items-center gap-2 py-2 px-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm tracking-[0.2em] uppercase mb-6 shadow-lg transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <Sparkles className="w-4 h-4 text-amber-300" />
            {heroContent.badge}
          </span>

          {/* Main Title with elegant styling */}
          <h1 className={`font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[1.1] transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="block font-medium">{heroContent.titleLine1}</span>
            <span className="block italic font-light text-rose-200 mt-2">{heroContent.titleAccent}</span>
          </h1>

          {/* Description with enhanced readability */}
          <p className={`text-lg md:text-xl text-white/90 mb-12 font-light max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {heroContent.description}
          </p>

          {/* CTA Buttons - Enhanced styling */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <Link
              to={heroContent.primaryCtaLink}
              className="group relative px-10 py-4 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-full font-semibold text-lg overflow-hidden shadow-xl shadow-rose-900/30 hover:shadow-rose-500/40 transition-all duration-500 hover:scale-105 btn-premium"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {heroContent.primaryCtaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to={heroContent.secondaryCtaLink}
              className="group px-10 py-4 glass text-white border border-white/30 rounded-full font-semibold text-lg hover:bg-white hover:text-stone-900 transition-all duration-500 hover:scale-105"
            >
              {heroContent.secondaryCtaText}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Intro / Value Prop - Enhanced with animations */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white to-cream-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block text-rose-400 font-semibold tracking-[0.2em] text-sm uppercase mb-4">Why Choose Us</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 mb-6">The Art of <span className="italic text-rose-400">Slow Living</span></h2>
          <p className="text-stone-500 max-w-2xl mx-auto mb-16 text-lg">Crafted with intention, our candles transform ordinary moments into extraordinary experiences.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1 */}
            <div className="group p-8 bg-white rounded-2xl shadow-elegant hover:shadow-elegant-lg transition-all duration-500 card-lift border border-stone-100">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <Star size={28} className="text-rose-400" fill="currentColor" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-stone-800">Premium Soy Wax</h3>
              <p className="text-stone-500 leading-relaxed">Eco-friendly, renewable, and burns cleaner and longer than traditional waxes for a pure experience.</p>
            </div>

            {/* Card 2 */}
            <div className="group p-8 bg-white rounded-2xl shadow-elegant hover:shadow-elegant-lg transition-all duration-500 card-lift border border-stone-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <Leaf size={28} className="text-amber-500" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-stone-800">Clean Fragrances</h3>
              <p className="text-stone-500 leading-relaxed">Phthalate-free scents inspired by nature, memories, and seasons that fill your space beautifully.</p>
            </div>

            {/* Card 3 */}
            <div className="group p-8 bg-white rounded-2xl shadow-elegant hover:shadow-elegant-lg transition-all duration-500 card-lift border border-stone-100">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <Heart size={28} className="text-rose-400" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-stone-800">Made with Love</h3>
              <p className="text-stone-500 leading-relaxed">Every single candle is poured, labeled, and packaged by hand with care and attention to detail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers - Enhanced section */}
      <section className="py-24 md:py-32 bg-stone-50 relative">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-rose-400 font-semibold tracking-[0.15em] text-sm uppercase">
                <Sparkles className="w-4 h-4" />
                Shop Favorites
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mt-3">Best Sellers</h2>
              <p className="text-stone-500 mt-3 max-w-md">Discover our most-loved candles, chosen by customers for their exceptional quality and captivating scents.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-stone-600 hover:text-rose-400 font-semibold transition-all duration-300 group">
              View All
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="stagger-{index + 1}">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="mt-14 text-center md:hidden">
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-stone-800 text-white rounded-full font-semibold hover:bg-stone-700 transition-colors shadow-lg">
              View All Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection Banner - Enhanced with parallax feel */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-cream-50 to-rose-50/30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative rounded-3xl overflow-hidden min-h-[550px] flex items-center group shadow-elegant-lg">
            {/* Background Image with hover zoom */}
            <div className="absolute inset-0 img-zoom">
              <img
                src="https://picsum.photos/id/401/1600/900"
                alt="Gift Sets"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />

            {/* Decorative elements */}
            <div className="absolute top-8 right-8 flex gap-2">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
                Limited Edition
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-16 max-w-xl">
              <span className="inline-block text-rose-300 font-semibold tracking-[0.15em] text-sm uppercase mb-4">Special Collection</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                Curated <br/><span className="italic font-light text-rose-200">Gift Sets</span>
              </h2>
              <p className="text-white/80 mb-10 text-lg leading-relaxed">
                Perfect for birthdays, holidays, or simply treating yourself. Our gift sets come beautifully packaged and ready to give.
              </p>
              <Link
                to="/shop"
                className="group/btn inline-flex items-center gap-3 bg-white text-stone-900 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
              >
                Shop Gift Sets
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Trust Section */}
      <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-6" />
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl italic leading-relaxed mb-8 text-white/90">
            "The most beautiful candles I've ever owned. The scents are divine and they make my home feel like a sanctuary."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-white/60">— Happy Customer</span>
          </div>
        </div>
      </section>

      {/* Newsletter/CTA Section */}
      <section className="py-24 bg-gradient-to-b from-stone-900 to-stone-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">Ready to Transform <span className="italic text-rose-300">Your Space?</span></h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Explore our handcrafted collection and find the perfect candle to illuminate your moments.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-full font-semibold text-lg shadow-xl shadow-rose-900/30 hover:shadow-rose-500/40 hover:scale-105 transition-all duration-500 btn-premium"
          >
            Browse All Candles
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
