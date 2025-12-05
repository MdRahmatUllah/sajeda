import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ArrowLeft, Check, Clock, Droplet, Instagram, Play, ChevronLeft, ChevronRight, Sparkles, Shield, Truck, Heart, Share2, ZoomIn, Leaf, MessageCircle } from 'lucide-react';
import OrderModal from '../components/OrderModal';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoaded(true);
    setActiveImageIndex(0);
  }, [id]);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 bg-gradient-to-br from-cream-50 to-white">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6 animate-pulse-soft">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-stone-400" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl mb-4 text-stone-800 text-center">Product not found</h2>
        <p className="text-stone-500 mb-6 text-center text-sm sm:text-base">The candle you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="px-6 sm:px-8 py-3 bg-stone-800 text-white rounded-full font-semibold hover:bg-stone-700 transition-colors text-sm sm:text-base">
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  const isOnSale = product.salePrice && product.salePrice < product.price;
  const discountPercent = isOnSale
    ? Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)
    : 0;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} from Shazeda Candles!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className={`pt-20 sm:pt-24 pb-16 sm:pb-20 bg-gradient-to-b from-cream-50 via-white to-stone-50 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb - Enhanced & Responsive */}
        <nav className="mb-6 sm:mb-8 overflow-x-auto no-scrollbar">
          <ol className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-stone-500 whitespace-nowrap">
            <li>
              <Link to="/" className="hover:text-rose-500 transition-colors">Home</Link>
            </li>
            <li className="text-stone-300">/</li>
            <li>
              <Link to="/shop" className="hover:text-rose-500 transition-colors">Shop</Link>
            </li>
            <li className="text-stone-300">/</li>
            <li className="text-stone-800 font-medium truncate max-w-[150px] sm:max-w-none">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20">

          {/* Left Column: Enhanced Gallery */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-stone-100 to-stone-50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant-lg group">
              <img
                src={product.images[activeImageIndex] || 'https://via.placeholder.com/800'}
                alt={product.name}
                loading="eager"
                fetchPriority="high"
                className={`w-full h-full object-cover transition-all duration-700 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'sm:group-hover:scale-105 cursor-zoom-in'}`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Badges - Responsive */}
              <div className="absolute top-3 sm:top-5 left-3 sm:left-5 flex flex-col gap-1.5 sm:gap-2 z-10">
                {isOnSale && (
                  <span className="badge-shine bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full uppercase tracking-wider sm:tracking-widest text-xs sm:text-sm shadow-lg shadow-rose-500/30">
                    -{discountPercent}% Off
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-sm text-stone-800 font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-wide sm:tracking-wider text-xs sm:text-sm shadow-md">
                    <Sparkles size={12} className="text-amber-500 sm:w-[14px] sm:h-[14px]" />
                    Best Seller
                  </span>
                )}
              </div>

              {/* Sold Out Overlay */}
              {product.inStock === false && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center pointer-events-none z-20">
                  <span className="bg-stone-900 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full uppercase tracking-widest text-base sm:text-lg shadow-xl">
                    Sold Out
                  </span>
                </div>
              )}

              {/* Navigation Arrows - Always visible on mobile, hover on desktop */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white z-10 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-stone-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white z-10 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-stone-800" />
                  </button>
                </>
              )}

              {/* Zoom hint - Desktop only */}
              <div className="hidden sm:flex absolute bottom-4 right-4 items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ZoomIn size={14} />
                Click to zoom
              </div>
            </div>

            {/* Thumbnails - Enhanced & Responsive */}
            {product.images.length > 1 && (
              <div className="hidden sm:flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 ${
                      activeImageIndex === idx
                        ? 'ring-2 ring-rose-400 ring-offset-2 scale-105 shadow-lg'
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Image dots indicator for mobile */}
            {product.images.length > 1 && (
              <div className="flex justify-center gap-2 sm:hidden py-2">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeImageIndex === idx
                        ? 'bg-rose-400 w-6'
                        : 'bg-stone-300 w-2 hover:bg-stone-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Enhanced Details */}
          <div className="flex flex-col lg:sticky lg:top-28 lg:self-start">
            {/* Category & Actions */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 text-rose-500 font-semibold tracking-[0.1em] sm:tracking-[0.15em] text-xs sm:text-sm uppercase">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-400 rounded-full" />
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2.5 sm:p-2.5 rounded-full transition-all duration-300 active:scale-95 ${
                    isFavorite
                      ? 'bg-rose-100 text-rose-500'
                      : 'bg-stone-100 text-stone-500 hover:bg-rose-100 hover:text-rose-500'
                  }`}
                >
                  <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 sm:p-2.5 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors active:scale-95"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Product Title - Responsive */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-stone-900 mb-4 sm:mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Price Display - Enhanced & Responsive */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-6 sm:mb-8">
              {isOnSale ? (
                <>
                  <span className="text-3xl sm:text-4xl font-semibold text-rose-500">
                    £{product.salePrice?.toFixed(2)}
                  </span>
                  <span className="text-lg sm:text-xl text-stone-400 line-through">
                    £{product.price.toFixed(2)}
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 bg-rose-100 text-rose-600 text-xs sm:text-sm font-bold rounded-full">
                    Save {discountPercent}%
                  </span>
                </>
              ) : (
                <span className="text-3xl sm:text-4xl font-semibold text-stone-800">
                  £{product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description - Responsive */}
            <div className="mb-6 sm:mb-8 text-stone-600 leading-relaxed text-base sm:text-lg border-l-2 border-rose-200 pl-3 sm:pl-4">
              <p>{product.fullDescription}</p>
            </div>

            {/* Features - Enhanced Grid - Responsive */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="group p-3 sm:p-4 bg-gradient-to-br from-stone-50 to-white rounded-xl sm:rounded-2xl border border-stone-100 hover:border-rose-200 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <Clock size={16} className="text-rose-500 sm:w-5 sm:h-5" />
                </div>
                <span className="block text-[10px] sm:text-xs uppercase text-stone-400 font-bold tracking-wide mb-0.5 sm:mb-1">Burn Time</span>
                <span className="text-sm sm:text-lg font-semibold text-stone-800">{product.burnTime}</span>
              </div>
              <div className="group p-3 sm:p-4 bg-gradient-to-br from-stone-50 to-white rounded-xl sm:rounded-2xl border border-stone-100 hover:border-amber-200 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <Droplet size={16} className="text-amber-500 sm:w-5 sm:h-5" />
                </div>
                <span className="block text-[10px] sm:text-xs uppercase text-stone-400 font-bold tracking-wide mb-0.5 sm:mb-1">Size</span>
                <span className="text-sm sm:text-lg font-semibold text-stone-800">{product.size}</span>
              </div>
            </div>

            {/* Scent Notes - Enhanced & Responsive */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-serif text-lg sm:text-xl mb-3 sm:mb-4 text-stone-800 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500 sm:w-[18px] sm:h-[18px]" />
                Scent Notes
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.scentNotes.map((note, idx) => (
                  <span
                    key={note}
                    className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-stone-50 to-cream-50 text-stone-700 text-xs sm:text-sm font-medium border border-stone-100 hover:border-rose-200 hover:shadow-sm transition-all"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <Check size={12} className="mr-1.5 sm:mr-2 text-rose-400 sm:w-[14px] sm:h-[14px]" /> {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Proof Link - Enhanced & Responsive */}
            {product.socialLinks && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl sm:rounded-2xl border border-rose-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/30 flex-shrink-0">
                      <Instagram size={18} className="sm:w-[22px] sm:h-[22px]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-stone-800">See it in action</span>
                      <span className="text-xs text-stone-500">Watch our Instagram Reel</span>
                    </div>
                  </div>
                  <a
                    href={product.socialLinks.instagram || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white text-rose-500 rounded-full font-bold text-sm shadow-sm hover:shadow-md hover:scale-105 transition-all active:scale-95 w-full sm:w-auto"
                  >
                    <Play size={14} className="fill-current" />
                    Watch
                  </a>
                </div>
              </div>
            )}

            {/* Trust Badges - Responsive */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-4 lg:gap-6 mb-6 sm:mb-8 py-4 border-y border-stone-100">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-stone-500 text-xs sm:text-sm text-center sm:text-left">
                <Shield size={16} className="text-green-500 flex-shrink-0" />
                <span>Quality</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-stone-500 text-xs sm:text-sm text-center sm:text-left">
                <Truck size={16} className="text-blue-500 flex-shrink-0" />
                <span>Secure Ship</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-stone-500 text-xs sm:text-sm text-center sm:text-left">
                <Leaf size={16} className="text-emerald-500 flex-shrink-0" />
                <span>Eco-Friendly</span>
              </div>
            </div>

            {/* CTA - Enhanced & Responsive */}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!product.inStock}
              className={`group w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-500 ${
                product.inStock
                  ? 'bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-xl shadow-stone-900/20 hover:shadow-stone-900/40 sm:hover:scale-[1.02] active:scale-[0.98] btn-premium'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center justify-center gap-2 sm:gap-3">
                {product.inStock ? (
                  <>
                    <MessageCircle size={18} className="sm:hidden" />
                    Order Now
                    <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform hidden sm:block sm:w-5 sm:h-5" />
                  </>
                ) : (
                  'Out of Stock'
                )}
              </span>
            </button>
            <p className="text-center text-xs sm:text-sm text-stone-400 mt-3 sm:mt-4 px-2">
              ✨ No payment required now — Contact us to complete your order
            </p>
          </div>
        </div>

        {/* Related Products - Enhanced & Responsive */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 lg:mt-32 relative">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

            <div className="pt-12 sm:pt-16 lg:pt-20 text-center mb-8 sm:mb-10 lg:mb-14">
              <span className="inline-flex items-center gap-2 text-rose-400 font-semibold tracking-[0.1em] sm:tracking-[0.15em] text-xs sm:text-sm uppercase mb-3 sm:mb-4">
                <Heart size={14} className="sm:w-4 sm:h-4" />
                You might also love
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-stone-900">Similar Candles</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {relatedProducts.map((p, index) => (
                <div
                  key={p.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetail;
