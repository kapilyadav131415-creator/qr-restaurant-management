import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  X, Save, Loader2, Package, Tag as TagIcon, 
  Image as ImageIcon, Info, CheckCircle2, 
  Clock, ChevronRight, ChevronLeft
} from 'lucide-react';
import { ItemFormSchema, type ItemFormData, type ItemEntity } from '../types';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => Promise<void>;
  initialData?: ItemEntity | null;
  menus: any[];
  categories: any[];
  branches: any[];
  primaryColor: any;
  isDark: boolean;
}

const steps = [
  { id: 1, title: 'Organization', icon: TagIcon },
  { id: 2, title: 'Item Details', icon: Info },
  { id: 3, title: 'Media & Settings', icon: ImageIcon }
];

const ItemFormModal: React.FC<ItemFormModalProps> = ({ 
  isOpen, onClose, onSubmit, initialData, 
  menus, categories, branches, primaryColor, isDark 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-600 focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white';
  const labelClass = `text-[11px] font-bold uppercase tracking-widest mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const sectionTitleClass = `flex items-center gap-2 text-sm font-bold pb-3 border-b mb-6 ${isDark ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-100'}`;
  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium focus:ring-2 ${inputBg}`;

  const { register, handleSubmit, reset, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm<ItemFormData>({
    resolver: zodResolver(ItemFormSchema),
    mode: 'onChange',
    defaultValues: { 
      menu_id: 0, category_id: 0, branch_id: 0, name: '', code: '', short_description: '', description: '',
      food_type: 'veg', image_url: '', banner_image_url: '', sort_order: 0, preparation_time: 15,
      is_featured: false, is_recommended: false, is_spicy: false, is_bestseller: false, is_new: false, is_available: true,
      meta_title: '', meta_description: ''
    }
  });

  const selectedMenuId = watch('menu_id');
  const watchedImageUrl = watch('image_url');
  const selectedCategoryId = watch('category_id');

  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        item_id: initialData.im_id,
        menu_id: initialData.menu_id || 0,
        category_id: initialData.category_id || 0,
        branch_id: initialData.branch_id || 0,
        name: initialData.im_name || '',
        code: initialData.im_code || '',
        short_description: initialData.im_short_description || '',
        description: initialData.im_description || '',
        food_type: initialData.im_food_type || 'veg',
        image_url: initialData.im_image_url || '',
        banner_image_url: initialData.im_banner_image_url || '',
        sort_order: initialData.im_sort_order || 0,
        preparation_time: initialData.im_preparation_time || 15,
        is_featured: initialData.im_is_featured ?? false,
        is_recommended: initialData.im_is_recommended ?? false,
        is_spicy: initialData.im_is_spicy ?? false,
        is_bestseller: initialData.im_is_bestseller ?? false,
        is_new: initialData.im_is_new ?? false,
        is_available: initialData.im_is_available ?? true,
        meta_title: initialData.im_meta_title || '',
        meta_description: initialData.im_meta_description || ''
      });
      setCurrentStep(1);
    } else if (isOpen) {
      reset({ 
        name: '', code: '', short_description: '', description: '', food_type: 'veg', image_url: '', banner_image_url: '',
        sort_order: 0, preparation_time: 15, is_featured: false, is_recommended: false, is_spicy: false, is_bestseller: false, is_new: false, is_available: true,
        meta_title: '', meta_description: '', menu_id: menus[0]?.menu_id || menus[0]?.mm_id || 0, category_id: 0, branch_id: 0 
      });
      setCurrentStep(1);
    }
  }, [initialData, isOpen, reset, menus]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter(c => Number(c.menu_id || c.cm_menu_id || c.mm_id) === Number(selectedMenuId));

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['menu_id', 'category_id', 'branch_id'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['name', 'code', 'food_type', 'short_description', 'description'];
    }

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      console.error("Validation failed for fields:", fieldsToValidate);
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (currentStep < steps.length) {
        handleNext();
      } else {
        handleSubmit(onSubmit)();
      }
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? -50 : 50, opacity: 0 })
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.96, y: 20 }} 
          transition={{ duration: 0.2, ease: "easeOut" }} 
          className={`w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} max-h-[95vh]`}
        >
          
          <div className={`px-8 py-6 flex justify-between items-center z-10 border-b ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${primaryColor?.value}15`, color: primaryColor?.value }}>
                <Package size={24} />
              </div>
              <div>
                <h2 className={`text-2xl font-black tracking-tight ${textMain}`}>{initialData ? 'Edit Product Item' : 'Create New Item'}</h2>
                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${textMuted}`}>Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className={`p-2.5 rounded-full transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-500'}`}><X size={18} /></button>
          </div>

          <div className={`px-8 pt-6 pb-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between relative">
              <div className={`absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full`}></div>
              <div 
                className="absolute left-8 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - ${currentStep === 1 ? 0 : 32}px)`, backgroundColor: primaryColor?.value }}
              ></div>
              
              {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="relative flex flex-col items-center z-10 bg-inherit px-2">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 shadow-sm
                        ${isActive ? 'scale-110' : ''}
                        ${isCompleted ? 'border-transparent text-white' : isActive ? 'text-white border-transparent' : isDark ? 'bg-gray-800 border-gray-600 text-gray-500' : 'bg-white border-gray-300 text-gray-400'}
                      `}
                      style={{ 
                        backgroundColor: (isActive || isCompleted) ? primaryColor?.value : (isDark ? '#1F2937' : '#FFFFFF'),
                        boxShadow: isActive ? `0 0 0 4px ${primaryColor?.value}25` : undefined
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div onKeyDown={handleKeyDown} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-8 overflow-x-hidden overflow-y-auto custom-scrollbar relative flex-1 min-h-[400px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "tween", duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-gray-900/30 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
                      <h3 className={sectionTitleClass}><TagIcon size={16} /> Organization Details</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className={labelClass}>Select Menu *</label>
                          <select 
                            value={selectedMenuId || 0}
                            onChange={(e) => {
                              setValue('menu_id', Number(e.target.value), { shouldValidate: true });
                              setValue('category_id', 0, { shouldValidate: true });
                            }}
                            className={inputClass}
                            style={{ borderColor: errors.menu_id ? '#EF4444' : undefined }}
                          >
                            <option value={0} disabled>Select a Menu</option>
                            {menus.map(m => <option key={m.menu_id || m.mm_id} value={m.menu_id || m.mm_id}>{m.mm_name}</option>)}
                          </select>
                          {errors.menu_id && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.menu_id.message}</p>}
                        </div>
                        
                        <div>
                          <label className={labelClass}>Select Category *</label>
                          <select 
                            value={selectedCategoryId || 0}
                            onChange={(e) => setValue('category_id', Number(e.target.value), { shouldValidate: true })}
                            className={inputClass} 
                            disabled={!selectedMenuId || filteredCategories.length === 0}
                            style={{ borderColor: errors.category_id ? '#EF4444' : undefined }}
                          >
                            <option value={0} disabled>{filteredCategories.length === 0 && selectedMenuId ? 'No Categories Available' : 'Select a Category'}</option>
                            {filteredCategories.map(c => <option key={c.cm_id || c.category_id} value={c.cm_id || c.category_id}>{c.cm_name || c.category_name}</option>)}
                          </select>
                          {errors.category_id && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.category_id.message}</p>}
                        </div>

                        <div>
                          <label className={labelClass}>Operational Branch</label>
                          <select 
                            value={watch('branch_id') || 0}
                            onChange={(e) => setValue('branch_id', Number(e.target.value), { shouldValidate: true })}
                            className={inputClass}
                          >
                            <option value={0}>All Operational Branches</option>
                            {branches.map(b => <option key={b.bm_id} value={b.bm_id}>{b.bm_name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "tween", duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-gray-900/30 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
                      <h3 className={sectionTitleClass}><Info size={16} /> Basic Item Info</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className={labelClass}>Item Name *</label>
                          <input 
                            {...register('name')} 
                            placeholder="e.g., Spicy Paneer Tikka" 
                            className={`text-base ${inputClass}`} 
                            style={{ borderColor: errors.name ? '#EF4444' : undefined }} 
                          />
                          {errors.name && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.name.message}</p>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            <label className={labelClass}>Item Code / SKU</label>
                            <input {...register('code')} placeholder="e.g., PT001" className={inputClass} style={{ borderColor: errors.code ? '#EF4444' : undefined }} />
                            {errors.code && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.code.message}</p>}
                          </div>
                          <div>
                            <label className={labelClass}>Food Type</label>
                            <select {...register('food_type')} className={inputClass} style={{ borderColor: errors.food_type ? '#EF4444' : undefined }}>
                              <option value="veg">Vegetarian (Veg)</option>
                              <option value="nonveg">Non-Vegetarian</option>
                              <option value="vegan">Vegan</option>
                              <option value="egg">Contains Egg</option>
                              <option value="jain">Jain Food</option>
                            </select>
                            {errors.food_type && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.food_type.message}</p>}
                          </div>
                        </div>
                        
                        <div>
                          <label className={labelClass}>Short Description</label>
                          <input {...register('short_description')} placeholder="A quick catchy tagline..." className={inputClass} style={{ borderColor: errors.short_description ? '#EF4444' : undefined }} />
                          {errors.short_description && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.short_description.message}</p>}
                        </div>
                        
                        <div>
                          <label className={labelClass}>Full Description</label>
                          <textarea {...register('description')} placeholder="Detailed ingredients, preparation method..." rows={4} className={`${inputClass} resize-none`} style={{ borderColor: errors.description ? '#EF4444' : undefined }} />
                          {errors.description && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.description.message}</p>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "tween", duration: 0.3 }}
                    className="space-y-6 pb-10"
                  >
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-gray-900/30 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
                      <h3 className={sectionTitleClass}><ImageIcon size={16} /> Media Assets</h3>
                      <div className={`w-full aspect-video rounded-2xl mb-5 border border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                        {watchedImageUrl ? <img src={watchedImageUrl} alt="Preview" className="w-full h-full object-cover" /> : <div className="text-gray-400 flex flex-col items-center"><ImageIcon size={32} className="mb-2 opacity-50" /><span className="text-[10px] font-bold uppercase">No Image Preview</span></div>}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Item Image URL</label>
                          <input {...register('image_url')} placeholder="https://example.com/item.jpg" className={inputClass} style={{ borderColor: errors.image_url ? '#EF4444' : undefined }} />
                          {errors.image_url && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.image_url.message}</p>}
                        </div>
                        <div>
                          <label className={labelClass}>Banner Image URL (Optional)</label>
                          <input {...register('banner_image_url')} placeholder="https://example.com/banner.jpg" className={inputClass} style={{ borderColor: errors.banner_image_url ? '#EF4444' : undefined }} />
                          {errors.banner_image_url && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.banner_image_url.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-gray-900/30 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
                      <h3 className={sectionTitleClass}><Clock size={16} /> Operations & SEO</h3>
                      <div className="grid grid-cols-2 gap-5 mb-5">
                        <div>
                          <label className={labelClass}>Prep Time (Mins)</label>
                          <input type="number" {...register('preparation_time', { valueAsNumber: true })} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Sort Order</label>
                          <input type="number" {...register('sort_order', { valueAsNumber: true })} className={inputClass} />
                        </div>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <label className={labelClass}>Meta Title</label>
                          <input {...register('meta_title')} placeholder="SEO title..." className={inputClass} style={{ borderColor: errors.meta_title ? '#EF4444' : undefined }} />
                          {errors.meta_title && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.meta_title.message}</p>}
                        </div>
                        <div>
                          <label className={labelClass}>Meta Description</label>
                          <input {...register('meta_description')} placeholder="SEO description..." className={inputClass} style={{ borderColor: errors.meta_description ? '#EF4444' : undefined }} />
                          {errors.meta_description && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.meta_description.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-gray-900/30 border-gray-700' : 'bg-gray-50/50 border-gray-100'}`}>
                      <h3 className={sectionTitleClass}><CheckCircle2 size={16} /> Item Tags</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {['is_featured', 'is_recommended', 'is_spicy', 'is_bestseller', 'is_new'].map((flag) => (
                          <label key={flag} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                            <input type="checkbox" {...register(flag as keyof ItemFormData)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                            <span className={`text-xs font-bold capitalize ${textMain}`}>{flag.replace('is_', '')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={`px-8 py-5 border-t ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'} flex justify-between items-center z-10`}>
              
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('is_available')} className="sr-only peer" />
                  <div className={`w-11 h-6 rounded-full transition-all duration-300 relative ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ backgroundColor: watch('is_available') ? primaryColor?.value : undefined }}>
                    <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-300 ${watch('is_available') ? 'translate-x-[20px] border-white' : ''}`}></div>
                  </div>
                </label>
                <div className="hidden sm:block">
                  <p className={`text-sm font-bold ${textMain}`}>Available</p>
                </div>
              </div>

              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    onClick={handlePrev} 
                    className={`px-5 py-3 rounded-xl font-bold transition-colors text-sm flex items-center gap-2 ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
                
                {currentStep < steps.length ? (
                  <button 
                    type="button" 
                    onClick={handleNext}
                    className="px-6 py-3 text-white rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2" 
                    style={{ backgroundColor: primaryColor?.value }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => handleSubmit(onSubmit)()}
                    disabled={isSubmitting} 
                    className="px-8 py-3 text-white rounded-xl font-bold text-sm shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70" 
                    style={{ backgroundColor: primaryColor?.value, boxShadow: `0 8px 20px -4px ${primaryColor?.value}60` }}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {initialData ? 'Update Item' : 'Publish'}
                  </button>
                )}
              </div>

            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ItemFormModal;