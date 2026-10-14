import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, PlusCircle, IndianRupee } from 'lucide-react';
import { AddonItemSchema, type AddonItemFormData, type AddonItemEntity } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddonItemFormData) => Promise<void>;
  initialData?: AddonItemEntity | null;
  groupId: number;
  primaryColor: any;
  isDark: boolean;
}

export const AddonItemModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData, groupId, primaryColor, isDark }) => {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<AddonItemFormData>({
    resolver: zodResolver(AddonItemSchema),
    defaultValues: { group_id: groupId, name: '', code: '', description: '', price: 0, discount_price: 0, image_url: '', stock_qty: 100, sort_order: 0, is_available: true }
  });

  const watchedIsAvailable = watch('is_available');

  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        addon_item_id: initialData.ai_id, 
        group_id: initialData.group_id, 
        name: initialData.ai_name, 
        code: initialData.ai_code || '',
        description: initialData.ai_description || '', 
        price: initialData.ai_price, 
        discount_price: initialData.ai_discount_price || 0,
        image_url: initialData.ai_image_url || '', 
        stock_qty: initialData.ai_stock_qty, 
        sort_order: initialData.ai_sort_order, 
        is_available: initialData.ai_is_available,
      });
    } else if (isOpen) {
      reset({ group_id: groupId, name: '', code: '', description: '', price: 0, discount_price: 0, image_url: '', stock_qty: 100, sort_order: 0, is_available: true });
    }
  }, [initialData, isOpen, reset, groupId]);

  if (!isOpen) return null;

  // FIX 1: Explicit Submit Handler to bypass Type mismatches
  const onFormSubmit: SubmitHandler<AddonItemFormData> = async (data) => {
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
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} max-h-[90vh]`}>
          
          <div className={`px-8 py-6 border-b flex justify-between items-center ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor?.value}15`, color: primaryColor?.value }}><PlusCircle size={24} /></div>
              <div>
                <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{initialData ? 'Edit Addon' : 'Create Addon Item'}</h2>
              </div>
            </div>
            <button type="button" onClick={onClose} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X size={20} /></button>
          </div>

          {/* FIX 2: Replaced form with div to prevent native submission bugs */}
          <div onKeyDown={handleKeyDown} className="flex-1 flex flex-col overflow-hidden">
            
            <div className="flex-1 overflow-y-auto p-8 space-y-5 custom-scrollbar">
              <div>
                <label className={`text-[11px] font-bold uppercase block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Addon Name *</label>
                <input {...register('name')} placeholder="e.g., Mozzarella Slice" className={inputClass} style={{ borderColor: errors.name ? '#EF4444' : undefined }} />
                {errors.name && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.name.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={`text-[11px] font-bold uppercase block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Price (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                    <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className={`pl-8 font-bold ${inputClass}`} style={{ borderColor: errors.price ? '#EF4444' : undefined }} />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.price.message}</p>}
                </div>
                <div>
                  <label className={`text-[11px] font-bold uppercase block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Stock Qty</label>
                  <input type="number" {...register('stock_qty', { valueAsNumber: true })} className={inputClass} style={{ borderColor: errors.stock_qty ? '#EF4444' : undefined }} />
                  {errors.stock_qty && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.stock_qty.message}</p>}
                </div>
              </div>

              <div className={`p-5 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-gray-900/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div>
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Available in Menu</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('is_available')} className="sr-only peer" />
                  <div className={`w-11 h-6 rounded-full transition-all duration-300 relative ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ backgroundColor: watchedIsAvailable ? primaryColor?.value : undefined }}>
                    <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-300 ${watchedIsAvailable ? 'translate-x-[20px] border-white' : ''}`}></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Form Footer */}
            <div className={`p-6 border-t flex justify-end gap-3 ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
              <button type="button" onClick={onClose} className={`px-6 py-3 rounded-xl font-bold text-sm ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}>Cancel</button>
              <button type="button" onClick={() => handleSubmit(onFormSubmit)()} disabled={isSubmitting} className="px-8 py-3 text-white rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ backgroundColor: primaryColor?.value }}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Save Addon
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};