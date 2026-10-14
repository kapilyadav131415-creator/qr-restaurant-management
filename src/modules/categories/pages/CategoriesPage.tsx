import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Layers, Star, CheckCircle, Edit, Trash2, LayoutList, Image as ImageIcon } from 'lucide-react';
import { categoriesApi } from '../api';
import { menusApi } from '../../menus/api'; // Make sure this path points to your menus/api.ts
import type { CategoryEntity, CategoryFormData } from '../types';
import CategoryFormModal from '../components/CategoryFormModal';

const CategoriesPage = () => {
  const { primaryColor, isDark } = useOutletContext<any>();
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [menuFilter, setMenuFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryEntity | null>(null);

  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';

  // FIX: Fetch Categories and Menus INDEPENDENTLY so one failure doesn't break both
  const fetchData = async () => {
    setLoading(true);
    
    let catData: CategoryEntity[] = [];
    let menuData: any[] = [];

    try {
      catData = await categoriesApi.getCategories();
    } catch (error) {
      console.error("Categories fetch error:", error);
      toast.error('Failed to load categories');
    }

    try {
      menuData = await menusApi.getMenus();
    } catch (error) {
      console.error("Menus fetch error:", error);
      toast.error('Failed to load menus for dropdown');
    }

    setCategories(catData || []);
    setMenus(Array.isArray(menuData) ? menuData : []);
    setLoading(false);
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const stats = {
    total: categories.length,
    recommended: categories.filter(c => c.cm_is_recommended).length,
    active: categories.length, 
    menusLinked: new Set(categories.map(c => c.menu_id)).size,
  };

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = 
      (cat.cm_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (cat.cm_code || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMenu = menuFilter === 'all' || cat.menu_id.toString() === menuFilter;
    
    return matchesSearch && matchesMenu;
  }).sort((a, b) => a.cm_sort_order - b.cm_sort_order);

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      if (data.category_id) {
        await categoriesApi.updateCategory(data);
        toast.success('Category updated successfully!');
      } else {
        await categoriesApi.createCategory(data);
        toast.success('Category created successfully!');
      }
      setIsModalOpen(false);
      fetchData(); 
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this category? Associated items may be affected.")) {
      try {
        await categoriesApi.deleteCategory(id);
        toast.success('Category deleted');
        fetchData(); 
      } catch (error: any) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 lg:pb-6 relative">
      <Toaster position="top-right" toastOptions={{ style: isDark ? { background: '#1f2937', color: '#fff' } : {} }} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${textMain}`}>Category Master</h1>
          <p className={`font-medium mt-1 ${textMuted}`}>Organize your restaurant products into logical sections</p>
        </div>
        <button 
          onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
          className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-lg text-sm z-10"
          style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Categories', value: stats.total, icon: <LayoutList size={20} />, color: isDark ? 'text-blue-400' : 'text-blue-600', bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50' },
          { label: 'Recommended', value: stats.recommended, icon: <Star size={20} />, color: isDark ? 'text-amber-400' : 'text-amber-600', bg: isDark ? 'bg-amber-900/20' : 'bg-amber-50' },
          { label: 'Active Categories', value: stats.active, icon: <CheckCircle size={20} />, color: isDark ? 'text-emerald-400' : 'text-emerald-600', bg: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50' },
          { label: 'Linked Menus', value: stats.menusLinked, icon: <Layers size={20} />, color: isDark ? 'text-purple-400' : 'text-purple-600', bg: isDark ? 'bg-purple-900/20' : 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-3xl border shadow-sm ${cardBg} flex items-center gap-4 group transition-colors`} style={{ borderColor: isDark ? '#374151' : '#F3F4F6' }}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-widest ${textMuted}`}>{stat.label}</p>
              <p className={`text-2xl font-black ${textMain}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row gap-3 ${cardBg} ${borderColor}`}>
        <div className="relative flex-1">
          <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input 
            type="text" placeholder="Search by category name or code..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white'}`}
            style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties}
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Layers size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <select 
            value={menuFilter} onChange={(e) => setMenuFilter(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 appearance-none ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FCFDFD] border-gray-200 text-gray-900'}`}
            style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties}
          >
            <option value="all">All Menus</option>
            {menus.map(menu => (
              <option key={menu.menu_id || menu.mm_id} value={menu.menu_id || menu.mm_id}>{menu.mm_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={`border rounded-3xl shadow-sm overflow-hidden ${cardBg} ${borderColor}`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${borderColor} ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/80'}`}>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Category</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Menu Linked</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Sort</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Badges</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${borderColor}`}>
              {loading ? (
                [1,2,3,4].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-6 px-6">
                      <div className={`h-12 w-full rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}></div>
                    </td>
                  </tr>
                ))
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-5 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <LayoutList size={40} className={textMuted} />
                      </div>
                      <h3 className={`text-xl font-bold ${textMain} mb-2`}>No Categories Found</h3>
                      <p className={`text-sm ${textMuted} mb-6 max-w-sm`}>
                        {searchQuery || menuFilter !== 'all' ? "We couldn't find any categories matching your filters." : "Start categorizing your menu items."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <motion.tr layout key={cat.cm_id} className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'}`}>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                          {cat.cm_image_url ? (
                            <img src={cat.cm_image_url} alt={cat.cm_name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className={textMuted} />
                          )}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${textMain}`}>{cat.cm_name}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${textMuted} mt-0.5`}>{cat.cm_code}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${isDark ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        <Layers size={12} className="mr-1.5 opacity-70" />
                        {cat.menu_name}
                      </div>
                    </td>

                    <td className={`py-4 px-6 text-center text-sm font-bold ${textMain}`}>
                      <span className={`px-2 py-1 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>{cat.cm_sort_order}</span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>Active</span>
                        {cat.cm_is_recommended && (
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>Recommended</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelectedCategory(cat); setIsModalOpen(true); }} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`} title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(cat.cm_id)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-red-900/30 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-600'}`} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryFormModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit}
        initialData={selectedCategory} menus={menus} primaryColor={primaryColor} isDark={isDark}
      />
    </div>
  );
};

export default CategoriesPage;