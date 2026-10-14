import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Branch, BranchFormData } from '../types';

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BranchFormData) => Promise<void>;
  initialData?: Branch | null;
  primaryColor?: any;
  isDark?: boolean;
}

const BranchFormModal: React.FC<BranchFormModalProps> = ({ 
  isOpen, onClose, onSubmit, initialData, primaryColor, isDark 
}) => {
  const [formData, setFormData] = useState<BranchFormData>({
    bm_name: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        bm_id: initialData.bm_id,
        bm_name: initialData.bm_name,
      });
    } else {
      setFormData({ bm_name: '' });
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
  const inputBg = isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FCFDFD] border-gray-200 text-gray-900';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`${modalBg} rounded-[28px] shadow-2xl w-full max-w-sm overflow-hidden border`}
        >
          {/* Header */}
          <div className={`${headerBg} px-7 py-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'} flex justify-between items-center relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: primaryColor?.value }}></div>
            <h2 className={`text-xl font-black ${textMain} tracking-tight`}>
              {initialData ? 'Edit Branch' : 'Add New Branch'}
            </h2>
            <button onClick={onClose} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'} transition-colors`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-7 space-y-6">
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-widest ${textMuted} mb-2 block`}>Branch Name</label>
              <input
                type="text"
                placeholder="e.g., Noida Branch"
                value={formData.bm_name}
                onChange={(e) => setFormData({ ...formData, bm_name: e.target.value })}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all text-sm font-medium focus:ring-2 ${inputBg}`}
                style={{ borderColor: formData.bm_name ? primaryColor?.value : undefined }}
                onFocus={(e) => { e.target.style.borderColor = primaryColor?.value; e.target.style.boxShadow = `0 0 0 2px ${primaryColor?.value}33` }}
                onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = '' }}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button type="button" onClick={onClose} className={`flex-1 px-4 py-3.5 rounded-xl font-bold transition-colors text-sm ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center disabled:opacity-70" style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}>
                {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : (initialData ? 'Update' : 'Save')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BranchFormModal;