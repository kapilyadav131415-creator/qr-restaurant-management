import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Layers, CheckCircle,Loader2, Edit, Trash2, Box, Utensils, Image as ImageIcon, Tag, Flame, Star, Zap, Eye, SplitSquareHorizontal, ChevronDown } from 'lucide-react';
import { catalogApi } from '../api';
import { categoriesApi } from '../../categories/api';
import { menusApi } from '../../menus/api';
import type { ItemEntity, ItemFormData, VariantEntity } from '../types';
import ItemFormModal from '../components/ItemFormModal';
import ManageVariantsModal from '../components/ManageVariantsModal';

const ItemsPage = () => {
  const { primaryColor, isDark } = useOutletContext<any>();
  const [items, setItems] = useState<ItemEntity[]>([]);
  const [allVariants, setAllVariants] = useState<VariantEntity[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
    const [branches, setbranchess] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [foodTypeFilter, setFoodTypeFilter] = useState('all');

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemEntity | null>(null);

  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [variantItemTarget, setVariantItemTarget] = useState<ItemEntity | null>(null);

  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itmRes, catRes, menuRes, varRes] = await Promise.all([
        catalogApi.getItems().catch(() => []),
        categoriesApi.getCategories().catch(() => []),
        menusApi.getMenus().catch(() => []),
        catalogApi.getVariants().catch(() => []) 
      ]);
      setItems(itmRes);
      setCategories(catRes);
      setMenus(Array.isArray(menuRes) ? menuRes : []);
      setAllVariants(varRes);
    } catch (error) { toast.error('Error loading catalog asset data'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleRow = (id: number) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  };

  const filteredItems = items.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (item.im_name || '').toLowerCase().includes(q) || (item.im_code || '').toLowerCase().includes(q) || (item.category_name || '').toLowerCase().includes(q);
    const matchesCat = categoryFilter === 'all' || item.category_id.toString() === categoryFilter;
    const matchesType = foodTypeFilter === 'all' || item.im_food_type === foodTypeFilter;
    return matchesSearch && matchesCat && matchesType;
  });

  const handleItemSubmit = async (data: ItemFormData) => {
    try {
      if (data.item_id) {
        await catalogApi.updateItem(data);
        toast.success('Item updated successfully!');
      } else {
        const res = await catalogApi.createItem(data);
        toast.success('Item created! Add variants to set pricing.');
        if (res.item_id) {
            setExpandedRows(prev => [...prev, res.item_id]);
            openVariantsModal({ ...data, im_id: res.item_id } as unknown as ItemEntity);
        }
      }
      setIsItemModalOpen(false);
      fetchData(); 
    } catch (error: any) { toast.error(error?.response?.data?.message || 'Operation failed'); }
  };

  const handleItemDelete = async (id: number) => {
    if (window.confirm("Delete this item? This will also remove its variants.")) {
      try { await catalogApi.deleteItem(id); toast.success('Item deleted'); fetchData(); } 
      catch (error: any) { toast.error('Delete failed'); }
    }
  };

  const openVariantsModal = (item: ItemEntity) => {
    setVariantItemTarget(item);
    setIsVariantModalOpen(true);
  };

  const renderFoodTypeIcon = (type: string) => {
    if (type === 'nonveg') return <div className="w-4 h-4 border border-red-500 flex items-center justify-center p-0.5 shrink-0"><div className="w-full h-full bg-red-500 rounded-full"></div></div>;
    if (type === 'egg') return <div className="w-4 h-4 border border-yellow-500 flex items-center justify-center p-0.5 shrink-0"><div className="w-full h-full bg-yellow-500 rounded-full"></div></div>;
    if (type === 'vegan') return <div className="w-4 h-4 border border-emerald-500 flex items-center justify-center p-0.5 shrink-0"><div className="w-full h-full bg-emerald-500 rounded-sm"></div></div>;
    return <div className="w-4 h-4 border border-green-600 flex items-center justify-center p-0.5 shrink-0"><div className="w-full h-full bg-green-600 rounded-full"></div></div>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 lg:pb-6 relative">
      <Toaster position="top-right" toastOptions={{ style: isDark ? { background: '#1f2937', color: '#fff' } : {} }} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${textMain}`}>Item Catalog</h1>
          <p className={`font-medium mt-1 ${textMuted}`}>Manage base products and variant pricing</p>
        </div>
        <button onClick={() => { setSelectedItem(null); setIsItemModalOpen(true); }} className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-transform text-sm" style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}>
          <Plus size={18} /> Add Base Item
        </button>
      </div>

      <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row gap-3 ${cardBg} ${borderColor}`}>
        <div className="relative flex-1">
          <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input type="text" placeholder="Search by name, code, or category..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white'}`} style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties} />
        </div>
        <div className="relative w-full sm:w-56">
          <Layers size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 appearance-none ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FCFDFD] border-gray-200 text-gray-900'}`} style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties}>
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat.cm_id || cat.id} value={cat.cm_id || cat.id}>{cat.cm_name || cat.category_name}</option>)}
          </select>
        </div>
      </div>

      <div className={`border rounded-3xl shadow-sm overflow-hidden ${cardBg} ${borderColor}`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className={`border-b ${borderColor} ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/80'}`}>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} w-16`}></th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Base Product</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Classification</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Variant Count</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Status</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${borderColor}`}>
              {loading ? (
                <tr><td colSpan={6} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={6} className="py-24 text-center"><div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><Utensils size={32} className={textMuted}/></div><h3 className={`text-xl font-bold ${textMain} mb-2`}>No items found</h3><p className={textMuted}>Create your first item to get started.</p></td></tr>
              ) : (
                filteredItems.map((item) => {
                  const itemVariants = allVariants.filter(v => v.item_id === item.im_id);
                  const isExpanded = expandedRows.includes(item.im_id);

                  return (
                    <React.Fragment key={item.im_id}>
                      <tr className={`transition-colors ${isExpanded ? (isDark ? 'bg-gray-800/80' : 'bg-blue-50/30') : (isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50')}`}>
                        
                        <td className="py-4 px-6 text-center">
                          <button onClick={() => toggleRow(item.im_id)} className={`p-1.5 rounded-full transition-colors ${isExpanded ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}><ChevronDown size={18} className={textMuted} /></motion.div>
                          </button>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border shrink-0 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                              {item.im_image_url ? <img src={item.im_image_url} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={20} className={textMuted} />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                {renderFoodTypeIcon(item.im_food_type)}
                                <p className={`font-bold text-sm ${textMain} line-clamp-1`}>{item.im_name}</p>
                              </div>
                              <p className={`text-[10px] font-bold uppercase tracking-wider ${textMuted} mt-1`}>{item.im_code || 'NO-CODE'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <p className={`text-sm font-bold ${textMain} flex items-center gap-1.5`}><Tag size={14} className={textMuted}/> {item.category_name}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {item.im_is_bestseller && <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1"><Star size={10} className="fill-current" /> Bestseller</span>}
                            {item.im_is_spicy && <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1"><Flame size={10} /> Spicy</span>}
                            {item.im_is_new && <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1"><Zap size={10} /> New</span>}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${itemVariants.length > 0 ? (isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600') : (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600')}`}>
                            <SplitSquareHorizontal size={12} /> {itemVariants.length} Variants
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${item.im_is_available ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600') : (isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500')}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${item.im_is_available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {item.im_is_available ? 'Active' : 'Muted'}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openVariantsModal(item)} className={`px-3 py-2 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider border shadow-sm ${itemVariants.length === 0 ? (isDark ? 'bg-red-600 hover:bg-red-700 text-white border-transparent' : 'bg-red-500 hover:bg-red-600 text-white border-transparent animate-pulse') : (isDark ? 'bg-indigo-900/30 text-indigo-400 border-indigo-800/50 hover:bg-indigo-900/50' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50')}`}>
                              Variants
                            </button>
                            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                            <button onClick={() => { setSelectedItem(item); setIsItemModalOpen(true); }} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`} title="Edit Item"><Edit size={16} /></button>
                            <button onClick={() => handleItemDelete(item.im_id)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-red-900/30 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-600'}`} title="Delete Item"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>

                      {/* EXPANDABLE ROW CONTENT */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="p-0 border-b-0">
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`overflow-hidden ${isDark ? 'bg-gray-900/40' : 'bg-gray-50/50 backdrop-blur-sm shadow-inner'}`}>
                                <div className="p-6 pl-24">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${textMuted}`}><SplitSquareHorizontal size={14}/> Pricing Configuration</h4>
                                    <button onClick={() => openVariantsModal(item)} className={`px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-transform hover:scale-105 ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white border text-gray-900'}`}>
                                      + Manage / Add Variant
                                    </button>
                                  </div>

                                  {itemVariants.length === 0 ? (
                                    <div className={`p-6 rounded-2xl border border-dashed flex flex-col items-center justify-center ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-white'}`}>
                                      <p className={`text-sm font-bold ${textMain}`}>No variants defined</p>
                                      <p className={`text-xs ${textMuted} mt-1`}>Items cannot be sold without at least one variant pricing.</p>
                                    </div>
                                  ) : (
                                    <div className={`border rounded-2xl overflow-hidden shadow-sm ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                                      <table className="w-full text-left">
                                        <thead>
                                          <tr className={`border-b ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                            <th className={`py-3 px-5 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Variant Details</th>
                                            <th className={`py-3 px-5 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-right`}>Selling Price</th>
                                            <th className={`py-3 px-5 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Status</th>
                                          </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                                          {itemVariants.sort((a,b) => a.sort_order - b.sort_order).map(v => (
                                            <tr key={v.variant_id} className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'}`}>
                                              <td className="py-3 px-5">
                                                <div className="flex items-center gap-2">
                                                  <span className={`font-bold text-sm ${textMain}`}>{v.variant_name}</span>
                                                  {v.is_default && <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">Default</span>}
                                                </div>
                                                <span className={`text-[10px] font-mono ${textMuted}`}>{v.variant_code}</span>
                                              </td>
                                              <td className="py-3 px-5 text-right">
                                                <span className={`text-sm font-black ${textMain}`}>₹{v.price}</span>
                                                {v.discount_price > 0 && <span className={`block text-[10px] font-bold line-through ${textMuted}`}>₹{v.discount_price}</span>}
                                              </td>
                                              <td className="py-3 px-5 text-center">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${v.is_available ? 'text-green-500' : 'text-gray-400'}`}>{v.is_available ? 'Active' : 'Off'}</span>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <ItemFormModal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} onSubmit={handleItemSubmit} initialData={selectedItem} menus={menus} categories={categories} branches={branches} primaryColor={primaryColor} isDark={isDark} />
      <ManageVariantsModal isOpen={isVariantModalOpen} onClose={() => setIsVariantModalOpen(false)} item={variantItemTarget} onVariantsUpdated={fetchData} primaryColor={primaryColor} isDark={isDark} />

    </div>
  );
};

export default ItemsPage;