import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Minus, Plus, Check } from 'lucide-react';
import { customerApi } from '../Api';
import { useCart } from '../context/CartContext';
import type { MenuItem, ItemDetails, ItemVariant, AddonItem, AddonGroup } from '../types';

export default function CustomizationDrawer({ isOpen, onClose, item }: { isOpen: boolean, onClose: () => void, item: MenuItem | null }) {
  const { addItemToCart, isSyncing } = useCart();
  const [details, setDetails] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<{addon: AddonItem, group: AddonGroup}[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setSelectedAddons([]);
      fetchDetails(item.id);
    }
  }, [isOpen, item]);

  const fetchDetails = async (id: number) => {
    setLoading(true);
    try {
      const data = await customerApi.getItemDetails(id);
      setDetails(data);
      const defVar = data.variants.find(v => v.isDefault) || data.variants[0];
      setSelectedVariant(defVar || null);
    } catch (e) { 
      console.error(e); 
    } finally {
      setLoading(false);
    }
  };

  const handleAddonToggle = (addon: AddonItem, group: AddonGroup) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.addon.id === addon.id);
      if (group.selectionType === 'single') {
        const filtered = prev.filter(a => a.group.id !== group.id);
        return [...filtered, {addon, group}];
      }
      if (exists) return prev.filter(a => a.addon.id !== addon.id);
      
      const currentGroupSelections = prev.filter(a => a.group.id === group.id);
      if (currentGroupSelections.length >= group.maxSelect) return prev;
      
      return [...prev, {addon, group}];
    });
  };

  const currentTotal = useMemo(() => {
    if (!selectedVariant) return 0;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.addon.price, 0);
    return (selectedVariant.price + addonsTotal) * quantity;
  }, [selectedVariant, selectedAddons, quantity]);

  const handleAddToCart = async () => {
    if (!item || !selectedVariant) return;
    
    const itemData = {
      item_id: item.id,
      variant_id: selectedVariant.id,
      item_name: item.name,
      variant_name: selectedVariant.name,
      price: selectedVariant.price,
      discount_price: 0,
      final_price: selectedVariant.price,
      qty: quantity,
      image_url: item.image,
      food_type: item.type
    };

    const addonsData = selectedAddons.map(a => ({
      addon_group_id: a.group.id,
      addon_item_id: a.addon.id,
      addon_name: a.addon.name,
      price: a.addon.price,
      qty: quantity
    }));

    await addItemToCart(itemData, addonsData);
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-center items-end bg-black/60 backdrop-blur-sm sm:items-center">
        <motion.div 
          initial={{ y: "100%" }} 
          animate={{ y: 0 }} 
          exit={{ y: "100%" }} 
          transition={{ type: "spring", damping: 25, stiffness: 200 }} 
          className="w-full max-w-md bg-gray-50 rounded-t-3xl sm:rounded-3xl h-[90vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="relative h-48 bg-white shrink-0">
            {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 bg-black/30 text-white backdrop-blur-md rounded-full hover:bg-black/50 transition-colors"
            >
              <X size={18}/>
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-black text-white">{item.name}</h2>
              {item.description && (
                <p className="text-white/80 text-sm mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-orange-500 w-8 h-8"/>
              </div>
            ) : details && (
              <div className="space-y-4">
                {/* Variants */}
                {details.variants.length > 0 && (
                  <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
                    <h3 className="font-black text-gray-900 mb-4 text-sm flex justify-between">
                      Size & Portion 
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest">Required</span>
                    </h3>
                    <div className="space-y-3">
                      {details.variants.map(v => (
                        <label 
                          key={v.id} 
                          className={`flex items-center justify-between cursor-pointer p-3 rounded-xl border transition-all ${
                            selectedVariant?.id === v.id 
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-gray-100 hover:border-orange-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="variant" 
                              checked={selectedVariant?.id === v.id} 
                              onChange={() => setSelectedVariant(v)} 
                              className="w-5 h-5 text-orange-500 accent-orange-500" 
                            />
                            <span className={`font-bold text-sm ${selectedVariant?.id === v.id ? 'text-orange-700' : 'text-gray-800'}`}>
                              {v.name}
                            </span>
                          </div>
                          <span className="font-black text-sm text-gray-900">₹{v.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Addons */}
                {details.addonGroups.map(group => (
                  <div key={group.id} className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
                    <div className="mb-4">
                      <h3 className="font-black text-gray-900 text-sm">{group.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
                        {group.selectionType === 'single' ? 'Choose 1' : `Choose up to ${group.maxSelect}`}
                        {group.isRequired && <span className="text-red-500 ml-1">Required</span>}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {group.items.map(addon => {
                        const isSelected = selectedAddons.some(a => a.addon.id === addon.id);
                        return (
                          <label 
                            key={addon.id} 
                            className={`flex items-center justify-between cursor-pointer p-3 rounded-xl border transition-all ${
                              isSelected 
                                ? 'bg-orange-50 border-orange-200' 
                                : 'bg-white border-gray-100 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                              }`}>
                                {isSelected && <Check size={12} className="text-white"/>}
                              </div>
                              <input 
                                type={group.selectionType === 'single' ? 'radio' : 'checkbox'} 
                                name={`group_${group.id}`} 
                                checked={isSelected} 
                                onChange={() => handleAddonToggle(addon, group)} 
                                className="hidden" 
                              />
                              <span className={`font-bold text-sm ${isSelected ? 'text-orange-900' : 'text-gray-800'}`}>
                                {addon.name}
                              </span>
                            </div>
                            <span className={`font-black text-sm ${isSelected ? 'text-orange-700' : 'text-gray-600'}`}>
                              +₹{addon.price}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t flex items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.05)] shrink-0">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:shadow-md transition-shadow"
              >
                <Minus size={18}/>
              </button>
              <span className="font-black text-lg w-6 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-orange-600 hover:shadow-md transition-shadow"
              >
                <Plus size={18}/>
              </button>
            </div>
            <button 
              onClick={handleAddToCart} 
              disabled={loading || !selectedVariant || isSyncing} 
              className="flex-1 ml-4 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-sm shadow-xl flex justify-center items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSyncing ? <Loader2 className="animate-spin" size={18}/> : `Add to Cart • ₹${currentTotal}`}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}