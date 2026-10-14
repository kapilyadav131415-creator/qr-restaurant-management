import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, QrCode, Edit, Trash2, LayoutDashboard, CheckCircle, Clock, Ban, Eye, X, Download, ExternalLink, Link as LinkIcon, MapPin } from 'lucide-react';
import { tablesApi } from '../api';
import { branchesApi } from '../../branches/api';
import type { TableEntity, TableFormData } from '../types';
import TableFormModal from '../components/TableFormModal';

const TablesPage = () => {
  // --- CONTEXT & STATE ---
  const { primaryColor, isDark } = useOutletContext<any>();
  const [tables, setTables] = useState<TableEntity[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all'); // Holds branch_name now

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableEntity | null>(null);
  const [viewQrTable, setViewQrTable] = useState<TableEntity | null>(null);

  // --- STYLES ---
  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [tablesRes, branchesRes] = await Promise.all([
        tablesApi.getTables(),
        branchesApi.getBranches()
      ]);
      
      setBranches(
        Array.isArray(branchesRes.data) ? branchesRes.data : 
        Array.isArray(branchesRes) ? branchesRes : []
      );

      if (tablesRes && Array.isArray(tablesRes.data)) {
        setTables(tablesRes.data);
      } else if (Array.isArray(tablesRes)) {
        setTables(tablesRes);
      } else {
        setTables([]);
      }

    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast.error('Failed to load tables list');
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  // --- FILTERING ---
  const filteredTables = tables.filter(t => {
    const matchesSearch = 
      (t.tm_table_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (t.tm_table_code || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || t.tm_status === statusFilter;
    
    // FIX: Match using branch_name instead of branch_id
    const matchesBranch = branchFilter === 'all' || (t.branch_name || '') === branchFilter;
    
    return matchesSearch && matchesStatus && matchesBranch;
  });

  // --- STATS CALCULATION (Based on Filtered Tables) ---
  const stats = {
    total: filteredTables.length,
    available: filteredTables.filter(t => t.tm_status === 'available').length,
    occupied: filteredTables.filter(t => t.tm_status === 'occupied').length,
    reserved: filteredTables.filter(t => t.tm_status === 'reserved').length,
  };

  // --- HANDLERS ---
  const handleFormSubmit = async (data: TableFormData) => {
    try {
      if (data.table_id) {
        await tablesApi.updateTable(data);
        toast.success('Table updated successfully!');
      } else {
        await tablesApi.createTable(data);
        toast.success('Table created successfully!');
      }
      setIsModalOpen(false);
      fetchData(); 
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this table? This cannot be undone.")) {
      try {
        await tablesApi.deleteTable(id);
        toast.success('Table deleted');
        fetchData(); 
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleGenerateQR = (id: number) => {
    toast.success("Generating QR Code... (API connection required)");
  };

  // --- BADGE HELPERS ---
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      available: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700',
      occupied: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700',
      reserved: isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
      cleaning: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700',
      inactive: isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600',
    };
    return <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${styles[status] || styles.inactive}`}>{status || 'inactive'}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 lg:pb-6 relative">
      <Toaster position="top-right" toastOptions={{ style: isDark ? { background: '#1f2937', color: '#fff' } : {} }} />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${textMain}`}>Table Management</h1>
          <p className={`font-medium mt-1 ${textMuted}`}>Manage dining tables and QR setup</p>
        </div>
        <button 
          onClick={() => { setSelectedTable(null); setIsModalOpen(true); }}
          className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-lg text-sm z-10"
          style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}
        >
          <Plus size={18} /> Add Table
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tables', value: stats.total, icon: <LayoutDashboard size={20} />, color: isDark ? 'text-blue-400' : 'text-blue-600', bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50' },
          { label: 'Available', value: stats.available, icon: <CheckCircle size={20} />, color: isDark ? 'text-green-400' : 'text-green-600', bg: isDark ? 'bg-green-900/20' : 'bg-green-50' },
          { label: 'Occupied', value: stats.occupied, icon: <Ban size={20} />, color: isDark ? 'text-red-400' : 'text-red-600', bg: isDark ? 'bg-red-900/20' : 'bg-red-50' },
          { label: 'Reserved', value: stats.reserved, icon: <Clock size={20} />, color: isDark ? 'text-yellow-400' : 'text-yellow-600', bg: isDark ? 'bg-yellow-900/20' : 'bg-yellow-50' },
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
        
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input 
            type="text" placeholder="Search tables or codes..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white'}`}
            style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties}
          />
        </div>

        {/* Branch Filter */}
        <div className="relative w-full sm:w-48">
          <MapPin size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <select 
            value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 appearance-none ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FCFDFD] border-gray-200 text-gray-900'}`}
            style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties}
          >
            <option value="all">All Branches</option>
            {branches.map(branch => (
              // FIX: Value is now branch.bm_name instead of branch.bm_id
              <option key={branch.bm_id} value={branch.bm_name}>
                {branch.bm_name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative w-full sm:w-48">
          <Filter size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <select 
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 appearance-none ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FCFDFD] border-gray-200 text-gray-900'}`}
            style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className={`border rounded-3xl shadow-sm overflow-hidden ${cardBg} ${borderColor}`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${borderColor} ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/80'}`}>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Table</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Location</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Capacity</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Status</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>QR Link</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${borderColor}`}>
              {loading ? (
                [1,2,3,4].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-6 px-6">
                      <div className={`h-12 w-full rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}></div>
                    </td>
                  </tr>
                ))
              ) : filteredTables.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-5 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <QrCode size={40} className={textMuted} />
                      </div>
                      <h3 className={`text-xl font-bold ${textMain} mb-2`}>No Tables Found</h3>
                      <p className={`text-sm ${textMuted} mb-6 max-w-sm`}>
                        {searchQuery || branchFilter !== 'all' || statusFilter !== 'all' 
                          ? "We couldn't find any tables matching your filters." 
                          : "Get started by creating your first dining table to accept orders."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTables.map((table) => (
                  <motion.tr layout key={table.tm_id} className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'}`}>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm`} style={{ backgroundColor: primaryColor?.value }}>
                          {table.tm_table_code}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${textMain}`}>{table.tm_table_name}</p>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>{table.tm_table_type || 'Standard'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className={`text-sm font-bold ${textMain}`}>{table.tm_floor_name || 'Main Floor'}</p>
                      <p className={`text-[10px] font-bold uppercase ${textMuted}`}>{table.branch_name || table.tm_section_name || 'Main Branch'}</p>
                    </td>

                    <td className={`py-4 px-6 text-center text-sm font-bold ${textMain}`}>
                      {table.tm_capacity} Seats
                    </td>

                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(table.tm_status)}
                    </td>

                    {/* Badge Column for QR */}
                    <td className="py-4 px-6 text-center">
                      {table.tm_qr_image_url || (table.tm_qr_code && table.tm_qr_code !== "NO") ? (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle size={16} className="text-emerald-500" />
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleGenerateQR(table.tm_id)}
                          className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm transition-colors hover:bg-opacity-80"
                          style={{ backgroundColor: `${primaryColor?.value}15`, color: primaryColor?.value }}
                        >
                          Generate
                        </button>
                      )}
                    </td>

                    {/* ACTIONS COLUMN */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* URL External Link Icon */}
                        {table.tm_qr_image_url && (
                          <a 
                            href={table.tm_qr_image_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-50'}`} 
                            title="Open URL in New Tab"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}

                        {/* View QR Box Icon */}
                        {(table.tm_qr_code || table.tm_qr_image_url) && (
                          <button 
                            onClick={() => setViewQrTable(table)} 
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-emerald-400 hover:bg-emerald-900/30' : 'text-emerald-600 hover:bg-emerald-50'}`} 
                            title="View QR Label"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        
                        <button onClick={() => { setSelectedTable(table); setIsModalOpen(true); }} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`} title="Edit Table">
                          <Edit size={16} />
                        </button>
                        
                        <button onClick={() => handleDelete(table.tm_id)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-red-900/30 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-600'}`} title="Delete Table">
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

      {/* TABLE EDIT/ADD MODAL */}
      <TableFormModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit}
        initialData={selectedTable} branches={branches} primaryColor={primaryColor} isDark={isDark}
      />

      {/* ULTRA PREMIUM QR VIEWER MODAL */}
      <AnimatePresence>
        {viewQrTable && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className={`relative w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
            >
              {/* Close Button */}
              <button 
                onClick={() => setViewQrTable(null)} 
                className={`absolute top-5 right-5 p-2 rounded-full z-10 transition-colors ${isDark ? 'bg-gray-700/50 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'}`}
              >
                <X size={18} />
              </button>
              
              <div className="p-8 flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl mb-4 shadow-lg`} style={{ backgroundColor: primaryColor?.value }}>
                  {viewQrTable.tm_table_code}
                </div>
                
                <h4 className={`text-2xl font-black tracking-tight ${textMain}`}>{viewQrTable.tm_table_name}</h4>
                <p className={`text-xs font-bold uppercase tracking-widest mt-1 mb-8 ${textMuted}`}>
                  {viewQrTable.branch_name || 'Main Branch'}
                </p>
                
                {/* Clean QR Scan Box Area */}
                <div className={`w-full p-5 rounded-3xl border-2 border-dashed ${isDark ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'} flex flex-col items-center justify-center mb-8 relative`}>
                  
                  {viewQrTable.tm_qr_code || viewQrTable.tm_qr_image_url ? (
                    <img 
                      src={viewQrTable.tm_qr_code && viewQrTable.tm_qr_code !== "NO" ? viewQrTable.tm_qr_code : viewQrTable.tm_qr_image_url || ''} 
                      alt={`QR Code for ${viewQrTable.tm_table_code}`} 
                      className="w-48 h-48 object-contain rounded-xl bg-white p-2 shadow-sm" 
                    />
                  ) : (
                    <div className="w-48 h-48 flex flex-col items-center justify-center bg-white rounded-xl text-gray-300 shadow-sm">
                      <QrCode size={48} className="mb-2" />
                      <span className="text-xs font-bold uppercase">No Image</span>
                    </div>
                  )}
                  
                  <span className={`absolute -bottom-3 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400 border'}`}>
                    Scan to Order
                  </span>
                </div>

                {/* Buttons Row */}
                <div className="w-full flex flex-col gap-3">
                  <a 
                    href={viewQrTable.tm_qr_code || viewQrTable.tm_qr_image_url || '#'} 
                    download={`Table_${viewQrTable.tm_table_code}_QR.png`}
                    className="w-full text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] flex justify-center items-center gap-2" 
                    style={{ backgroundColor: primaryColor?.value }}
                  >
                    <Download size={18} />
                    Download QR Image
                  </a>

                  {viewQrTable.tm_qr_image_url && (
                    <a 
                      href={viewQrTable.tm_qr_image_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 border-2 ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`} 
                    >
                      <LinkIcon size={18} />
                      Visit QR Link
                    </a>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TablesPage;