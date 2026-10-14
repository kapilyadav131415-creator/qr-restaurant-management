import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, LayoutGrid, MapPin, Settings2 } from 'lucide-react';
import { TableFormSchema, type TableFormData, type TableEntity } from '../types';

interface TableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TableFormData) => Promise<void>;
  initialData?: TableEntity | null;
  branches: any[];
  primaryColor: any;
  isDark: boolean;
}

const TableFormModal: React.FC<TableFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, branches, primaryColor, isDark }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TableFormData>({
    resolver: zodResolver(TableFormSchema),
    defaultValues: { table_type: 'dinein', shape: 'square', capacity: 4 }
  });

  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        table_id: initialData.tm_id,
        branch_id: initialData.branch_id || branches[0]?.bm_id || 0,
        table_name: initialData.tm_table_name,
        table_code: initialData.tm_table_code,
        capacity: initialData.tm_capacity,
        floor_name: initialData.tm_floor_name || '',
        section_name: initialData.tm_section_name || '',
        table_type: initialData.tm_table_type || 'dinein',
        shape: initialData.tm_shape || 'square',
      });
    } else if (isOpen) {
      reset({ table_name: '', table_code: '', capacity: 4, floor_name: '', section_name: '', table_type: 'dinein', shape: 'square', branch_id: branches[0]?.bm_id || 0 });
    }
  }, [initialData, isOpen, reset, branches]);

  if (!isOpen) return null;

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white focus:bg-gray-800' : 'bg-[#FCFDFD] border-gray-200 text-gray-900 focus:bg-white'}`;
  const labelClass = `text-[11px] font-bold uppercase tracking-widest mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const sectionTitleClass = `flex items-center gap-2 text-sm font-bold pb-2 border-b mb-4 ${isDark ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-100'}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className={`w-full max-w-2xl rounded-[28px] shadow-2xl overflow-hidden border flex flex-col ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} max-h-[90vh]`}>
          
          {/* Header */}
          <div className={`px-8 py-6 flex justify-between items-center z-10 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
            <div>
              <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {initialData ? 'Edit Table Settings' : 'Create New Table'}
              </h2>
              <p className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Configure table identification, capacity, and placement.</p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              {initialData && <input type="hidden" {...register('table_id', { valueAsNumber: true })} />}

              {/* Section 1: General Info */}
              <div>
                <h3 className={sectionTitleClass}><LayoutGrid size={16} /> General Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Branch</label>
                    <select {...register('branch_id', { valueAsNumber: true })} className={inputClass} style={{ borderColor: errors.branch_id ? '#EF4444' : undefined }}>
                      <option value={0} disabled>Select Branch</option>
                      {branches.map(b => <option key={b.bm_id} value={b.bm_id}>{b.bm_name}</option>)}
                    </select>
                    {errors.branch_id && <p className="text-red-500 text-xs mt-1 font-bold">{errors.branch_id.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Table Name</label>
                    <input {...register('table_name')} placeholder="e.g., Table 1" className={inputClass} style={{ borderColor: errors.table_name ? '#EF4444' : undefined }} />
                    {errors.table_name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.table_name.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Table Code</label>
                    <input {...register('table_code')} placeholder="e.g., T10" className={inputClass} style={{ borderColor: errors.table_code ? '#EF4444' : undefined }} />
                    {errors.table_code && <p className="text-red-500 text-xs mt-1 font-bold">{errors.table_code.message}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Configuration */}
              <div>
                <h3 className={sectionTitleClass}><Settings2 size={16} /> Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className={labelClass}>Capacity (Seats)</label>
                    <input type="number" {...register('capacity', { valueAsNumber: true })} min="1" className={inputClass} style={{ borderColor: errors.capacity ? '#EF4444' : undefined }} />
                    {errors.capacity && <p className="text-red-500 text-xs mt-1 font-bold">{errors.capacity.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Shape</label>
                    <select {...register('shape')} className={inputClass}>
                      <option value="square">Square</option>
                      <option value="rectangle">Rectangle</option>
                      <option value="circle">Circle</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Table Type</label>
                    <select {...register('table_type')} className={inputClass}>
                      <option value="dinein">Dine In</option>
                      <option value="vip">VIP</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="takeaway">Takeaway</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Location */}
              <div>
                <h3 className={sectionTitleClass}><MapPin size={16} /> Placement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Floor Name</label>
                    <input {...register('floor_name')} placeholder="e.g., First Floor" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Section Name</label>
                    <input {...register('section_name')} placeholder="e.g., VIP Area" className={inputClass} />
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50/50'} flex justify-end gap-3`}>
              <button type="button" onClick={onClose} className={`px-6 py-3 rounded-xl font-bold transition-colors text-sm ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 text-white rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70" style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {initialData ? 'Update Table' : 'Save Table'}
              </button>
            </div>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TableFormModal;