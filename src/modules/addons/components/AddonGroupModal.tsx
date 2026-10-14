import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, Layers } from 'lucide-react';
import { AddonGroupSchema, type AddonGroupFormData, type AddonGroupEntity } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddonGroupFormData) => Promise<void>;
  initialData?: AddonGroupEntity | null;
  itemId: number;
  primaryColor: any;
  isDark: boolean;
}

export const AddonGroupModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData, itemId, primaryColor, isDark }) => {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<AddonGroupFormData>({
    resolver: zodResolver(AddonGroupSchema),
    defaultValues: { item_id: itemId, name: '', code: '', description: '', selection_type: 'multiple', min_select: 0, max_select: 1, is_required: false, sort_order: 0 }
  });

  const selectionType = watch('selection_type');
  const watchedIsRequired = watch('is_required');

  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        group_id: initialData.ag_id, 
        item_id: initialData.item_id, 
        name: initialData.ag_name, 
        code: initialData.ag_code || '',
        description: initialData.ag_description || '', 
        selection_type: initialData.ag_selection_type, 
        min_select: initialData.ag_min_select,
        max_select: initialData.ag_max_select, 
        is_required: initialData.ag_is_required, 
        sort_order: initialData.ag_sort_order,
      });
    } else if (isOpen) {
      reset({ item_id: itemId, name: '', code: '', description: '', selection_type: 'multiple', min_select: 0, max_select: 1, is_required: false, sort_order: 0 });
    }
  }, [initialData, isOpen, reset, itemId]);

  if (!isOpen) return null;

  // FIX 1: Explicit Submit Handler to bypass Type mismatches
  const onFormSubmit: SubmitHandler<AddonGroupFormData> = async (data) => {
    await onSubmit(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSubmit(onFormSubmit)();
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium focus:ring-2 transition-all ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-2xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} max-h-[90vh]`}>
          
          <div className={`px-8 py-6 border-b flex justify-between items-center ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor?.value}15`, color: primaryColor?.value }}><Layers size={24} /></div>
              <div>
                <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{initialData ? 'Edit Addon Group' : 'Create Addon Group'}</h2>
                <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>e.g., Toppings, Crust, Extras</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X size={20} /></button>
          </div>

          {/* FIX 2: Replaced form with div to prevent native submission bugs */}
          <div onKeyDown={handleKeyDown} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className={`text-[11px] font-bold uppercase block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Group Name *</label>
                  <input {...register('name')} placeholder="e.g., Extra Cheese" className={inputClass} style={{ borderColor: errors.name ? '#EF4444' : undefined }} />
                  {errors.name && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.name.message}</p>}
                </div>
                <div>
                  <label className={`text-[11px] font-bold uppercase block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Selection Type</label>
                  <select {...register('selection_type')} className={inputClass} style={{ borderColor: errors.selection_type ? '#EF4444' : undefined }}>
                    <option value="single">Single (Radio)</option>
                    <option value="multiple">Multiple (Checkbox)</option>
                  </select>
                  {errors.selection_type && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.selection_type.message}</p>}
                </div>
                <div>
                  <label className={`text-[11px] font-bold uppercase block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Group Code (Optional)</label>
                  <input {...register('code')} placeholder="e.g., GRP_01" className={inputClass} style={{ borderColor: errors.code ? '#EF4444' : undefined }} />
                  {errors.code && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.code.message}</p>}
                </div>
                <div>
                  <label className={`text-[11px] font-bold uppercase block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Min Selection</label>
                  <input type="number" {...register('min_select', { valueAsNumber: true })} className={inputClass} style={{ borderColor: errors.min_select ? '#EF4444' : undefined }} />
                  {errors.min_select && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.min_select.message}</p>}
                </div>
                <div>
                  <label className={`text-[11px] font-bold uppercase block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Max Selection</label>
                  <input type="number" {...register('max_select', { valueAsNumber: true })} disabled={selectionType === 'single'} className={`${inputClass} ${selectionType === 'single' ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ borderColor: errors.max_select ? '#EF4444' : undefined }} />
                  {errors.max_select && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.max_select.message}</p>}
                </div>
              </div>

              <div className={`p-5 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-gray-900/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Required Group</p>
                  <p className={`text-[10px] uppercase font-bold mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Customer must select an option</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('is_required')} className="sr-only peer" />
                  <div className={`w-11 h-6 rounded-full transition-all duration-300 relative ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ backgroundColor: watchedIsRequired ? primaryColor?.value : undefined }}>
                    <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-300 ${watchedIsRequired ? 'translate-x-[20px] border-white' : ''}`}></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Form Footer */}
            <div className={`p-6 border-t flex justify-end gap-3 ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
              <button type="button" onClick={onClose} className={`px-6 py-3 rounded-xl font-bold text-sm ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}>Cancel</button>
              <button type="button" onClick={() => handleSubmit(onFormSubmit)()} disabled={isSubmitting} className="px-8 py-3 text-white rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ backgroundColor: primaryColor?.value }}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Save Group
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};