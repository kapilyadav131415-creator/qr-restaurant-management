import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Role, RoleFormData } from '../types';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => Promise<void>;
  initialData?: Role | null;
  // Passing the theme configurations down to the modal
  primaryColor?: { name: string; value: string; hover: string; bg: string };
  isDark?: boolean;
}

const RoleFormModal: React.FC<RoleFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  primaryColor = { name: 'Burgundy', value: '#9b1c1c', hover: '#7f1717', bg: 'bg-[#9b1c1c]' }, // Default fallback
  isDark = false 
}) => {
  const [formData, setFormData] = useState<RoleFormData>({
    role_name: '',
    role_description: '',
    role_is_active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        role_id: initialData.role_id,
        role_name: initialData.role_name,
        role_description: initialData.role_description,
        role_is_active: initialData.role_is_active,
      });
    } else {
      setFormData({ role_name: '', role_description: '', role_is_active: true });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  if (!isOpen) return null;

  // --- DYNAMIC THEME CLASSES ---
  const modalBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const headerBg = isDark ? 'bg-gray-900/50' : 'bg-gray-50/50';
  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-[#4A5568]';
  const inputBg = isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' : 'bg-[#FCFDFD] border-gray-200 text-gray-900';
  const cardSectionBg = isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`${modalBg} rounded-[28px] shadow-2xl w-full max-w-[480px] overflow-hidden border`}
        >
          {/* Header Section */}
          <div className={`${headerBg} px-7 py-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'} flex justify-between items-center relative overflow-hidden`}>
            {/* Very subtle color accent line at the top */}
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primaryColor.value, opacity: 0.8 }}></div>
            
            <h2 className={`text-xl font-black ${textMain} tracking-tight`}>
              {initialData ? 'Edit Role Details' : 'Create New Role'}
            </h2>
            <button 
              onClick={onClose} 
              className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'} transition-colors`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-7 space-y-6">
            
            {/* Role Name */}
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-widest ${textMuted} mb-2 block`}>Role Name</label>
              <input
                type="text"
                placeholder="e.g., Inventory Manager"
                value={formData.role_name}
                onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all text-sm font-medium focus:ring-2 focus:bg-transparent ${inputBg}`}
                style={{ 
                   // Injecting dynamic focus ring color via inline CSS variables if supported, 
                   // but easier to just use standard outline style
                   borderColor: formData.role_name ? primaryColor.value : undefined 
                }}
                onFocus={(e) => { e.target.style.borderColor = primaryColor.value; e.target.style.boxShadow = `0 0 0 2px ${primaryColor.value}33` }}
                onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = '' }}
                required
              />
            </div>

            {/* Role Description */}
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-widest ${textMuted} mb-2 block`}>Description</label>
              <textarea
                placeholder="Describe what this role is responsible for..."
                value={formData.role_description}
                onChange={(e) => setFormData({ ...formData, role_description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all text-sm font-medium resize-none focus:ring-2 focus:bg-transparent ${inputBg}`}
                onFocus={(e) => { e.target.style.borderColor = primaryColor.value; e.target.style.boxShadow = `0 0 0 2px ${primaryColor.value}33` }}
                onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = '' }}
                required
              />
            </div>

            {/* Role Status Toggle */}
           {/* Role Status Toggle */}
<div className={`flex items-center justify-between p-5 rounded-2xl border ${cardSectionBg}`}>
  <div>
    <label className={`text-sm font-bold ${textMain} block mb-0.5`}>
      Active Status
    </label>
    <p
      className={`text-[11px] font-medium ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}
    >
      Allow users to be assigned to this role.
    </p>
  </div>

  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={formData.role_is_active}
      onChange={(e) =>
        setFormData({
          ...formData,
          role_is_active: e.target.checked,
        })
      }
    />

    {/* Toggle Background */}
    <div
      className={`
        relative w-14 h-7 rounded-full transition-all duration-300
        ${formData.role_is_active
          ? ''
          : isDark
          ? 'bg-gray-700'
          : 'bg-gray-300'}
      `}
      style={
        formData.role_is_active
          ? {
              backgroundColor: primaryColor.value,
              boxShadow: `0 0 10px ${primaryColor.value}55`,
            }
          : {}
      }
    >
      {/* Toggle Circle */}
      <div
        className={`
          absolute top-1 left-1 w-5 h-5 rounded-full
          bg-white shadow-md transition-all duration-300
          ${formData.role_is_active ? 'translate-x-7' : ''}
        `}
      />
    </div>
  </label>
</div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-3.5 rounded-xl font-bold transition-colors text-sm ${
                  isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
                style={{ backgroundColor: primaryColor.value, boxShadow: `0 4px 14px 0 ${primaryColor.value}40` }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  initialData ? 'Update Role' : 'Create Role'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RoleFormModal;