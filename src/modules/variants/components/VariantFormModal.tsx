import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, Layers, IndianRupee, Settings2, CheckCircle2 } from 'lucide-react';
import { VariantFormSchema, type VariantFormData, type VariantEntity } from '../types';

interface VariantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VariantFormData) => Promise<void>;
  initialData?: VariantEntity | null;
  itemId: number; // Required to link variant to item
  primaryColor: any;
  isDark: boolean;
}

const VariantFormModal: React.FC<VariantFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, itemId, primaryColor, isDark }) => {
  
  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-600 focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white';
  const labelClass = `text-[11px] font-bold uppercase tracking-widest mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const sectionTitleClass = `flex items-center gap-2 text-sm font-bold pb-3 border-b mb-6 ${isDark ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-100'}`;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VariantFormData>({
    resolver: zodResolver(VariantFormSchema),
    defaultValues: { 
      item_id: itemId, name: '', code: '', sku: '', 
      price: 0, compare_price: 0, sort_order: 0, 
      is_default: false, is_available: true 
    }
  });

  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        variant_id: initialData.ivm_id,
        item_id: initialData.item_id || itemId,
        name: initialData.ivm_variant_name || '',
        code: initialData.ivm_variant_code || '',
        sku: initialData.ivm_sku || '',
        price: initialData.ivm_price || 0,
        compare_price: initialData.ivm_compare_price || 0,
        sort_order: initialData.ivm_sort_order || 0,
        is_default: initialData.ivm_is_default ?? false,
        is_available: initialData.ivm_is_available ?? true,
      });
    } else if (isOpen) {
      reset({ 
        item_id: itemId, name: '', code: '', sku: '', 
        price: 0, compare_price: 0, sort_order: 0, 
        is_default: false, is_available: true 
      });
    }
  }, [initialData, isOpen, reset, itemId]);

  if (!isOpen) return null;

  const onFormSubmit: SubmitHandler<VariantFormData> = async (data) => {
    await onSubmit(data);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium focus:ring-2 ${inputBg}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} transition={{ duration: 0.2, ease: "easeOut" }} className={`w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border flex flex-col ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} max-h-[90vh]`}>
          
          <div className={`px-8 py-6 flex justify-between items-center z-10 border-b ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${primaryColor?.value}15`, color: primaryColor?.value }}><Layers size={24} /></div>
              <div>
                <h2 className={`text-xl font-black tracking-tight ${textMain}`}>{initialData ? 'Edit Variant' : 'Create New Variant'}</h2>
                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${textMuted}`}>Portions, sizes, or pricing tiers.</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className={`p-2.5 rounded-full transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-500'}`}><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              {initialData && <input type="hidden" {...register('variant_id', { valueAsNumber: true })} />}
              <input type="hidden" {...register('item_id', { valueAsNumber: true })} />

              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-gray-900/30 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
                <h3 className={sectionTitleClass}><Layers size={16} /> Variant Identity</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className={labelClass}>Variant Name *</label>
                    <input {...register('name')} placeholder="e.g., Half, Full, Large" className={inputClass} style={{ borderColor: errors.name ? '#EF4444' : undefined }} />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Variant Code</label>
                    <input {...register('code')} placeholder="e.g., HALF-01" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>SKU</label>
                    <input {...register('sku')} placeholder="e.g., SKU_HALF" className={inputClass} />
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-gray-900/30 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
                <h3 className={sectionTitleClass}><IndianRupee size={16} /> Pricing & Display</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Price (₹) *</label>
                    <div className="relative">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-black ${textMuted}`}>₹</span>
                      <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className={`pl-8 font-bold text-lg ${inputClass}`} style={{ borderColor: errors.price ? '#EF4444' : undefined }} />
                    </div>
                    {errors.price && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.price.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Compare / Discount Price (₹)</label>
                    <div className="relative">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-black ${textMuted}`}>₹</span>
                      <input type="number" step="0.01" {...register('compare_price', { valueAsNumber: true })} className={`pl-8 font-bold text-lg text-emerald-500 ${inputClass}`} />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Sort Order</label>
                    <input type="number" {...register('sort_order', { valueAsNumber: true })} className={inputClass} placeholder="0" />
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-gray-900/30 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
                <h3 className={sectionTitleClass}><Settings2 size={16} /> Configuration</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-bold ${textMain}`}>Default Variant</p>
                      <p className={`text-[11px] font-bold uppercase tracking-widest ${textMuted}`}>Auto-selected when viewing item</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" {...register('is_default')} className="sr-only peer" />
                      <div className={`w-12 h-6.5 rounded-full peer transition-all duration-300 relative ${isDark ? 'bg-gray-700' : 'bg-gray-200'} peer-checked:bg-[${primaryColor?.value}]`}>
                        <div className="absolute top-[3px] left-[3px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-300 peer-checked:translate-x-[22px] peer-checked:border-white"></div>
                      </div>
                    </label>
                  </div>
                  <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-bold ${textMain}`}>Available</p>
                      <p className={`text-[11px] font-bold uppercase tracking-widest ${textMuted}`}>Variant can be ordered</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" {...register('is_available')} className="sr-only peer" />
                      <div className={`w-12 h-6.5 rounded-full peer transition-all duration-300 relative ${isDark ? 'bg-gray-700' : 'bg-gray-200'} peer-checked:bg-[${primaryColor?.value}]`}>
                        <div className="absolute top-[3px] left-[3px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-300 peer-checked:translate-x-[22px] peer-checked:border-white"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

            </div>

            <div className={`px-8 py-5 border-t ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'} flex flex-col sm:flex-row justify-end items-center gap-3`}>
              <button type="button" onClick={onClose} className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold transition-colors text-sm ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3.5 text-white rounded-xl font-bold text-sm shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70" style={{ backgroundColor: primaryColor?.value, boxShadow: `0 8px 20px -4px ${primaryColor?.value}60` }}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                {initialData ? 'Update Variant' : 'Save Variant'}
              </button>
            </div>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VariantFormModal;