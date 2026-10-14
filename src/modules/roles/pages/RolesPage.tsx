import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Shield, CheckCircle, Lock, Users, Edit, Trash2 } from 'lucide-react';
import { rolesApi } from '../api';
import type { Role, RoleFormData } from '../types';
import RoleFormModal from '../components/RoleFormModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';

const RolesPage = () => {
  // --- CONTEXT & STATE ---
  const { primaryColor, isDark } = useOutletContext<any>();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Universal Form Modal State (Insert & Update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Universal Confirm Modal State (Delete)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

  // --- DYNAMIC STYLES ---
  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';
  const tableHeaderBg = isDark ? 'bg-gray-900/50' : 'bg-gray-50/80';
  const rowHoverBg = isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50';

  // --- API CALLS ---
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await rolesApi.getRoles();
      if (Array.isArray(data)) {
        setRoles(data);
      } else if (data && Array.isArray(data.data)) {
        setRoles(data.data);
      } else {
        setRoles([]); 
        toast.error("API returned invalid data format");
      }
    } catch (error) {
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // --- STATS CALCULATION ---
  const stats = {
    total: roles.length,
    active: roles.filter(r => r.role_is_active).length,
    system: roles.filter(r => r.role_is_system).length,
    custom: roles.filter(r => !r.role_is_system).length,
  };

  // --- FILTERING LOGIC ---
  const filteredRoles = roles.filter(role => {
    const matchesSearch = 
      (role.role_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (role.role_description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && role.role_is_active) || 
      (statusFilter === 'inactive' && !role.role_is_active);
      
    const matchesType = 
      typeFilter === 'all' || 
      (typeFilter === 'system' && role.role_is_system) || 
      (typeFilter === 'custom' && !role.role_is_system);

    return matchesSearch && matchesStatus && matchesType;
  });

  // --- HANDLERS: INSERT & UPDATE ---
  const handleOpenModal = (role?: Role) => {
    setSelectedRole(role || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const handleFormSubmit = async (formData: RoleFormData) => {
    try {
      if (formData.role_id) {
        await rolesApi.updateRole(formData);
        toast.success('Role updated successfully');
      } else {
        await rolesApi.createRole(formData);
        toast.success('Role created successfully');
      }
      handleCloseModal(); // Close the modal on success
      fetchRoles();       // Refresh the table
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Action failed');
    }
  };

  // --- HANDLERS: DELETE ---
  const handleDeleteClick = (id: number, isSystem: boolean) => {
    if (isSystem) {
      return toast.error("System roles cannot be deleted.");
    }
    setRoleToDelete(id);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!roleToDelete) return;
    try {
      await rolesApi.deleteRole(roleToDelete);
      toast.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      toast.error('Failed to delete role');
    } finally {
      setRoleToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 lg:pb-6 relative">
      <Toaster position="top-right" toastOptions={{ style: isDark ? { background: '#1f2937', color: '#fff' } : {} }} />
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${textMain}`}>Role Master</h1>
          <p className={`font-medium mt-1 ${textMuted}`}>Manage system access and staff permissions</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} // Triggers Insert
          className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-lg text-sm z-10"
          style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}
        >
          <Plus size={18} /> Add New Role
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Roles', value: stats.total, icon: <Shield size={20} />, color: isDark ? 'text-blue-400' : 'text-blue-600', bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50' },
          { label: 'Active Roles', value: stats.active, icon: <CheckCircle size={20} />, color: isDark ? 'text-emerald-400' : 'text-emerald-600', bg: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50' },
          { label: 'System Defined', value: stats.system, icon: <Lock size={20} />, color: isDark ? 'text-purple-400' : 'text-purple-600', bg: isDark ? 'bg-purple-900/20' : 'bg-purple-50' },
          { label: 'Custom Roles', value: stats.custom, icon: <Users size={20} />, color: isDark ? 'text-orange-400' : 'text-orange-600', bg: isDark ? 'bg-orange-900/20' : 'bg-orange-50' },
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
            type="text" placeholder="Search roles by name or description..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white'}`}
            style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties}
          />
        </div>

        {/* Type Filter */}
        <div className="relative w-full sm:w-48">
          <Shield size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <select 
            value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 appearance-none ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FCFDFD] border-gray-200 text-gray-900'}`}
            style={{ '--tw-ring-color': primaryColor?.value } as React.CSSProperties}
          >
            <option value="all">All Types</option>
            <option value="system">System Only</option>
            <option value="custom">Custom Only</option>
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
            <option value="active">Active Roles</option>
            <option value="inactive">Inactive Roles</option>
          </select>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className={`border rounded-3xl shadow-sm overflow-hidden ${cardBg} ${borderColor}`}>
        <div className="h-1 w-full" style={{ backgroundColor: primaryColor?.value, opacity: 0.8 }}></div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className={`${tableHeaderBg} border-b ${borderColor}`}>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Role Name</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Description</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Type</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Status</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${borderColor}`}>
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-6 px-6">
                      <div className={`h-12 w-full rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}></div>
                    </td>
                  </tr>
                ))
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <Shield size={32} className={textMuted} />
                      </div>
                      <h3 className={`text-lg font-bold ${textMain} mb-1`}>No Roles Found</h3>
                      <p className={`text-sm ${textMuted} mb-6`}>
                        {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
                          ? "Try adjusting your filters to find what you're looking for." 
                          : "Create your first custom role to get started."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <motion.tr layout key={role.role_id} className={`${rowHoverBg} transition-colors`}>
                    
                    <td className={`py-4 px-6 font-bold whitespace-nowrap ${textMain}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm`} style={{ backgroundColor: primaryColor?.value }}>
                          {role.role_name.charAt(0).toUpperCase()}
                        </div>
                        {role.role_name}
                      </div>
                    </td>
                    
                    <td className={`py-4 px-6 text-sm max-w-xs truncate ${textMuted}`}>
                      {role.role_description}
                    </td>
                    
                    <td className="py-4 px-6 text-center">
                      {role.role_is_system ? (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          isDark ? 'bg-purple-900/30 text-purple-400 border-purple-800/50' : 'bg-purple-50 text-purple-700 border-purple-100'
                        }`}>
                          <Lock size={10} className="mr-1.5" /> System
                        </span>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          isDark ? 'bg-gray-700/50 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                          Custom
                        </span>
                      )}
                    </td>
                     
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        role.role_is_active 
                          ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700') 
                          : (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700')
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${role.role_is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {role.role_is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(role)} // Triggers Update
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                          title="Edit Role"
                        >
                          <Edit size={16} />
                        </button>
                        
                        {!role.role_is_system && (
                          <button 
                            onClick={() => handleDeleteClick(role.role_id, role.role_is_system)} // Triggers Delete
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                            title="Delete Role"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                    
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UNIVERSAL INSERT / UPDATE MODAL */}
      <RoleFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleFormSubmit}
        initialData={selectedRole}
        primaryColor={primaryColor}
        isDark={isDark}
      />

      {/* UNIVERSAL DELETE CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        title="Delete Role"
        message="Are you sure you want to delete this role? Users assigned to this role may lose access. This action cannot be undone."
        confirmText="Delete Role"
        cancelText="Cancel"
        isDanger={true}
        isDark={isDark}
        primaryColor={primaryColor}
      />
  
    </div>
  );
};

export default RolesPage;