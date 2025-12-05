import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useContent } from '../context/ContentContext';
import { Product, HeroContent, HeroSection } from '../types';
import { Trash2, Plus, ArrowLeft, LayoutTemplate, Package, RotateCcw, Wand2, Loader2, RefreshCw, Check, Sparkles, AlertCircle, PenLine, Lock, LogOut, Eye, EyeOff, Edit3, Zap, X, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateProductInfo, isAzureOpenAIConfigured, AIGeneratedProduct } from '../utils/azureOpenAI';

// Authentication constants
const AUTH_STORAGE_KEY = 'shazeda_admin_auth';
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || '';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

const initialProduct: Product = {
  id: '',
  name: '',
  category: 'Floral',
  price: 0,
  salePrice: undefined,
  shortDescription: '',
  fullDescription: '',
  images: [],
  scentNotes: [],
  burnTime: '',
  size: '',
  inStock: true,
  isBestSeller: false,
  isNew: false
};

const Admin: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored === 'true';
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs: 'products' | 'content'
  const [activeTab, setActiveTab] = useState<'products' | 'content'>('products');

  // Product Logic
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Product>(initialProduct);
  const [imageInput, setImageInput] = useState('');
  const [scentInput, setScentInput] = useState('');

  // AI Assistant State
  const [inputMode, setInputMode] = useState<'manual' | 'ai'>('manual');
  const [aiDescription, setAiDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AIGeneratedProduct | null>(null);
  const [selectedNameIndex, setSelectedNameIndex] = useState<number>(0);
  const [aiFieldsApplied, setAiFieldsApplied] = useState(false);

  // Content Logic - Multiple Hero Sections
  const { heroContent, heroSections, activeHeroSection, addHeroSection, updateHeroSection, deleteHeroSection, activateHeroSection, resetHeroContent } = useContent();
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [heroForm, setHeroForm] = useState<HeroSection | null>(null);
  const [isCreatingHero, setIsCreatingHero] = useState(false);

  // Initial hero form for creating new hero sections
  const initialHeroForm: Omit<HeroSection, 'id' | 'createdAt' | 'isActive'> = {
    name: '',
    badge: '',
    titleLine1: '',
    titleAccent: '',
    description: '',
    backgroundImageUrl: '',
    primaryCtaText: 'Shop Collection',
    primaryCtaLink: '/shop',
    secondaryCtaText: 'Our Story',
    secondaryCtaLink: '/about'
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    // Simulate a brief delay for UX
    setTimeout(() => {
      if (loginUsername === ADMIN_USERNAME && loginPassword === ADMIN_PASSWORD) {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        setIsAuthenticated(true);
        setLoginUsername('');
        setLoginPassword('');
      } else {
        setLoginError('Invalid username or password. Please try again.');
      }
      setIsLoggingIn(false);
    }, 500);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  // Sync Hero Form when editing
  useEffect(() => {
    if (editingHeroId) {
      const heroToEdit = heroSections.find(h => h.id === editingHeroId);
      if (heroToEdit) {
        setHeroForm(heroToEdit);
      }
    }
  }, [editingHeroId, heroSections]);

  // Hero Section Handlers
  const handleStartCreateHero = () => {
    setIsCreatingHero(true);
    setEditingHeroId(null);
    setHeroForm({ ...initialHeroForm, id: '', createdAt: 0, isActive: false } as HeroSection);
  };

  const handleEditHero = (hero: HeroSection) => {
    setEditingHeroId(hero.id);
    setIsCreatingHero(false);
    setHeroForm(hero);
  };

  const handleCancelHeroEdit = () => {
    setEditingHeroId(null);
    setIsCreatingHero(false);
    setHeroForm(null);
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm) return;

    if (isCreatingHero) {
      addHeroSection({
        name: heroForm.name,
        badge: heroForm.badge,
        titleLine1: heroForm.titleLine1,
        titleAccent: heroForm.titleAccent,
        description: heroForm.description,
        backgroundImageUrl: heroForm.backgroundImageUrl,
        primaryCtaText: heroForm.primaryCtaText,
        primaryCtaLink: heroForm.primaryCtaLink,
        secondaryCtaText: heroForm.secondaryCtaText,
        secondaryCtaLink: heroForm.secondaryCtaLink
      });
      alert('Hero section created successfully!');
    } else if (editingHeroId) {
      updateHeroSection(heroForm);
      alert('Hero section updated successfully!');
    }

    handleCancelHeroEdit();
  };

  const handleDeleteHero = (id: string) => {
    const hero = heroSections.find(h => h.id === id);
    if (hero?.isActive) {
      alert('Cannot delete the active hero section. Please activate another hero first.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this hero section?')) {
      deleteHeroSection(id);
    }
  };

  const handleActivateHero = (id: string) => {
    activateHeroSection(id);
  };

  // Reset Product Form when switching modes
  useEffect(() => {
    if (editingId) {
      const productToEdit = products.find(p => p.id === editingId);
      if (productToEdit) {
        setFormData(productToEdit);
        setImageInput(productToEdit.images.join('\n'));
        setScentInput(productToEdit.scentNotes.join(', '));
      }
      // Reset AI state when editing existing product
      setAiSuggestions(null);
      setAiFieldsApplied(false);
      setInputMode('manual');
    } else {
      setFormData({ ...initialProduct, id: Date.now().toString() });
      setImageInput('');
      setScentInput('');
      setAiSuggestions(null);
      setAiFieldsApplied(false);
    }
  }, [editingId, products]);

  // AI Generation Handler
  const handleAIGenerate = async () => {
    if (!aiDescription.trim()) {
      setAiError('Please describe the product you want to create');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    const result = await generateProductInfo(aiDescription);

    if (result.success) {
      setAiSuggestions(result.data);
      setSelectedNameIndex(0);
      setAiFieldsApplied(false);
    } else {
      setAiError(result.error.message);
    }

    setAiLoading(false);
  };

  // Apply AI suggestions to form
  const applyAISuggestions = () => {
    if (!aiSuggestions) return;

    const selectedName = aiSuggestions.productNames[selectedNameIndex] || aiSuggestions.productNames[0];

    setFormData({
      ...formData,
      name: selectedName,
      price: aiSuggestions.price,
      salePrice: aiSuggestions.salePrice || undefined,
      category: aiSuggestions.category,
      shortDescription: aiSuggestions.shortDescription,
      fullDescription: aiSuggestions.fullDescription,
      size: aiSuggestions.size,
      burnTime: aiSuggestions.burnTime,
    });
    setScentInput(aiSuggestions.scentNotes.join(', '));
    setAiFieldsApplied(true);
    setInputMode('manual'); // Switch to manual mode to allow editing
  };

  // Handlers - Product
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedData: Product = {
      ...formData,
      images: imageInput.split('\n').map(s => s.trim()).filter(Boolean),
      scentNotes: scentInput.split(',').map(s => s.trim()).filter(Boolean),
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined
    };
    if (editingId) {
      updateProduct(processedData);
    } else {
      addProduct({ ...processedData, id: Date.now().toString() });
    }
    setEditingId(null);
    // Reset AI state after submission
    setAiSuggestions(null);
    setAiDescription('');
    setAiFieldsApplied(false);
    alert(editingId ? 'Product updated!' : 'Product created!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      if (editingId === id) setEditingId(null);
    }
  };

  // Login Page - shown when not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-rose-50/30 to-stone-100 flex items-center justify-center px-4 py-12">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo/Brand Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="font-serif text-3xl text-stone-800 mb-2">Shazeda Candles</h1>
              <p className="text-stone-500 text-sm">Admin Portal</p>
            </Link>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-800 to-stone-600 rounded-xl flex items-center justify-center shadow-lg">
                <Lock size={24} className="text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-serif text-stone-800 text-center mb-2">Welcome Back</h2>
            <p className="text-stone-500 text-center text-sm mb-8">Sign in to access the admin dashboard</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Username</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all bg-white/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all bg-white/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-gradient-to-r from-stone-800 to-stone-700 text-white rounded-xl font-medium hover:from-stone-700 hover:to-stone-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-stone-100">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 text-sm text-stone-500 hover:text-rose-500 transition-colors"
              >
                <ArrowLeft size={16} />
                Return to Store
              </Link>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-stone-400 mt-6">
            Protected area. Authorized access only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-white rounded-full text-stone-600 hover:text-rose-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-serif text-3xl text-stone-900">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-white p-1 rounded-lg shadow-sm">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'products' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Package size={18} /> Products
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'content' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <LayoutTemplate size={18} /> Site Content
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-stone-600 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-stone-200"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <>
            <div className="flex justify-end mb-6">
               <button 
                onClick={() => setEditingId(null)}
                className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
              >
                <Plus size={18} /> Add New Product
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product List */}
              <div className="lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden h-[80vh] flex flex-col">
                <div className="p-4 border-b border-stone-100 bg-stone-50">
                  <h2 className="font-bold text-stone-700">All Products ({products.length})</h2>
                </div>
                <div className="overflow-y-auto flex-1 p-4 space-y-3">
                  {products.map(product => {
                      const onSale = product.salePrice && product.salePrice < product.price;
                      return (
                        <div 
                          key={product.id}
                          onClick={() => setEditingId(product.id)}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            editingId === product.id 
                              ? 'border-rose-400 bg-rose-50' 
                              : 'border-stone-100 hover:border-stone-300'
                          }`}
                        >
                          <img 
                            src={product.images[0] || 'https://via.placeholder.com/50'} 
                            alt={product.name} 
                            className="w-12 h-12 rounded bg-stone-200 object-cover" 
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-stone-900 truncate">{product.name}</h3>
                            <div className="flex items-center gap-2 text-xs">
                                {onSale ? (
                                    <>
                                        <span className="text-red-500 font-bold">£{product.salePrice}</span>
                                        <span className="text-stone-400 line-through">£{product.price}</span>
                                    </>
                                ) : (
                                    <span className="text-stone-500">£{product.price}</span>
                                )}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                            className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                  })}
                </div>
              </div>

              {/* Product Form */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 md:p-8 h-fit">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-stone-900">
                    {editingId ? 'Edit Product' : 'Create New Product'}
                  </h2>

                  {/* Input Mode Toggle - Only show for new products */}
                  {!editingId && (
                    <div className="flex bg-stone-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setInputMode('manual')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          inputMode === 'manual'
                            ? 'bg-white text-stone-800 shadow-sm'
                            : 'text-stone-500 hover:text-stone-700'
                        }`}
                      >
                        <PenLine size={16} />
                        Manual
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMode('ai')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          inputMode === 'ai'
                            ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-sm'
                            : 'text-stone-500 hover:text-stone-700'
                        }`}
                      >
                        <Wand2 size={16} />
                        AI Assistant
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Assistant Section */}
                {inputMode === 'ai' && !editingId && (
                  <div className="mb-8 p-5 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-800">AI Product Generator</h3>
                        <p className="text-xs text-stone-500">Describe your product and let AI create the details</p>
                      </div>
                    </div>

                    {!isAzureOpenAIConfigured() && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                        <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-700">
                          Azure OpenAI is not configured. Add your API credentials to <code className="bg-amber-100 px-1 rounded">.env.local</code>
                        </p>
                      </div>
                    )}

                    <textarea
                      value={aiDescription}
                      onChange={(e) => setAiDescription(e.target.value)}
                      placeholder="Example: A lavender-scented candle with calming properties. Made with soy wax, burns for about 40 hours. Size is 200g. Perfect for relaxation and bedtime routines..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-violet-200 focus:ring-2 focus:ring-violet-300 outline-none resize-none mb-4"
                    />

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleAIGenerate}
                        disabled={aiLoading || !isAzureOpenAIConfigured()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg font-medium hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        {aiLoading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 size={18} />
                            Generate with AI
                          </>
                        )}
                      </button>

                      {aiSuggestions && (
                        <button
                          type="button"
                          onClick={handleAIGenerate}
                          disabled={aiLoading}
                          className="flex items-center gap-2 px-4 py-2.5 border border-violet-300 text-violet-600 rounded-lg font-medium hover:bg-violet-50 transition-all disabled:opacity-50"
                        >
                          <RefreshCw size={16} />
                          Retry
                        </button>
                      )}
                    </div>

                    {aiError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{aiError}</p>
                      </div>
                    )}

                    {/* AI Generated Name Suggestions */}
                    {aiSuggestions && (
                      <div className="mt-6 pt-6 border-t border-violet-200">
                        <h4 className="font-medium text-stone-700 mb-3 flex items-center gap-2">
                          <Check size={16} className="text-green-500" />
                          Select a Product Name
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                          {aiSuggestions.productNames.map((name, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedNameIndex(idx)}
                              className={`p-3 rounded-lg border-2 text-left transition-all ${
                                selectedNameIndex === idx
                                  ? 'border-violet-500 bg-violet-50 text-violet-800'
                                  : 'border-stone-200 hover:border-violet-300 text-stone-700'
                              }`}
                            >
                              <span className="font-medium">{name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Preview Card */}
                        <div className="p-4 bg-white rounded-lg border border-stone-200 mb-4">
                          <h5 className="text-xs uppercase tracking-wide text-stone-400 mb-2">Preview</h5>
                          <p className="font-serif text-lg text-stone-800 mb-1">{aiSuggestions.productNames[selectedNameIndex]}</p>
                          <p className="text-sm text-stone-500 mb-2">{aiSuggestions.shortDescription}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="font-semibold text-rose-500">£{aiSuggestions.price}</span>
                            {aiSuggestions.salePrice && (
                              <span className="text-stone-400 line-through">was £{aiSuggestions.salePrice}</span>
                            )}
                            <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600">{aiSuggestions.category}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={applyAISuggestions}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition-all"
                        >
                          <Check size={18} />
                          Apply to Form & Continue Editing
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Applied Indicator */}
                {aiFieldsApplied && (
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <Check size={18} className="text-green-500" />
                    <p className="text-sm text-green-700">AI suggestions applied! You can now edit any field below.</p>
                  </div>
                )}

                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Product Name
                        {aiFieldsApplied && <span className="ml-2 text-xs text-violet-500">(AI)</span>}
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none ${
                          aiFieldsApplied ? 'border-violet-200 bg-violet-50/30' : 'border-stone-200'
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Price (£)
                          {aiFieldsApplied && <span className="ml-2 text-xs text-violet-500">(AI)</span>}
                        </label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none ${
                              aiFieldsApplied ? 'border-violet-200 bg-violet-50/30' : 'border-stone-200'
                            }`}
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-rose-500 mb-1">
                          Sale Price (£)
                          {aiFieldsApplied && <span className="ml-2 text-xs text-violet-500">(AI)</span>}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Optional"
                            value={formData.salePrice || ''}
                            onChange={e => setFormData({...formData, salePrice: e.target.value ? Number(e.target.value) : undefined})}
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-200 outline-none bg-rose-50/30"
                        />
                        </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Category
                        {aiFieldsApplied && <span className="ml-2 text-xs text-violet-500">(AI)</span>}
                      </label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as any})}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none bg-white ${
                          aiFieldsApplied ? 'border-violet-200' : 'border-stone-200'
                        }`}
                      >
                        <option value="Floral">Floral</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Gift Set">Gift Set</option>
                        <option value="Seasonal">Seasonal</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center pt-6">
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input
                          type="checkbox"
                          checked={formData.inStock}
                          onChange={e => setFormData({...formData, inStock: e.target.checked})}
                          className="w-5 h-5 text-rose-500 rounded focus:ring-rose-400"
                         />
                         <span className="text-sm font-medium text-stone-700">In Stock</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input
                          type="checkbox"
                          checked={formData.isBestSeller}
                          onChange={e => setFormData({...formData, isBestSeller: e.target.checked})}
                          className="w-5 h-5 text-rose-500 rounded focus:ring-rose-400"
                         />
                         <span className="text-sm font-medium text-stone-700">Best Seller</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                         <input
                          type="checkbox"
                          checked={formData.isNew}
                          onChange={e => setFormData({...formData, isNew: e.target.checked})}
                          className="w-5 h-5 text-rose-500 rounded focus:ring-rose-400"
                         />
                         <span className="text-sm font-medium text-stone-700">New</span>
                       </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Short Description
                      {aiFieldsApplied && <span className="ml-2 text-xs text-violet-500">(AI)</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none ${
                        aiFieldsApplied ? 'border-violet-200 bg-violet-50/30' : 'border-stone-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Full Description
                      {aiFieldsApplied && <span className="ml-2 text-xs text-violet-500">(AI)</span>}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.fullDescription}
                      onChange={e => setFormData({...formData, fullDescription: e.target.value})}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none ${
                        aiFieldsApplied ? 'border-violet-200 bg-violet-50/30' : 'border-stone-200'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Size (e.g. 8 oz)
                        {aiFieldsApplied && <span className="ml-2 text-xs text-violet-500">(AI)</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.size}
                        onChange={e => setFormData({...formData, size: e.target.value})}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none ${
                          aiFieldsApplied ? 'border-violet-200 bg-violet-50/30' : 'border-stone-200'
                        }`}
                      />
                     </div>
                     <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Burn Time
                        {aiFieldsApplied && <span className="ml-2 text-xs text-violet-500">(AI)</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.burnTime}
                        onChange={e => setFormData({...formData, burnTime: e.target.value})}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none ${
                          aiFieldsApplied ? 'border-violet-200 bg-violet-50/30' : 'border-stone-200'
                        }`}
                      />
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Image URLs (one per line)
                      <span className="ml-2 text-xs text-amber-600">(Manual entry required)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={imageInput}
                      onChange={e => setImageInput(e.target.value)}
                      placeholder="https://example.com/image1.jpg"
                      className="w-full px-4 py-2 rounded-lg border border-amber-200 bg-amber-50/30 focus:ring-2 focus:ring-rose-200 outline-none font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Scent Notes (comma separated)
                      {aiFieldsApplied && <span className="ml-2 text-xs text-violet-500">(AI)</span>}
                    </label>
                    <input
                      type="text"
                      value={scentInput}
                      onChange={e => setScentInput(e.target.value)}
                      placeholder="Rose, Vanilla, Sandalwood"
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none ${
                        aiFieldsApplied ? 'border-violet-200 bg-violet-50/30' : 'border-stone-200'
                      }`}
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-stone-100">
                    {aiFieldsApplied && (
                      <button
                        type="button"
                        onClick={() => {
                          setAiFieldsApplied(false);
                          setAiSuggestions(null);
                          setFormData({ ...initialProduct, id: Date.now().toString() });
                          setImageInput('');
                          setScentInput('');
                        }}
                        className="px-6 py-3 border border-stone-200 text-stone-600 font-medium rounded-lg hover:bg-stone-50 transition-colors"
                      >
                        Clear & Start Over
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-8 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors shadow-sm"
                    >
                      {editingId ? 'Save Changes' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {/* --- CONTENT TAB --- */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl text-stone-900">Hero Sections</h2>
                <p className="text-stone-500 text-sm mt-1">Manage your homepage hero banners. The active hero is shown on the homepage.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetHeroContent}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-stone-500 hover:text-red-500 border border-stone-200 rounded-lg hover:border-red-200 transition-colors"
                >
                  <RotateCcw size={16} /> Reset All
                </button>
                <button
                  onClick={handleStartCreateHero}
                  className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                >
                  <Plus size={18} /> New Hero Section
                </button>
              </div>
            </div>

            {/* Hero Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroSections.map((hero) => (
                <div
                  key={hero.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-all ${
                    hero.isActive
                      ? 'border-green-400 ring-2 ring-green-100'
                      : 'border-transparent hover:border-stone-200'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 bg-stone-100">
                    {hero.backgroundImageUrl ? (
                      <img
                        src={hero.backgroundImageUrl}
                        alt={hero.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={40} className="text-stone-300" />
                      </div>
                    )}

                    {/* Active Badge */}
                    {hero.isActive && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <Zap size={12} />
                        ACTIVE
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-stone-800 mb-1 truncate">{hero.name || 'Untitled Hero'}</h3>
                    <p className="text-sm text-stone-500 line-clamp-2 mb-3">
                      {hero.titleLine1} <em>{hero.titleAccent}</em>
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                      <button
                        onClick={() => handleEditHero(hero)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      {!hero.isActive && (
                        <>
                          <button
                            onClick={() => handleActivateHero(hero.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Zap size={14} />
                            Activate
                          </button>
                          <button
                            onClick={() => handleDeleteHero(hero.id)}
                            className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit/Create Form Modal */}
            {(editingHeroId || isCreatingHero) && heroForm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
                    <h3 className="font-serif text-xl text-stone-900">
                      {isCreatingHero ? 'Create New Hero Section' : 'Edit Hero Section'}
                    </h3>
                    <button
                      onClick={handleCancelHeroEdit}
                      className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Modal Form */}
                  <form onSubmit={handleHeroSubmit} className="p-6 space-y-6">
                    {/* Hero Name */}
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Hero Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Summer Sale Hero, Default Hero"
                        value={heroForm.name}
                        onChange={e => setHeroForm({...heroForm, name: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-200 outline-none"
                      />
                      <p className="text-xs text-stone-400 mt-1">This name helps you identify different hero sections</p>
                    </div>

                    <div className="space-y-4 border-t border-stone-100 pt-6">
                      <h4 className="font-bold text-stone-700 text-sm uppercase tracking-wide">Main Text</h4>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Top Badge Text</label>
                        <input
                          type="text"
                          placeholder="e.g., Handcrafted in small batches"
                          value={heroForm.badge}
                          onChange={e => setHeroForm({...heroForm, badge: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-200 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">Headline Part 1</label>
                          <input
                            type="text"
                            placeholder="e.g., Light Up Your"
                            value={heroForm.titleLine1}
                            onChange={e => setHeroForm({...heroForm, titleLine1: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">Headline Part 2 (Italic)</label>
                          <input
                            type="text"
                            placeholder="e.g., Moments"
                            value={heroForm.titleAccent}
                            onChange={e => setHeroForm({...heroForm, titleAccent: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-200 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                        <textarea
                          rows={3}
                          placeholder="A short description for the hero section..."
                          value={heroForm.description}
                          onChange={e => setHeroForm({...heroForm, description: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-200 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-stone-100 pt-6">
                      <h4 className="font-bold text-stone-700 text-sm uppercase tracking-wide">Visuals</h4>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Background Image URL</label>
                        <input
                          type="text"
                          placeholder="https://example.com/hero-image.jpg"
                          value={heroForm.backgroundImageUrl}
                          onChange={e => setHeroForm({...heroForm, backgroundImageUrl: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-200 outline-none"
                        />
                        <p className="text-xs text-stone-400 mt-1">Recommended: 1920x1080px high quality image.</p>
                      </div>
                      {heroForm.backgroundImageUrl && (
                        <div className="relative h-32 rounded-lg overflow-hidden bg-stone-100">
                          <img
                            src={heroForm.backgroundImageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 border-t border-stone-100 pt-6">
                      <h4 className="font-bold text-stone-700 text-sm uppercase tracking-wide">Buttons</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">Primary Button Text</label>
                          <input
                            type="text"
                            value={heroForm.primaryCtaText}
                            onChange={e => setHeroForm({...heroForm, primaryCtaText: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">Primary Link</label>
                          <input
                            type="text"
                            value={heroForm.primaryCtaLink}
                            onChange={e => setHeroForm({...heroForm, primaryCtaLink: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-200 outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">Secondary Button Text</label>
                          <input
                            type="text"
                            value={heroForm.secondaryCtaText}
                            onChange={e => setHeroForm({...heroForm, secondaryCtaText: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">Secondary Link</label>
                          <input
                            type="text"
                            value={heroForm.secondaryCtaLink}
                            onChange={e => setHeroForm({...heroForm, secondaryCtaLink: e.target.value})}
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-200 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={handleCancelHeroEdit}
                        className="px-6 py-2.5 text-stone-600 font-medium rounded-lg hover:bg-stone-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-2.5 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors shadow-sm"
                      >
                        {isCreatingHero ? 'Create Hero Section' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
