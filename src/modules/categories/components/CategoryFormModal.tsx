import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, LayoutGrid, Image as ImageIcon, Settings2 } from 'lucide-react';
import { CategoryFormSchema, type CategoryFormData, type CategoryEntity } from '../types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialData?: CategoryEntity | null;
  menus: any[]; 
  primaryColor: any;
  isDark: boolean;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, menus, primaryColor, isDark }) => {
  const { register, handleSubmit, reset,   watch, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: { 
      menu_id: 0, category_name: '', category_code: '', description: '', 
      image_url: '', banner_image_url: '', icon: '', sort_order: 0, 
      is_recommended: false, slug: ''
    }
  });

  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        category_id: initialData.cm_id,
        menu_id: initialData.menu_id || menus[0]?.menu_id || 0,
        category_name: initialData.cm_name || '',
        category_code: initialData.cm_code || '',
        description: initialData.cm_description || '',
        image_url: initialData.cm_image_url || '',
        banner_image_url: initialData.cm_banner_image_url || '',
        icon: initialData.cm_icon || '',
        sort_order: initialData.cm_sort_order || 0,
        is_recommended: initialData.cm_is_recommended || false,
        slug: initialData.cm_slug || '',
      });
    } else if (isOpen) {
      reset({ category_name: '', category_code: '', description: '', image_url: '', banner_image_url: '', icon: '', sort_order: 0, is_recommended: false, slug: '', menu_id: menus[0]?.menu_id || 0 });
    }
  }, [initialData, isOpen, reset, menus]);
const isRecommended = watch('is_recommended');
  if (!isOpen) return null;

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white'}`;
  const labelClass = `text-[11px] font-bold uppercase tracking-widest mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const sectionTitleClass = `flex items-center gap-2 text-sm font-bold pb-2 border-b mb-4 ${isDark ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-100'}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className={`w-full max-w-3xl rounded-[28px] shadow-2xl overflow-hidden border flex flex-col ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} max-h-[90vh]`}>
          
          <div className={`px-8 py-6 flex justify-between items-center z-10 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
            <div>
              <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{initialData ? 'Edit Category' : 'Create New Category'}</h2>
              <p className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Organize your products gracefully.</p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              {initialData && <input type="hidden" {...register('category_id', { valueAsNumber: true })} />}

              <div>
                <h3 className={sectionTitleClass}><LayoutGrid size={16} /> General Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Select Menu *</label>
                    <select {...register('menu_id', { valueAsNumber: true })} className={inputClass} style={{ borderColor: errors.menu_id ? '#EF4444' : undefined }}>
                      <option value={0} disabled>Select Menu</option>
                      {menus.map(m => <option key={m.menu_id || m.mm_id} value={m.menu_id || m.mm_id}>{m.mm_name}</option>)}
                    </select>
                    {errors.menu_id && <p className="text-red-500 text-xs mt-1 font-bold">{errors.menu_id.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Category Name *</label>
                    <input {...register('category_name')} placeholder="e.g., South Indian" className={inputClass} style={{ borderColor: errors.category_name ? '#EF4444' : undefined }} />
                    {errors.category_name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.category_name.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Category Code *</label>
                    <input {...register('category_code')} placeholder="e.g., SI001" className={inputClass} style={{ borderColor: errors.category_code ? '#EF4444' : undefined }} />
                    {errors.category_code && <p className="text-red-500 text-xs mt-1 font-bold">{errors.category_code.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Description</label>
                    <textarea {...register('description')} placeholder="e.g., Authentic South Indian breakfast items..." rows={2} className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className={sectionTitleClass}><ImageIcon size={16} /> Media & Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Thumbnail Image URL</label>
                    <input {...register('image_url')} placeholder="https://..." className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Banner Image URL (Optional)</label>
                    <input {...register('banner_image_url')} placeholder="https://..." className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className={sectionTitleClass}><Settings2 size={16} /> Advanced Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                  <div>
                    <label className={labelClass}>Sort Order</label>
                    <input type="number" {...register('sort_order', { valueAsNumber: true })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Icon Name</label>
                    <input {...register('icon')} placeholder="e.g., utensils" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>URL Slug</label>
                    <input {...register('slug')} placeholder="e.g., south-indian" className={inputClass} />
                  </div>
                </div>

                <div className={`flex items-center justify-between p-5 rounded-2xl border ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                  <div>
                    <label className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} block mb-0.5`}>Recommended Category</label>
                    <p className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Highlight this category at the top of the digital menu.</p>
                  </div>
                <label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    {...register('is_recommended')}
    className="sr-only peer"
  />

  {/* Toggle Background */}
  <div
    className={`
      relative w-14 h-7 rounded-full transition-all duration-300
      ${isRecommended
        ? ''
        : isDark
        ? 'bg-gray-700'
        : 'bg-gray-300'}
    `}
    style={
      isRecommended
        ? {
            backgroundColor: primaryColor?.value,
            boxShadow: `0 0 10px ${primaryColor?.value}55`,
          }
        : {}
    }
  >
    {/* Toggle Circle */}
    <div
      className={`
        absolute top-1 left-1 w-5 h-5 rounded-full
        bg-white shadow-md transition-all duration-300
        ${isRecommended ? 'translate-x-7' : ''}
      `}
    />
  </div>
</label>
                </div>
              </div>
            </div>

            <div className={`p-6 border-t ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'} flex justify-end gap-3`}>
              <button type="button" onClick={onClose} className={`px-6 py-3 rounded-xl font-bold transition-colors text-sm ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 text-white rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70" style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {initialData ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CategoryFormModal;