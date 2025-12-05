import React, { useEffect, useMemo } from 'react';
import { Product } from '../types';
import { X, MessageCircle, Phone, Sparkles, Clock, CheckCircle, Copy, Check } from 'lucide-react';
import { CONTACT_PHONE } from '../constants';

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

// Generate a unique 5-letter order code based on product ID and timestamp
const generateOrderCode = (productId: string): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar chars I,O,0,1
  const timestamp = Date.now().toString(36).toUpperCase();
  const productHash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  let code = '';
  for (let i = 0; i < 5; i++) {
    const index = (productHash + parseInt(timestamp.charAt(i % timestamp.length), 36) + i) % chars.length;
    code += chars[index];
  }
  return code;
};

const OrderModal: React.FC<OrderModalProps> = ({ product, isOpen, onClose }) => {
  const [codeCopied, setCodeCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Generate order code once when modal opens
  const orderCode = useMemo(() => generateOrderCode(product.id), [product.id]);

  if (!isOpen) return null;

  const finalPrice = (product.salePrice && product.salePrice < product.price) ? product.salePrice : product.price;
  const isOnSale = product.salePrice && product.salePrice < product.price;

  // Construct the product URL
  const productUrl = `${window.location.origin}/product/${product.id}`;

  // Enhanced WhatsApp message with product details and link
  const whatsappMessage = encodeURIComponent(
`Hi Shazeda Candles! 👋

I would like to order the *${product.name}*.

🔗 Product Link: ${productUrl}
💰 Price: £${finalPrice.toFixed(2)}${isOnSale ? ` (was £${product.price.toFixed(2)})` : ''}
📋 Order Code: ${orderCode}

Please let me know the next steps to complete my order. Thank you! 🕯️`
  );

  const copyOrderCode = () => {
    navigator.clipboard.writeText(orderCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative header gradient */}
        <div className="absolute top-0 left-0 right-0 h-28 sm:h-32 bg-gradient-to-br from-rose-400 via-rose-500 to-amber-400 opacity-90" />

        {/* Mobile drag handle */}
        <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/40 rounded-full z-20" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 w-11 h-11 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95"
        >
          <X size={20} />
        </button>

        <div className="relative pt-8 sm:pt-8 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
          {/* Header */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto -mt-14 sm:-mt-16 mb-3 sm:mb-4">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-rose-500" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-stone-900 mb-1.5 sm:mb-2">Complete Your Order</h3>
            <p className="text-stone-500 text-sm sm:text-base px-2">
              Contact us directly to purchase this beautiful candle
            </p>
          </div>

          {/* Product Card - Mobile Responsive */}
          <div className="p-3 sm:p-4 bg-gradient-to-br from-stone-50 to-cream-50 rounded-2xl mb-5 sm:mb-6 border border-stone-100">
            {/* Product Info Row */}
            <div className="flex gap-3 sm:gap-4">
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 object-cover rounded-xl shadow-md"
              />
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <p className="font-serif text-base sm:text-xl text-stone-800 mb-1 line-clamp-2 break-words">{product.name}</p>
                <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-rose-500">£{finalPrice.toFixed(2)}</span>
                  {isOnSale && (
                    <span className="text-xs sm:text-sm text-stone-400 line-through">£{product.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Code - Stacks on very small screens */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-stone-200/50">
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-400 uppercase tracking-wide mb-0.5 sm:mb-1">Order Code</p>
                  <p className="font-mono text-base sm:text-lg font-bold text-stone-800 tracking-wider">{orderCode}</p>
                </div>
                <button
                  onClick={copyOrderCode}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 bg-white rounded-lg border border-stone-200 text-stone-600 hover:border-rose-300 hover:text-rose-500 active:scale-95 transition-all text-sm font-medium min-h-[44px] sm:min-h-0 w-full xs:w-auto"
                >
                  {codeCopied ? (
                    <>
                      <Check size={16} className="text-green-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Contact Options - Touch Friendly */}
          <div className="space-y-3">
            <a
              href={`https://wa.me/${CONTACT_PHONE.replace(/\+/g, '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-full min-h-[52px] sm:min-h-[56px] py-3.5 sm:py-4 px-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-2xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 font-semibold gap-2 sm:gap-3 active:scale-[0.98] sm:hover:scale-[1.02]"
            >
              <MessageCircle size={20} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">Order via WhatsApp</span>
              <span className="text-[10px] sm:text-xs bg-white/20 px-2 py-0.5 rounded-full flex-shrink-0">Fastest</span>
            </a>

            <a
              href={`tel:${CONTACT_PHONE}`}
              className="group flex items-center justify-center w-full min-h-[52px] sm:min-h-[56px] py-3.5 sm:py-4 px-4 border-2 border-stone-200 text-stone-600 rounded-2xl hover:border-rose-300 hover:text-rose-500 transition-all duration-300 font-semibold gap-2 sm:gap-3 active:scale-[0.98] sm:hover:scale-[1.02]"
            >
              <Phone size={18} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">Call Us Directly</span>
            </a>
          </div>

          {/* Trust indicators - Responsive */}
          <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-stone-100">
            <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-500">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-500 flex-shrink-0" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;