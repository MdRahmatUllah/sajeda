
import React, { useState } from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { Eye, Sparkles, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isOnSale = product.salePrice && product.salePrice < product.price;
  const [imageLoaded, setImageLoaded] = useState(false);
  const discountPercent = isOnSale
    ? Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      {/* Card Container with lift effect */}
      <div className="relative card-lift">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 shadow-elegant">
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 img-loading" />
          )}

          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges Container - Enhanced */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {isOnSale && (
              <span className="badge-shine bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-rose-500/30">
                -{discountPercent}% Off
              </span>
            )}
            {product.isBestSeller && (
              <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-stone-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                <Sparkles size={12} className="text-amber-500" />
                Best Seller
              </span>
            )}
            {product.isNew && (
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/30">
                New
              </span>
            )}
          </div>

          {/* Sold Out Overlay - Enhanced */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
              <span className="bg-stone-900 text-white font-bold px-6 py-3 rounded-full uppercase tracking-widest text-sm shadow-xl">
                Sold Out
              </span>
            </div>
          )}

          {/* Quick Actions on Hover */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-10">
            <span className="flex items-center gap-2 bg-white text-stone-800 px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:bg-stone-800 hover:text-white transition-colors">
              <Eye size={16} />
              Quick View
            </span>
          </div>

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-2xl" />
        </div>

        {/* Product Info - Enhanced */}
        <div className="mt-5 px-1">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-serif font-medium text-stone-900 group-hover:text-rose-500 transition-colors duration-300 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-stone-400 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-300" />
                {product.category}
              </p>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
              {isOnSale ? (
                <>
                  <span className="text-xl font-semibold text-rose-500">£{product.salePrice?.toFixed(2)}</span>
                  <span className="text-sm text-stone-400 line-through">£{product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-xl font-semibold text-stone-800">£{product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Subtle CTA hint */}
          <div className="mt-3 flex items-center gap-2 text-stone-400 group-hover:text-rose-400 transition-colors text-sm">
            <ShoppingBag size={14} />
            <span className="font-medium">View Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
