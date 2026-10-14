import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Key, Loader2, Save, Users, ArrowRight, Check, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { useRolesList, useRolePermissions, useSavePermissions } from '../hooks/usePermissions';
import type { PermissionItem } from '../types';

export default function PermissionsPage() {
  const { primaryColor, isDark } = useOutletContext<any>();
  
  // Queries & Mutations
  const { data: roles = [], isLoading: loadingRoles } = useRolesList();
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  
  const { data: serverPermissions, isLoading: loadingPermissions, isFetching } = useRolePermissions(selectedRoleId);
  const saveMutation = useSavePermissions();

  // Local state to track matrix edits before saving
  const [localPermissions, setLocalPermissions] = useState<PermissionItem[]>([]);

  // Sync local state when a new role is selected and fetched
  useEffect(() => {
    if (serverPermissions) {
      setLocalPermissions(serverPermissions);
    }
  }, [serverPermissions]);

  // Auto-select the first role on load
  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  // Smart Toggle Logic
  const handleToggle = (moduleId: number, field: keyof PermissionItem) => {
    setLocalPermissions(prev => prev.map(p => {
      if (p.module_id === moduleId) {
        const nextValue = !p[field];
        const nextPerm = { ...p, [field]: nextValue };

        // UX Rule 1: If enabling Add/Edit/Delete/Print, you MUST be able to View it.
        if (nextValue && field !== 'can_view') {
          nextPerm.can_view = true;
        }

        // UX Rule 2: If disabling View, you lose all other access.
        if (!nextValue && field === 'can_view') {
          nextPerm.can_add = false;
          nextPerm.can_edit = false;
          nextPerm.can_delete = false;
          nextPerm.can_print = false;
        }

        return nextPerm;
      }
      return p;
    }));
  };

  // Toggle Entire Row
  const handleToggleRow = (moduleId: number, grantAll: boolean) => {
    setLocalPermissions(prev => prev.map(p => 
      p.module_id === moduleId 
        ? { ...p, can_view: grantAll, can_add: grantAll, can_edit: grantAll, can_delete: grantAll, can_print: grantAll } 
        : p
    ));
  };

  const handleSave = () => {
    if (!selectedRoleId) return;
    saveMutation.mutate({
      role_id: selectedRoleId,
      permissions: localPermissions
    });
  };

  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  // Helper for rendering custom switch/checkboxes
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-green-500' : isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="max-w-[1400px] mx-auto pb-10 relative h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6">
      <Toaster position="top-right" toastOptions={{ style: isDark ? { background: '#1f2937', color: '#fff' } : {} }} />

      {/* LEFT SIDEBAR: Role Selection */}
      <div className={`w-full lg:w-[320px] flex flex-col rounded-[32px] border shadow-sm overflow-hidden shrink-0 ${cardBg} ${borderColor}`}>
        <div className="p-6 border-b border-inherit">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-900 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <Shield size={20} />
            </div>
            <div>
              <h2 className={`text-xl font-black ${textMain}`}>Roles</h2>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${textMuted}`}>Select to manage</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loadingRoles ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400" /></div>
          ) : (
            roles.map((role) => {
              const isActive = selectedRoleId === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${isActive ? 'ring-2 shadow-md' : (isDark ? 'border-transparent hover:bg-gray-700/50' : 'border-transparent hover:bg-gray-50')}`}
                  style={isActive ? { borderColor: 'transparent', '--tw-ring-color': primaryColor?.value, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#fff' } as any : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${isDark ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      <Users size={16} />
                    </div>
                    <span className={`font-bold text-sm ${isActive ? textMain : textMuted}`}>{role.name}</span>
                  </div>
                  <ArrowRight size={16} className={`transition-transform ${isActive ? 'translate-x-1' : 'opacity-0'}`} style={{ color: primaryColor?.value }} />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Permissions Matrix */}
      <div className={`flex-1 flex flex-col rounded-[32px] border shadow-sm overflow-hidden ${cardBg} ${borderColor}`}>
        {!selectedRoleId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}><Key size={40} className={textMuted}/></div>
            <h2 className={`text-2xl font-black ${textMain}`}>Access Control Matrix</h2>
            <p className={`text-sm mt-2 max-w-md ${textMuted}`}>Select a role from the sidebar to view and configure its system permissions and module access levels.</p>
          </div>
        ) : (
          <>
            <div className={`p-6 md:p-8 border-b flex justify-between items-center ${isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-100 bg-gray-50/50'}`}>
              <div>
                <h2 className={`text-2xl font-black ${textMain}`}>
                  {roles.find(r => r.id === selectedRoleId)?.name} <span className="opacity-50">Permissions</span>
                </h2>
                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${textMuted}`}>Toggle module access rights below</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending || isFetching}
                className="px-6 py-3 text-white rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform disabled:opacity-70 disabled:hover:scale-100"
                style={{ backgroundColor: primaryColor?.value, boxShadow: `0 8px 20px -4px ${primaryColor?.value}60` }}
              >
                {saveMutation.isPending ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} 
                Save Changes
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              {loadingPermissions || isFetching ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10 backdrop-blur-sm">
                  <Loader2 className="animate-spin w-10 h-10 text-blue-500" style={{ color: primaryColor?.value }} />
                </div>
              ) : localPermissions.length === 0 ? (
                <div className="p-10 text-center text-gray-500 font-medium">No modules found to configure.</div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className={`sticky top-0 z-20 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b shadow-sm`}>
                    <tr>
                      <th className={`py-4 px-6 text-xs font-black uppercase tracking-widest ${textMuted}`}>System Module</th>
                      <th className={`py-4 px-4 text-xs font-black uppercase tracking-widest text-center ${textMuted}`}>View</th>
                      <th className={`py-4 px-4 text-xs font-black uppercase tracking-widest text-center ${textMuted}`}>Add</th>
                      <th className={`py-4 px-4 text-xs font-black uppercase tracking-widest text-center ${textMuted}`}>Edit</th>
                      <th className={`py-4 px-4 text-xs font-black uppercase tracking-widest text-center ${textMuted}`}>Delete</th>
                      <th className={`py-4 px-4 text-xs font-black uppercase tracking-widest text-center ${textMuted}`}>Print</th>
                      <th className={`py-4 px-6 text-xs font-black uppercase tracking-widest text-right ${textMuted}`}>Row Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {localPermissions.map((perm) => {
                      const allGranted = perm.can_view && perm.can_add && perm.can_edit && perm.can_delete && perm.can_print;
                      return (
                        <motion.tr 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          key={perm.module_id} 
                          className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`}
                        >
                          <td className="py-4 px-6">
                            <span className={`font-bold text-sm ${textMain}`}>{perm.module_name}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <ToggleSwitch checked={perm.can_view} onChange={() => handleToggle(perm.module_id, 'can_view')} />
                          </td>
                          <td className="py-4 px-4 text-center">
                            <ToggleSwitch checked={perm.can_add} onChange={() => handleToggle(perm.module_id, 'can_add')} />
                          </td>
                          <td className="py-4 px-4 text-center">
                            <ToggleSwitch checked={perm.can_edit} onChange={() => handleToggle(perm.module_id, 'can_edit')} />
                          </td>
                          <td className="py-4 px-4 text-center">
                            <ToggleSwitch checked={perm.can_delete} onChange={() => handleToggle(perm.module_id, 'can_delete')} />
                          </td>
                          <td className="py-4 px-4 text-center">
                            <ToggleSwitch checked={perm.can_print} onChange={() => handleToggle(perm.module_id, 'can_print')} />
                          </td>
                          <td className="py-4 px-6 text-right">
                            {allGranted ? (
                              <button onClick={() => handleToggleRow(perm.module_id, false)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                                Revoke All
                              </button>
                            ) : (
                              <button onClick={() => handleToggleRow(perm.module_id, true)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                                Grant All
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
}