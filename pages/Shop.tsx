import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Filter, Search, SlidersHorizontal, Grid3X3, LayoutGrid, X, Sparkles, ArrowUpDown } from 'lucide-react';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const Shop: React.FC = () => {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  // Extract unique categories
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.scentNotes.some(note => note.toLowerCase().includes(query))
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep best sellers and new items at the top
        result = [...result].sort((a, b) => {
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, products]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('default');
  };

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery.trim() || sortBy !== 'default';

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Header */}
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cream-50 via-white to-rose-50/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-rose-400 font-semibold tracking-[0.2em] text-sm uppercase mb-4">
            <Sparkles className="w-4 h-4" />
            Our Collection
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-stone-900 mb-6">
            Shop <span className="italic text-rose-400">Candles</span>
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">
            Explore our handcrafted soy candles. Find the perfect scent to match your mood and transform your space.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search and Filter Bar */}
        <div className="sticky top-20 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-4 bg-white/80 backdrop-blur-lg border-b border-stone-100 mb-8 -mt-4 rounded-b-2xl shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search candles, scents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-full text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filter Toggle & Sort */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`lg:hidden flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-all ${
                  showFilters ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-4 pr-10 py-3 bg-stone-100 border border-stone-200 rounded-full text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-300 cursor-pointer hover:bg-stone-200 transition-colors"
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
                <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
              </div>

              {/* Grid Toggle - Desktop only */}
              <div className="hidden xl:flex items-center gap-1 bg-stone-100 p-1 rounded-full">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 rounded-full transition-all ${gridCols === 3 ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 rounded-full transition-all ${gridCols === 4 ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filters - Desktop always visible, Mobile toggle */}
          <div className={`mt-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-lg shadow-rose-500/25'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-rose-300 hover:text-rose-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info & Clear */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-stone-500">
            Showing <span className="font-semibold text-stone-800">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'candle' : 'candles'}
            {selectedCategory !== 'All' && <span> in <span className="text-rose-500">{selectedCategory}</span></span>}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-rose-500 font-medium hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <X size={16} />
              Clear all filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gridCols === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-8 lg:gap-10`}>
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gradient-to-br from-stone-50 to-white rounded-3xl border border-stone-100 shadow-inner-glow">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="font-serif text-2xl text-stone-800 mb-3">No candles found</h3>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">
              We couldn't find any candles matching your search. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-full font-semibold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all hover:scale-105"
            >
              View all candles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;