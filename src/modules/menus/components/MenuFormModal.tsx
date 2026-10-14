import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, LayoutGrid, Clock, Settings2 } from 'lucide-react';
import type { Menu, MenuFormData } from '../types';

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MenuFormData) => Promise<void>;
  initialData?: Menu | null;
  primaryColor?: any;
  isDark?: boolean;
}

const daysOfWeek = [
  { value: 'monday', label: 'Mon' }, { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' }, { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' }, { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' },
];

const MenuFormModal: React.FC<MenuFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, primaryColor, isDark }) => {
  const [formData, setFormData] = useState<MenuFormData>({
    mm_name: '', mm_code: '', mm_description: '', mm_start_time: '09:00', mm_end_time: '17:00',
    mm_available_days: [], mm_sort_order: 0, mm_theme_color: '#F97316', mm_is_default: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        menu_id: initialData.menu_id, mm_name: initialData.mm_name, mm_code: initialData.mm_code,
        mm_description: initialData.mm_description, mm_start_time: initialData.mm_start_time,
        mm_end_time: initialData.mm_end_time, mm_available_days: initialData.mm_available_days,
        mm_sort_order: initialData.mm_sort_order, mm_theme_color: initialData.mm_theme_color,
        mm_is_default: initialData.mm_is_default,
      });
    } else if (isOpen) {
      setFormData({ mm_name: '', mm_code: '', mm_description: '', mm_start_time: '09:00', mm_end_time: '17:00', mm_available_days: [], mm_sort_order: 0, mm_theme_color: primaryColor?.value || '#F97316', mm_is_default: false });
    }
  }, [initialData, isOpen, primaryColor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      mm_available_days: prev.mm_available_days.includes(day)
        ? prev.mm_available_days.filter(d => d !== day)
        : [...prev.mm_available_days, day],
    }));
  };

  if (!isOpen) return null;
  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white'}`;
  const labelClass = `text-[11px] font-bold uppercase tracking-widest mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const sectionTitleClass = `flex items-center gap-2 text-sm font-bold pb-2 border-b mb-4 ${isDark ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-100'}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className={`w-full max-w-2xl rounded-[28px] shadow-2xl overflow-hidden border flex flex-col ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} max-h-[90vh]`}>
          
          {/* Header */}
          <div className={`px-8 py-6 flex justify-between items-center z-10 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
            <div>
              <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{initialData ? 'Edit Menu' : 'Create New Menu'}</h2>
              <p className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Configure menu details, timings, and visual theme.</p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              
              {/* Section 1: General Details */}
              <div>
                <h3 className={sectionTitleClass}><LayoutGrid size={16} /> General Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Menu Name *</label>
                    <input type="text" placeholder="e.g., Breakfast Menu" value={formData.mm_name} onChange={(e) => setFormData({ ...formData, mm_name: e.target.value })} className={inputClass} style={{ borderColor: formData.mm_name ? primaryColor?.value : undefined }} required />
                  </div>
                  <div>
                    <label className={labelClass}>Menu Code *</label>
                    <input type="text" placeholder="e.g., BRKFST_01" value={formData.mm_code} onChange={(e) => setFormData({ ...formData, mm_code: e.target.value.toUpperCase() })} className={inputClass} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Description</label>
                    <textarea placeholder="Describe the menu purpose..." value={formData.mm_description} onChange={(e) => setFormData({ ...formData, mm_description: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>

              {/* Section 2: Timings & Days */}
              <div>
                <h3 className={sectionTitleClass}><Clock size={16} /> Timings & Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelClass}>Start Time</label>
                    <input type="time" value={formData.mm_start_time} onChange={(e) => setFormData({ ...formData, mm_start_time: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>End Time</label>
                    <input type="time" value={formData.mm_end_time} onChange={(e) => setFormData({ ...formData, mm_end_time: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => {
                      const isActive = formData.mm_available_days.includes(day.value);
                      return (
                        <button key={day.value} type="button" onClick={() => toggleDay(day.value)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isActive ? 'text-white border-transparent shadow-md' : (isDark ? 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50')}`} style={isActive ? { backgroundColor: primaryColor?.value } : {}}>
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 3: Configuration */}
              <div>
                <h3 className={sectionTitleClass}><Settings2 size={16} /> Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelClass}>Sort Order</label>
                    <input type="number" value={formData.mm_sort_order} onChange={(e) => setFormData({ ...formData, mm_sort_order: parseInt(e.target.value) || 0 })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Theme Color</label>
                    <div className="flex gap-3 items-center">
                      <input type="color" value={formData.mm_theme_color} onChange={(e) => setFormData({ ...formData, mm_theme_color: e.target.value })} className="w-12 h-12 rounded-lg border cursor-pointer shrink-0" />
                      <input type="text" value={formData.mm_theme_color} onChange={(e) => setFormData({ ...formData, mm_theme_color: e.target.value.toUpperCase() })} className={`font-mono ${inputClass}`} />
                    </div>
                  </div>
                </div>

                <div className={`flex items-center justify-between p-5 rounded-2xl border ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                  <div>
                    <label className={`text-sm font-bold ${textMain} block mb-0.5`}>Set as Default Menu</label>
                    <p className={`text-[11px] font-medium ${textMuted}`}>This menu will open automatically when users scan the QR code.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.mm_is_default} onChange={(e) => setFormData({ ...formData, mm_is_default: e.target.checked })} />
                     <div
      className={`
        relative w-14 h-7 rounded-full transition-all duration-300
        ${formData.mm_is_default
          ? ''
          : isDark
          ? 'bg-gray-700'
          : 'bg-gray-300'}
      `}
      style={
        formData.mm_is_default
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
          ${formData.mm_is_default ? 'translate-x-7' : ''}
        `}
      />
    </div>
                     
                  </label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'} flex justify-end gap-3`}>
              <button type="button" onClick={onClose} className={`px-6 py-3 rounded-xl font-bold transition-colors text-sm ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-8 py-3 text-white rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70" style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {initialData ? 'Update Menu' : 'Save Menu'}
              </button>
            </div>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MenuFormModal;