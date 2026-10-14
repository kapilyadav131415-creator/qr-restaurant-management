// src/pages/MenuPage.tsx - Premium Refactored UI
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Loader2, AlertCircle, ShoppingBag, MapPin, Clock, Utensils, Star, Flame,
  Search, X, ChevronDown, User, Phone, Coffee, Pizza, Salad, Beef, Egg, Fish, 
  Soup, Cake, Wine, History, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { customerApi } from '../Api';
import { useCart } from '../context/CartContext';
import CustomizationDrawer from '../components/CustomizationDrawer';
import CartDrawer from '../components/CartDrawer';
import CustomerInfoModal from '../components/CustomerInfoModal';
import FeedbackForm from '../components/FeedbackForm';
import OrderTracker from '../components/OrderTracker';
import OrderHistory from '../components/OrderHistory';
import type { TableInfo, Menu, Category, MenuItem } from '../types';
import toast from 'react-hot-toast';

const categoryIcons: Record<string, any> = {
  pizza: Pizza, burger: Coffee, salad: Salad, meat: Beef, egg: Egg,
  fish: Fish, soup: Soup, dessert: Cake, drink: Wine, default: Utensils
};

export default function MenuPage() {
  const { qrToken } = useParams<{ qrToken: string }>();
  const { cartItemCount, cartTotal, initCartSession, customerInfo, setCustomerInfo } = useCart();
  
  const [table, setTable] = useState<TableInfo | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<number[]>([]);
  
  const [activeMenu, setActiveMenu] = useState<Menu | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOrderTracker, setShowOrderTracker] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'nonveg'>('all');

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);

  const initialized = useRef(false);
  const dataLoaded = useRef(false);

  // Scroll listener for sticky header styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 120);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load active orders
  useEffect(() => {
    const savedOrders = localStorage.getItem('active_orders');
    if (savedOrders) {
      try {
        setActiveOrders(JSON.parse(savedOrders));
      } catch (e) {
        localStorage.removeItem('active_orders');
      }
    }
  }, []);

  // Save active orders
  useEffect(() => {
    if (activeOrders.length > 0) {
      localStorage.setItem('active_orders', JSON.stringify(activeOrders));
    }
  }, [activeOrders]);

  // Filter items
  useEffect(() => {
    let filtered = items;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }
    setFilteredItems(filtered);
  }, [items, searchQuery, filterType]);

  // Init Data
  useEffect(() => {
    if (!qrToken || initialized.current) return;
    
    const initMenu = async () => {
      try {
        const data = await customerApi.getMenuByQr(qrToken);
        if (!data.table) {
          setError('Invalid QR Code. Please scan again.');
          return;
        }
        setTable(data.table);
        setMenus(data.menus);
        initCartSession(data.table);
        
        if (data.menus.length > 0) setActiveMenu(data.menus[0]);
        if (!customerInfo) setShowCustomerModal(true);
        
        initialized.current = true;
      } catch (err) {
        setError('Invalid QR Code. Please scan again.');
      } finally {
        setLoading(false);
        dataLoaded.current = true;
      }
    };
    initMenu();
  }, [qrToken, initCartSession, customerInfo]);

  // Load Categories
  useEffect(() => {
    if (activeMenu && dataLoaded.current) {
      setCategoriesLoading(true);
      customerApi.getCategories(activeMenu.id)
        .then((cats) => {
          setCategories(cats);
          if (cats.length > 0) setActiveCategory(cats[0].id);
          else { setActiveCategory(null); setItems([]); }
        })
        .finally(() => setCategoriesLoading(false));
    }
  }, [activeMenu]);

  // Load Items
  useEffect(() => {
    if (activeCategory && dataLoaded.current) {
      setItemsLoading(true);
      customerApi.getItems(activeCategory)
        .then(setItems)
        .finally(() => setItemsLoading(false));
    }
  }, [activeCategory]);

  const handleCustomerInfoSave = (name: string, mobile: string) => {
    setCustomerInfo(name, mobile);
    setShowCustomerModal(false);
    toast.success('Welcome! You can now start ordering.');
  };

  const handleCustomerInfoSkip = () => {
    setShowCustomerModal(false);
  };

  const handleOrderPlaced = (orderId: number) => {
    setCurrentOrderId(orderId);
    if (!activeOrders.includes(orderId)) {
      setActiveOrders(prev => [...prev, orderId]);
    }
    setShowOrderTracker(true);
  };

  const handleOrderComplete = () => toast.success('Thank you for dining with us! 🙏');
  const handleViewOrder = (orderId: number) => { setCurrentOrderId(orderId); setShowOrderTracker(true); };
  const handleRemoveOrder = (orderId: number) => {
    setActiveOrders(prev => prev.filter(id => id !== orderId));
    localStorage.setItem('active_orders', JSON.stringify(activeOrders.filter(id => id !== orderId)));
    toast.success('Order removed from history');
  };

  const renderFoodIcon = (type: string) => {
    const isVeg = type === 'veg' || type === 'vegan' || type === 'jain';
    return (
      <div className={`w-3.5 h-3.5 rounded-[3px] border-[1.5px] p-[1.5px] flex items-center justify-center ${isVeg ? 'border-green-600' : 'border-red-500'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-500'}`}></div>
      </div>
    );
  };

  const getCategoryIcon = (categoryName: string) => {
    const key = categoryName.toLowerCase();
    for (const [k, Icon] of Object.entries(categoryIcons)) {
      if (key.includes(k)) return Icon;
    }
    return categoryIcons.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Loading Menu</p>
        </div>
      </div>
    );
  }

  if (error || !table) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50">
        <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-xl font-bold text-gray-800">{error}</h1>
        <p className="text-gray-500 mt-2 text-sm">Please scan a valid QR code</p>
      </div>
    );
  }

  const primaryColor = activeMenu?.themeColor || '#ea580c';

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32 font-sans selection:bg-gray-200">
      
      {/* 1. DYNAMIC HERO SECTION */}
      <div 
        className="relative pt-10 pb-28 px-5 overflow-hidden rounded-b-[40px] shadow-sm"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #111827 100%)` }}
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-white opacity-[0.03] blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        <div className="relative z-10 flex items-start justify-between max-w-md mx-auto">
           <div>
             <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-[9px] font-black uppercase tracking-widest mb-4 border border-white/10 shadow-sm">
                <MapPin size={10} /> {table.branchName}
             </div>
             <h1 className="text-3xl font-black text-white tracking-tight leading-tight mb-2 drop-shadow-md">
               {table.restaurantName}
             </h1>
             <div className="flex items-center gap-2 mt-3">
                <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5 shadow-inner text-white text-xs font-bold">
                  Table {table.tableName}
                </span>
                {customerInfo && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5 shadow-inner text-white text-xs font-medium">
                    <User size={12} className="opacity-70"/> {customerInfo.name.split(' ')[0]}
                  </span>
                )}
             </div>
           </div>
           
           {table.restaurantLogo ? (
             <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center overflow-hidden shrink-0 border-2 border-white/20">
               <img src={table.restaurantLogo} alt="Logo" className="w-full h-full object-cover" />
             </div>
           ) : (
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center shrink-0 border border-white/20">
                <Utensils size={24} className="text-white opacity-70" />
             </div>
           )}
        </div>

        {activeOrders.length > 0 && (
          <div className="absolute top-5 right-5 z-20 flex flex-col gap-3">
            <button
              onClick={() => setShowOrderHistory(true)}
              className="p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all relative border border-white/20 shadow-lg active:scale-95"
            >
              <History size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-md ring-2 ring-gray-900">
                {activeOrders.length}
              </span>
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              className="p-2.5 bg-white/10 backdrop-blur-md rounded-full text-yellow-400 hover:bg-white/20 transition-all border border-white/20 shadow-lg active:scale-95 flex items-center justify-center"
              title="Leave Feedback"
            >
              <Star size={18} className="fill-current" />
            </button>
          </div>
        )}
        {activeOrders.length === 0 && (
          <div className="absolute top-5 right-5 z-20">
            <button
              onClick={() => setShowFeedback(true)}
              className="p-2.5 bg-white/10 backdrop-blur-md rounded-full text-yellow-400 hover:bg-white/20 transition-all border border-white/20 shadow-lg active:scale-95 flex items-center justify-center"
              title="Leave Feedback"
            >
              <Star size={18} className="fill-current" />
            </button>
          </div>
        )}
      </div>

      {/* 2. OVERLAPPING SEARCH & FILTER CARD */}
      <div className="relative z-20 max-w-md mx-auto -mt-14 px-4">
         <div className="bg-white rounded-[28px] shadow-xl shadow-gray-200/50 p-4 border border-gray-100/80 mb-8 backdrop-blur-xl bg-white/95">
            <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3.5 border border-gray-100 transition-all focus-within:bg-white focus-within:ring-2 focus-within:shadow-sm" style={{ '--tw-ring-color': `${primaryColor}40` } as any}>
               <Search size={18} className="text-gray-400" />
               <input
                 type="text"
                 placeholder="Search for your favorites..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="flex-1 bg-transparent border-none focus:outline-none px-3 text-sm font-bold text-gray-800 placeholder:text-gray-400 placeholder:font-medium"
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-700 bg-gray-100 p-1 rounded-full">
                    <X size={14} />
                 </button>
               )}
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100/50">
               {['all', 'veg', 'nonveg'].map((type) => {
                 const isActive = filterType === type;
                 return (
                   <button
                     key={type}
                     onClick={() => setFilterType(type as any)}
                     className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all capitalize flex items-center justify-center gap-1.5 ${
                       isActive 
                         ? 'text-white shadow-md border-transparent' 
                         : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
                     }`}
                     style={isActive ? { backgroundColor: primaryColor, boxShadow: `0 4px 14px ${primaryColor}40` } : {}}
                   >
                     {type === 'veg' ? <span className="w-2 h-2 rounded-full bg-green-500" /> : 
                      type === 'nonveg' ? <span className="w-2 h-2 rounded-full bg-red-500" /> : 
                      null}
                     {type}
                   </button>
                 )
               })}
            </div>
         </div>

         {/* MULTIPLE MENUS (If exist) */}
         {menus.length > 1 && (
           <div className="mb-8">
             <div className="flex items-center gap-2 mb-3 ml-2">
               <ClipboardList size={14} className="text-gray-400" />
               <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available Menus</h3>
             </div>
             <div className="flex overflow-x-auto gap-3 pb-3 hide-scroll-bar px-1 -mx-4 sm:mx-0 px-4 sm:px-1">
                {menus.map(menu => (
                  <button 
                    key={menu.id} 
                    onClick={() => setActiveMenu(menu)} 
                    className={`whitespace-nowrap px-6 py-3.5 rounded-2xl text-sm font-black transition-all flex items-center gap-2.5 border ${
                      activeMenu?.id === menu.id 
                        ? 'text-white border-transparent' 
                        : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-100 shadow-sm'
                    }`}
                    style={activeMenu?.id === menu.id ? { backgroundColor: menu.themeColor || '#ea580c', boxShadow: `0 8px 20px -4px ${menu.themeColor || '#ea580c'}60` } : {}}
                  >
                    <Clock size={16} className={activeMenu?.id === menu.id ? 'text-white/80' : 'text-gray-400'} /> 
                    {menu.name}
                  </button>
                ))}
             </div>
           </div>
         )}
      </div>

      {/* 3. STICKY CATEGORIES NAV */}
      <div className={`sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-2'} px-4`}>
        <div className="max-w-md mx-auto flex overflow-x-auto gap-2.5 hide-scroll-bar -mx-4 px-4 sm:mx-0 sm:px-0">
           {categoriesLoading ? (
             [1,2,3,4].map(i => <div key={i} className="w-24 h-10 bg-gray-200/50 rounded-full animate-pulse shrink-0" />)
           ) : categories.length === 0 ? (
             <div className="text-xs font-bold text-gray-400 py-2">No categories found</div>
           ) : (
             categories.map(cat => {
                const Icon = getCategoryIcon(cat.name);
                const isActive = activeCategory === cat.id;
                return (
                  <button 
                    key={cat.id} 
                    onClick={() => setActiveCategory(cat.id)} 
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 border shrink-0 ${
                      isActive 
                        ? 'text-white border-transparent scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 shadow-sm'
                    }`}
                    style={isActive ? { backgroundColor: primaryColor, boxShadow: `0 6px 16px -2px ${primaryColor}50` } : {}}
                  >
                    <Icon size={14} className={isActive ? 'text-white/90' : 'text-gray-400'} />
                    {cat.name}
                  </button>
                )
             })
           )}
        </div>
      </div>

      {/* 4. PREMIUM ITEM CARDS */}
      <div className="max-w-md mx-auto p-4 space-y-5 mt-4">
        {itemsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin w-8 h-8" style={{ color: primaryColor }} />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Items...</p>
          </div>
        ) : filteredItems.length === 0 && !categoriesLoading ? (
          <div className="text-center py-24 px-6">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-2">No Items Found</h3>
            <p className="text-gray-500 text-sm font-medium mb-6">
              {searchQuery ? 'We couldn\'t find any items matching your search.' : 'There are no items in this category yet.'}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="px-6 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                key={item.id} 
                className="bg-white rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group p-3 flex gap-4"
              >
                <div className="flex-1 py-1 pl-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {renderFoodIcon(item.type)}
                    {item.isBestseller && (
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Flame size={10} /> Bestseller
                      </span>
                    )}
                    {item.isRecommended && (
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Star size={10} /> Must Try
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-black text-gray-900 text-base leading-snug group-hover:text-gray-700 transition-colors mb-1">
                    {item.name}
                  </h3>
                  
                  {item.description && (
                    <p className="text-[11px] text-gray-500 font-medium line-clamp-2 leading-relaxed mb-3 pr-2">
                      {item.description}
                    </p>
                  )}
                  
                  {item.prepTime && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 inline-flex px-2 py-1 rounded-md border border-gray-100">
                      <Clock size={10} /> {item.prepTime} min
                    </div>
                  )}
                </div>
                
                <div className="w-[120px] flex flex-col items-center shrink-0 justify-end">
                  <div className="w-full h-[120px] bg-gray-50 rounded-[20px] overflow-hidden shadow-inner border border-gray-100/50 group-hover:shadow-md transition-all relative">
                    {item.image ? 
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" /> : 
                      <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-100/50">
                        <Utensils size={32} />
                      </div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
                  <button 
                    onClick={() => { setSelectedItem(item); setDrawerOpen(true); }} 
                    className="mt-[-16px] text-white shadow-xl font-black uppercase tracking-widest text-[11px] px-6 py-2.5 rounded-xl active:scale-95 transition-all relative z-10 border border-white/20 overflow-hidden group-hover:shadow-2xl"
                    style={{ backgroundColor: primaryColor, boxShadow: `0 8px 20px -4px ${primaryColor}60` }}
                  >
                    ADD <span className="absolute top-[-2px] right-2 text-[18px] leading-none font-normal opacity-60">+</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 5. FLOATING CART FAB */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div 
            initial={{ y: 150, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none"
          >
            <motion.button 
              onClick={() => setIsCartOpen(true)} 
              className="w-full max-w-md text-white p-4 rounded-[24px] shadow-2xl flex items-center justify-between pointer-events-auto transition-all"
              style={{ background: `linear-gradient(to right, ${primaryColor}, #111827)`, boxShadow: `0 12px 30px -5px ${primaryColor}70` }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 relative">
                  <ShoppingBag size={22} className="text-white relative z-10" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping opacity-20"></div>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest font-black text-white/70 mb-0.5">
                    {cartItemCount} Item{cartItemCount > 1 && 's'} Added
                  </p>
                  <p className="font-black text-xl leading-none">₹{cartTotal}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/10">
                View Cart 
                <ChevronDown size={14} className="-rotate-90" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. MODALS */}
      <CustomizationDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} item={selectedItem} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onOrderPlaced={handleOrderPlaced} />
      <CustomerInfoModal isOpen={showCustomerModal} onClose={handleCustomerInfoSkip} onSave={handleCustomerInfoSave} />
      
      <AnimatePresence>
        {showFeedback && table && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <FeedbackForm 
              restaurantId={table.restaurantId} 
              branchId={table.branchId}
              primaryColor={primaryColor}
              onClose={() => setShowFeedback(false)} 
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrderHistory && (
          <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <OrderHistory orders={activeOrders} onViewOrder={handleViewOrder} onRemoveOrder={handleRemoveOrder} onClose={() => setShowOrderHistory(false)} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrderTracker && currentOrderId && table && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <OrderTracker orderId={currentOrderId} tableName={table.tableName} onClose={() => setShowOrderTracker(false)} onOrderComplete={handleOrderComplete} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}