import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, UserPlus, Edit2, Lock, Unlock, Key, Trash2, Eye, Loader2 ,CheckCircle } from 'lucide-react';
import { useStaffList, useStaffMutations } from '../hooks/useStaffQueries';
import { useRoles } from '../hooks/useRoles'; // <-- DYNAMIC HOOK
import type { StaffEntity } from '../types';
import { StaffFormDrawer, StaffDetailsDrawer, ResetPasswordModal } from '../components/StaffModals';

export default function StaffListPage() {
  const { primaryColor, isDark } = useOutletContext<any>();
  
  // Queries & Mutations
  const { data: staffList = [], isLoading } = useStaffList();
  const { data: roles = [], isLoading: loadingRoles } = useRoles(); // <-- FETCH ROLES
  const { create, update, remove, lock, unlock, resetPassword } = useStaffMutations();

  // Local State
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals/Drawers State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffEntity | null>(null);

  // Filters
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.um_full_name.toLowerCase().includes(search.toLowerCase()) || staff.um_email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || staff.um_role_id.toString() === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && !staff.um_is_locked) || 
      (statusFilter === 'locked' && staff.um_is_locked);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handlers
  const handleOpenForm = (staff?: StaffEntity) => { setSelectedStaff(staff || null); setIsFormOpen(true); };
  const handleOpenDetails = (staff: StaffEntity) => { setSelectedStaff(staff); setIsDetailsOpen(true); };
  const handleOpenReset = (staff: StaffEntity) => { setSelectedStaff(staff); setIsResetOpen(true); };

  const handleFormSubmit = async (data: any) => {
    if (selectedStaff) await update.mutateAsync(data);
    else await create.mutateAsync(data);
    setIsFormOpen(false);
  };

  const handleResetSubmit = async (data: any) => {
    await resetPassword.mutateAsync(data);
    setIsResetOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to completely remove this staff member?")) remove.mutate(id);
  };

  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';

  return (
    <div className="max-w-[1400px] mx-auto pb-10 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${textMain}`}>Staff Directory</h1>
          <p className={`font-medium mt-1 ${textMuted}`}>Manage access, roles, and credentials for your team.</p>
        </div>
        <button onClick={() => handleOpenForm()} className="px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 flex items-center gap-2" style={{ backgroundColor: primaryColor?.value }}>
          <UserPlus size={18} /> Add Staff
        </button>
      </div>

      {/* TOOLBAR */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 mb-6 shadow-sm ${cardBg} ${borderColor}`}>
        <div className="relative flex-1">
          <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} style={{ '--tw-ring-color': primaryColor?.value } as any} />
        </div>
        
        {/* DYNAMIC ROLE FILTER */}
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} disabled={loadingRoles} className={`w-full md:w-48 px-4 py-3 rounded-xl border outline-none text-sm ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
          <option value="all">{loadingRoles ? 'Loading...' : 'All Roles'}</option>
          {roles.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`w-full md:w-48 px-4 py-3 rounded-xl border outline-none text-sm ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="locked">Locked Only</option>
        </select>
      </div>

      {/* TABLE */}
      <div className={`border rounded-[24px] shadow-sm overflow-hidden ${cardBg} ${borderColor}`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className={`border-b ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50/80 border-gray-200'}`}>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Staff Member</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Contact Info</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Role</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Status</th>
                <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {isLoading ? (
                <tr><td colSpan={5} className="py-16 text-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto"/></td></tr>
              ) : filteredStaff.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-gray-500 font-medium">No staff members found matching criteria.</td></tr>
              ) : (
                filteredStaff.map((staff) => {
                  // DYNAMIC ROLE MAPPING
                  const roleName = roles.find((r: any) => r.id === staff.um_role_id)?.name || 'Unknown Role';
                  
                  return (
                    <tr key={staff.um_id} className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-inner`} style={{ backgroundColor: primaryColor?.value }}>
                            {staff.um_full_name.charAt(0)}
                          </div>
                          <div>
                            <p className={`font-bold text-sm ${textMain}`}>{staff.um_full_name}</p>
                            <p className={`text-[10px] font-medium uppercase tracking-wider ${textMuted}`}>@{staff.um_username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className={`text-sm font-medium ${textMain}`}>{staff.um_email}</p>
                        <p className={`text-xs ${textMuted}`}>{staff.um_phone}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {staff.role_name}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {staff.um_is_locked ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <Lock size={12}/> Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle size={12}/> Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleOpenDetails(staff)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`} title="View Details"><Eye size={16}/></button>
                          <button onClick={() => handleOpenForm(staff)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`} title="Edit"><Edit2 size={16}/></button>
                          <button onClick={() => handleOpenReset(staff)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`} title="Reset Password"><Key size={16}/></button>
                          <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                          {staff.um_is_locked ? (
                            <button onClick={() => unlock.mutate(staff.um_id)} className="p-2 rounded-lg transition-colors text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30" title="Unlock Account"><Unlock size={16}/></button>
                          ) : (
                            <button onClick={() => lock.mutate(staff.um_id)} className="p-2 rounded-lg transition-colors text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30" title="Lock Account"><Lock size={16}/></button>
                          )}
                          <button onClick={() => handleDelete(staff.um_id)} className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30" title="Delete"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOUNT ALL DRAWERS AND MODALS */}
      <StaffFormDrawer isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} initialData={selectedStaff} onSubmit={handleFormSubmit} isDark={isDark} primaryColor={primaryColor} />
      <StaffDetailsDrawer isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} staff={selectedStaff} isDark={isDark} primaryColor={primaryColor} />
      <ResetPasswordModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} staffId={selectedStaff?.um_id} onSubmit={handleResetSubmit} isDark={isDark} primaryColor={primaryColor} />

    </div>
  );
}