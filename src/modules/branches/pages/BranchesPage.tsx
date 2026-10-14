import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MapPin, Building2, Edit, Trash2, LayoutDashboard, CheckCircle } from 'lucide-react';
import { branchesApi } from '../api';
import type { Branch, BranchFormData } from '../types';
import BranchFormModal from '../components/BranchFormModal';

const BranchesPage = () => {
  // --- CONTEXT & STATE ---
  const { primaryColor, isDark } = useOutletContext<any>();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // --- DYNAMIC STYLES ---
  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';
  const tableHeaderBg = isDark ? 'bg-gray-900/50' : 'bg-gray-50/80';
  const rowHoverBg = isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50';

  // --- API CALLS ---
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await branchesApi.getBranches();
      
      if (res && Array.isArray(res.data)) {
        setBranches(res.data);
      } else if (Array.isArray(res)) {
        setBranches(res);
      } else {
        setBranches([]);
      }
    } catch (error) {
      toast.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // --- FILTERING & STATS ---
  const filteredBranches = branches.filter(branch => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (branch.bm_name || '').toLowerCase().includes(searchLower) ||
      (branch.rm_name || '').toLowerCase().includes(searchLower)
    );
  });

  const uniqueRestaurants = new Set(branches.map(b => b.rm_name)).size;

  const stats = {
    total: branches.length,
    restaurants: uniqueRestaurants || 1, // Assuming at least 1 restaurant if data exists
    active: branches.length, // Assuming all fetched branches are active in this context
  };

  // --- HANDLERS ---
  const handleOpenModal = (branch?: Branch) => {
    setSelectedBranch(branch || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBranch(null);
  };

  const handleFormSubmit = async (formData: BranchFormData) => {
    try {
      if (formData.bm_id) {
        await branchesApi.updateBranch(formData);
        toast.success('Branch updated successfully');
      } else {
        await branchesApi.createBranch(formData);
        toast.success('Branch created successfully');
      }
      handleCloseModal();
      fetchBranches();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save branch');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this branch? All data linked to it might be affected.")) {
      try {
        await branchesApi.deleteBranch(id);
        toast.success('Branch deleted successfully');
        fetchBranches();
      } catch (error) {
        toast.error('Failed to delete branch');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 lg:pb-6 relative">
      <Toaster position="top-right" toastOptions={{ style: isDark ? { background: '#1f2937', color: '#fff' } : {} }} />
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${textMain}`}>Branch Master</h1>
          <p className={`font-medium mt-1 ${textMuted}`}>Manage your restaurant locations and outlets</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-sm z-10"
          style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}
        >
          <Plus size={18} />
          Add New Branch
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Branches', value: stats.total, icon: <LayoutDashboard size={20} />, color: isDark ? 'text-blue-400' : 'text-blue-600', bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50' },
          { label: 'Linked Restaurants', value: stats.restaurants, icon: <Building2 size={20} />, color: isDark ? 'text-purple-400' : 'text-purple-600', bg: isDark ? 'bg-purple-900/20' : 'bg-purple-50' },
          { label: 'Active Locations', value: stats.active, icon: <CheckCircle size={20} />, color: isDark ? 'text-emerald-400' : 'text-emerald-600', bg: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50' },
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

      {/* SEARCH / FILTERS */}
      <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row gap-3 ${cardBg} ${borderColor}`}>
        <div className="relative flex-1">
          <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input 
            type="text" 
            placeholder="Search branches by name or restaurant..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white'}`}
            style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties}
          />
        </div>
      </div>

      {/* TABLE DATA */}
      <div className={`border rounded-3xl shadow-sm overflow-hidden ${cardBg} ${borderColor}`}>
        <div className="h-1 w-full" style={{ backgroundColor: primaryColor?.value, opacity: 0.8 }}></div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className={`${tableHeaderBg} border-b ${borderColor}`}>
                <th className={`py-4 px-6 text-[11px] font-bold uppercase tracking-widest ${textMuted} w-24`}>ID</th>
                <th className={`py-4 px-6 text-[11px] font-bold uppercase tracking-widest ${textMuted}`}>Branch Name</th>
                <th className={`py-4 px-6 text-[11px] font-bold uppercase tracking-widest ${textMuted}`}>Restaurant</th>
                <th className={`py-4 px-6 text-[11px] font-bold uppercase tracking-widest ${textMuted} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${borderColor}`}>
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="py-6 px-6">
                      <div className={`h-12 w-full rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}></div>
                    </td>
                  </tr>
                ))
              ) : filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <MapPin size={32} className={textMuted} />
                      </div>
                      <h3 className={`text-lg font-bold ${textMain} mb-1`}>No Branches Found</h3>
                      <p className={`text-sm ${textMuted} mb-6`}>
                        {searchQuery ? "Try adjusting your search query." : "Create your first branch location to get started."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredBranches.map((branch, index) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={branch.bm_id} 
                      className={`${rowHoverBg} transition-colors`}
                    >
                      <td className={`py-4 px-6 text-sm font-bold ${textMuted}`}>
                        {index + 1}.
                      </td>
                      
                      <td className={`py-4 px-6 font-bold whitespace-nowrap ${textMain}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: primaryColor?.value }}>
                            <MapPin size={18} />
                          </div>
                          {branch.bm_name}
                        </div>
                      </td>
                      
                      <td className={`py-4 px-6`}>
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${isDark ? 'bg-gray-800 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          <Building2 size={12} className="mr-1.5 opacity-70" />
                          {branch.rm_name || 'Main Enterprise'}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(branch)} 
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`} 
                            title="Edit Branch"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(branch.bm_id)} 
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`} 
                            title="Delete Branch"
                          >
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

      {/* MODAL */}
      <BranchFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleFormSubmit}
        initialData={selectedBranch}
        primaryColor={primaryColor}
        isDark={isDark}
      />
    </div>
  );
};

export default BranchesPage;