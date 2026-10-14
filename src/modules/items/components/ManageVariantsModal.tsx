import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, IndianRupee, SplitSquareHorizontal, Layers, Edit, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { catalogApi } from '../api';
import { VariantFormSchema, type VariantFormData, type VariantEntity } from '../types';
import type { ItemEntity } from '../types';

interface ManageVariantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemEntity | null;
  onVariantsUpdated: () => void;
  primaryColor: any;
  isDark: boolean;
}

const ManageVariantsModal: React.FC<ManageVariantsModalProps> = ({ isOpen, onClose, item, onVariantsUpdated, primaryColor, isDark }) => {
  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-900 border-gray-700 text-white focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white';
  const labelClass = `text-[11px] font-bold uppercase tracking-widest mb-1.5 block ${textMuted}`;

  const [variants, setVariants] = useState<VariantEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VariantFormData>({
    resolver: zodResolver(VariantFormSchema),
    defaultValues: { item_id: item?.im_id || 0, variant_name: '', variant_code: '', price: 0, discount_price: 0, sort_order: 0, is_default: false, is_available: true }
  });

  const loadVariants = async () => {
    if (!item) return;
    setLoading(true);
    try {
      const data = await catalogApi.getVariants();
      const filtered = data.filter(v => v.item_id === item.im_id).sort((a, b) => a.sort_order - b.sort_order);
      setVariants(filtered);
    } catch (error) { toast.error('Failed to load variants'); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (isOpen && item) {
      loadVariants();
      resetForm();
    }
  }, [isOpen, item]);

  const resetForm = () => {
    setEditMode(false);
    reset({ variant_id: undefined, item_id: item?.im_id || 0, variant_name: '', variant_code: '', price: 0, discount_price: 0, sort_order: 0, is_default: false, is_available: true });
  };

  const handleEditClick = (v: VariantEntity) => {
    setEditMode(true);
    reset({ variant_id: v.variant_id, item_id: v.item_id, variant_name: v.variant_name, variant_code: v.variant_code, price: v.price, discount_price: v.discount_price, sort_order: v.sort_order, is_default: v.is_default, is_available: v.is_available });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this variant?')) return;
    try {
      await catalogApi.deleteVariant(id);
      toast.success('Variant deleted');
      loadVariants();
      onVariantsUpdated();
      resetForm();
    } catch (error) { toast.error('Failed to delete'); }
  };

  const onFormSubmit: SubmitHandler<VariantFormData> = async (data) => {
    try {
      if (editMode) {
        await catalogApi.updateVariant(data);
        toast.success('Variant updated!');
      } else {
        await catalogApi.createVariant(data);
        toast.success('Variant added!');
      }
      loadVariants();
      onVariantsUpdated();
      resetForm();
    } catch (error) { toast.error('Operation failed'); }
  };

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          
          {/* LEFT PANEL */}
          <div className={`w-full md:w-1/2 flex flex-col border-r ${isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-100 bg-gray-50'}`}>
            <div className="p-6 border-b border-inherit">
              <h2 className={`text-xl font-black ${textMain}`}>{item.im_name}</h2>
              <p className={`text-xs font-medium mt-1 ${textMuted}`}>Manage pricing, sizes, or portions.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400" /></div>
              ) : variants.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-2xl border-gray-300 dark:border-gray-700">
                  <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}><Layers className={textMuted} /></div>
                  <p className={`text-sm font-bold ${textMain}`}>No Variants Setup</p>
                  <p className={`text-xs ${textMuted} mt-1`}>Items must have variants to be sold.</p>
                </div>
              ) : (
                variants.map((v) => (
                  <div key={v.variant_id} className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-bold text-sm ${textMain}`}>{v.variant_name}</h4>
                          {v.is_default && <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1"><Star size={10} className="fill-current"/> Default</span>}
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${textMuted} mt-1`}>{v.variant_code || 'NO CODE'}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${textMain}`}>₹{v.price}</p>
                        {v.discount_price > 0 && <p className={`text-[10px] font-bold line-through ${textMuted}`}>₹{v.discount_price}</p>}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-inherit flex justify-between items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${v.is_available ? 'text-green-500' : 'text-gray-400'}`}>{v.is_available ? 'Active' : 'Off'}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(v)} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><Edit size={14}/></button>
                        <button onClick={() => handleDelete(v.variant_id)} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'}`}><Trash2 size={14}/></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full md:w-1/2 flex flex-col relative">
            <button onClick={onClose} className={`absolute top-6 right-6 p-2 rounded-full z-10 transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X size={20} /></button>
            
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              <h3 className={`text-lg font-bold ${textMain}`}>{editMode ? 'Edit Variant' : 'Add New Variant'}</h3>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              <div>
                <label className={labelClass}>Variant Name (e.g., Half, Full) *</label>
                <input {...register('variant_name')} className={`w-full px-4 py-3 rounded-xl border outline-none text-sm font-bold focus:ring-2 ${inputBg}`} style={{ borderColor: errors.variant_name ? '#EF4444' : undefined }} />
                {errors.variant_name && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.variant_name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Selling Price (₹) *</label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-black ${textMuted}`}>₹</span>
                    <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className={`w-full pl-7 pr-4 py-3 rounded-xl border outline-none text-sm font-bold focus:ring-2 ${inputBg}`} style={{ borderColor: errors.price ? '#EF4444' : undefined }} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Discount Price (₹)</label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-black ${textMuted}`}>₹</span>
                    <input type="number" step="0.01" {...register('discount_price', { valueAsNumber: true })} className={`w-full pl-7 pr-4 py-3 rounded-xl border outline-none text-sm font-bold text-emerald-500 focus:ring-2 ${inputBg}`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Variant Code</label><input {...register('variant_code')} className={`w-full px-4 py-3 rounded-xl border text-sm ${inputBg}`} /></div>
                <div><label className={labelClass}>Sort Order</label><input type="number" {...register('sort_order', { valueAsNumber: true })} className={`w-full px-4 py-3 rounded-xl border text-sm ${inputBg}`} /></div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${isDark ? 'bg-gray-900/50 border-gray-700 hover:bg-gray-800' : 'bg-gray-50 border-gray-200 hover:bg-white'}`}>
                  <input type="checkbox" {...register('is_default')} className="w-4 h-4 rounded text-blue-600" />
                  <div><span className={`text-sm font-bold ${textMain} block`}>Make Default Variant</span></div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${isDark ? 'bg-gray-900/50 border-gray-700 hover:bg-gray-800' : 'bg-gray-50 border-gray-200 hover:bg-white'}`}>
                  <input type="checkbox" {...register('is_available')} className="w-4 h-4 rounded text-blue-600" />
                  <div><span className={`text-sm font-bold ${textMain} block`}>Available for Order</span></div>
                </label>
              </div>

              <div className="pt-6 flex gap-3">
                {editMode && <button type="button" onClick={resetForm} className={`flex-1 py-3 rounded-xl font-bold text-sm border ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}>Cancel</button>}
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 text-white rounded-xl font-bold text-sm shadow-xl flex justify-center items-center gap-2 disabled:opacity-70" style={{ backgroundColor: primaryColor?.value }}>
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {editMode ? 'Update Variant' : 'Save Variant'}
                </button>
              </div>
            </form>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ManageVariantsModal;