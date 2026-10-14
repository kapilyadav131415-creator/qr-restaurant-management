import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Clock, Star, Layers, Edit, Trash2, Palette, Activity } from 'lucide-react';
import { menusApi } from '../api';
import type { Menu, MenuFormData } from '../types';
import MenuFormModal from '../components/MenuFormModal';

const MenuMaster = () => {
  const { primaryColor, isDark } = useOutletContext<any>();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [defaultFilter, setDefaultFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  // --- STYLES ---
  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await menusApi.getMenus();
      setMenus(data);
    } catch (error) {
      toast.error('Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // --- STATISTICS ---
  const stats = {
    total: menus.length,
    default: menus.filter(m => m.mm_is_default).length,
    activeNow: menus.filter(m => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      return currentTime >= m.mm_start_time && currentTime <= m.mm_end_time;
    }).length,
    withColor: menus.filter(m => m.mm_theme_color && m.mm_theme_color !== '#000000').length,
  };

  // --- FILTERING ---
  const filteredMenus = menus.filter(menu => {
    const matchesSearch =
      (menu.mm_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (menu.mm_code || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDefault =
      defaultFilter === 'all' ||
      (defaultFilter === 'default' && menu.mm_is_default) ||
      (defaultFilter === 'non-default' && !menu.mm_is_default);

    return matchesSearch && matchesDefault;
  });

  // --- HANDLERS ---
  const handleOpenModal = (menu?: Menu) => {
    if (menu && !menu.menu_id) {
      return toast.error('Cannot edit this menu: missing ID');
    }
    setSelectedMenu(menu || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
  };

  const handleFormSubmit = async (formData: MenuFormData) => {
    try {
      if (formData.menu_id) {
        await menusApi.updateMenu(formData);
        toast.success('Menu updated successfully');
      } else {
        await menusApi.createMenu(formData);
        toast.success('Menu created successfully');
      }
      handleCloseModal();
      fetchMenus();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      try {
        await menusApi.deleteMenu(id);
        toast.success('Menu deleted');
        fetchMenus();
      } catch (error) {
        toast.error('Failed to delete menu');
      }
    }
  };

  const formatDays = (days: string[]) => {
    if (!days || !days.length) return 'None';
    if (days.length === 7) return 'Everyday';
    return days.map(d => d.slice(0,3).toUpperCase()).join(', ');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 lg:pb-6 relative">
      <Toaster position="top-right" toastOptions={{ style: isDark ? { background: '#1f2937', color: '#fff' } : {} }} />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${textMain}`}>Menu Master</h1>
          <p className={`font-medium mt-1 ${textMuted}`}>Manage outlet menus, timings, and availability</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-lg text-sm z-10"
          style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}
        >
          <Plus size={18} /> Add New Menu
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Menus', value: stats.total, icon: <Layers size={20} />, color: isDark ? 'text-blue-400' : 'text-blue-600', bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50' },
          { label: 'Default Menus', value: stats.default, icon: <Star size={20} />, color: isDark ? 'text-amber-400' : 'text-amber-600', bg: isDark ? 'bg-amber-900/20' : 'bg-amber-50' },
          { label: 'Active Now', value: stats.activeNow, icon: <Activity size={20} />, color: isDark ? 'text-emerald-400' : 'text-emerald-600', bg: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50' },
          { label: 'Themed Menus', value: stats.withColor, icon: <Palette size={20} />, color: isDark ? 'text-purple-400' : 'text-purple-600', bg: isDark ? 'bg-purple-900/20' : 'bg-purple-50' },
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

      {/* FILTERS */}
      <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row gap-3 ${cardBg} ${borderColor}`}>
        <div className="relative flex-1">
          <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input
            type="text" placeholder="Search by name or code..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white'}`}
            style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties}
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <select
            value={defaultFilter} onChange={(e) => setDefaultFilter(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 appearance-none ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FCFDFD] border-gray-200 text-gray-900'}`}
            style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties}
          >
            <option value="all">All Menus</option>
            <option value="default">Default Only</option>
            <option value="non-default">Non-Default Only</option>
          </select>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className={`border rounded-3xl shadow-sm overflow-hidden ${cardBg} ${borderColor}`}>
        <div className="h-1 w-full" style={{ backgroundColor: primaryColor?.value, opacity: 0.8 }}></div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${borderColor} ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/80'}`}>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Menu Details</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Timing</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Available Days</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Sort</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Default</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-right`}>Actions</th>
               </tr>
            </thead>
            <tbody className={`divide-y ${borderColor}`}>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-6 px-6">
                      <div className={`h-12 w-full rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}></div>
                     </td>
                   </tr>
                ))
              ) : filteredMenus.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <Calendar size={40} className={textMuted} />
                      </div>
                      <h3 className={`text-xl font-bold ${textMain} mb-2`}>No Menus Found</h3>
                      <p className={`text-sm ${textMuted} mb-6`}>
                        {searchQuery || defaultFilter !== 'all' ? 'Try adjusting your filters.' : 'Create your first menu to get started.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredMenus.map((menu) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={menu.menu_id}
                      className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'}`}
                    >
                      <td className={`py-4 px-6 font-bold whitespace-nowrap ${textMain}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: menu.mm_theme_color || primaryColor?.value }}>
                            {menu.mm_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{menu.mm_name}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>{menu.mm_code}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6 text-sm text-muted">
                        <div className={`flex items-center gap-2 font-medium ${textMain}`}>
                          <Clock size={14} className={textMuted} /> 
                          {menu.mm_start_time} - {menu.mm_end_time}
                        </div>
                      </td>
                      
                      <td className={`py-4 px-6 text-center text-[11px] font-bold uppercase tracking-widest ${textMuted}`}>
                        {formatDays(menu.mm_available_days)}
                      </td>
                      
                      <td className={`py-4 px-6 text-center text-sm font-bold ${textMain}`}>
                        {menu.mm_sort_order}
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        {menu.mm_is_default ? (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                            <Star size={12} className="fill-current" /> Default
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            Standard
                          </span>
                        )}
                      </td>
                      
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(menu)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`} title="Edit Menu">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(menu.menu_id)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`} title="Delete Menu">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MenuFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} initialData={selectedMenu} primaryColor={primaryColor} isDark={isDark} />
    </div>
  );
};

export default MenuMaster;