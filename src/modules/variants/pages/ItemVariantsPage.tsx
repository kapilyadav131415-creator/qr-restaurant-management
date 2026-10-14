// import React, { useEffect, useState } from 'react';
// import toast, { Toaster } from 'react-hot-toast';
// import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Plus, CheckCircle, Edit, Trash2, Layers, ArrowLeft, Star } from 'lucide-react';
// import { variantsApi } from '../api';
// import type { VariantEntity, VariantFormData } from '../types';
// import VariantFormModal from '../components/VariantFormModal';

// const ItemVariantsPage = () => {
//   const { itemId } = useParams<{ itemId: string }>();
//   const navigate = useNavigate();
//   const parsedItemId = Number(itemId);

//   const { primaryColor, isDark } = useOutletContext<any>();
//   const [variants, setVariants] = useState<VariantEntity[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedVariant, setSelectedVariant] = useState<VariantEntity | null>(null);

//   const textMain = isDark ? 'text-white' : 'text-[#111827]';
//   const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
//   const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
//   const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';

//   const fetchData = async () => {
//     if (!parsedItemId) {
//       toast.error('Invalid Item ID');
//       navigate('/items');
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await variantsApi.getVariants(parsedItemId);
//       setVariants(res);
//     } catch (error) {
//       toast.error('Error loading variants');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, [parsedItemId]);

//   const handleFormSubmit = async (data: VariantFormData) => {
//     try {
//       if (data.variant_id) {
//         await variantsApi.updateVariant(data);
//         toast.success('Variant updated successfully!');
//       } else {
//         await variantsApi.createVariant(data);
//         toast.success('Variant created successfully!');
//       }
//       setIsModalOpen(false);
//       fetchData(); 
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || 'Operation failed');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm("Are you sure you want to delete this variant?")) {
//       try {
//         await variantsApi.deleteVariant(id);
//         toast.success('Variant deleted');
//         fetchData(); 
//       } catch (error: any) {
//         toast.error('Delete failed');
//       }
//     }
//   };

//   const activeVariants = variants.filter(v => v.ivm_is_available).length;

//   return (
//     <div className="max-w-6xl mx-auto space-y-6 pb-20 lg:pb-6 relative">
//       <Toaster position="top-right" toastOptions={{ style: isDark ? { background: '#1f2937', color: '#fff' } : {} }} />

//       {/* TOP NAVIGATION & HEADER */}
//       <div className="space-y-4">
//         <button 
//           onClick={() => navigate('/items')} 
//           className={`flex items-center gap-2 text-sm font-bold transition-colors w-max ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
//         >
//           <ArrowLeft size={16} /> Back to Catalog
//         </button>
        
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className={`text-3xl font-black tracking-tight ${textMain}`}>Item Variants</h1>
//             <p className={`font-medium mt-1 ${textMuted}`}>Manage portions and pricing logic</p>
//           </div>
//           <button onClick={() => { setSelectedVariant(null); setIsModalOpen(true); }} className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-lg text-sm z-10" style={{ backgroundColor: primaryColor?.value, boxShadow: `0 4px 14px 0 ${primaryColor?.value}40` }}>
//             <Plus size={18} /> Add Variant
//           </button>
//         </div>
//       </div>

//       {/* STAT CARDS */}
//       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
//         <div className={`p-5 rounded-3xl border shadow-sm ${cardBg} flex items-center gap-4`} style={{ borderColor: isDark ? '#374151' : '#F3F4F6' }}>
//           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Layers size={20} /></div>
//           <div><p className={`text-[11px] font-bold uppercase tracking-widest ${textMuted}`}>Total Variants</p><p className={`text-2xl font-black ${textMain}`}>{variants.length}</p></div>
//         </div>
//         <div className={`p-5 rounded-3xl border shadow-sm ${cardBg} flex items-center gap-4`} style={{ borderColor: isDark ? '#374151' : '#F3F4F6' }}>
//           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}><CheckCircle size={20} /></div>
//           <div><p className={`text-[11px] font-bold uppercase tracking-widest ${textMuted}`}>Active</p><p className={`text-2xl font-black ${textMain}`}>{activeVariants}</p></div>
//         </div>
//       </div>

//       {/* TABLE DATA */}
//       <div className={`border rounded-3xl shadow-sm overflow-hidden ${cardBg} ${borderColor}`}>
//         <div className="overflow-x-auto custom-scrollbar">
//           <table className="w-full text-left border-collapse min-w-[700px]">
//             <thead>
//               <tr className={`border-b ${borderColor} ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/80'}`}>
//                 <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Variant Name</th>
//                 <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Code / SKU</th>
//                 <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-right`}>Pricing</th>
//                 <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-center`}>Status</th>
//                 <th className={`py-4 px-6 text-[10px] font-bold uppercase tracking-widest ${textMuted} text-right`}>Actions</th>
//               </tr>
//             </thead>
//             <tbody className={`divide-y ${borderColor}`}>
//               {loading ? (
//                 [1,2].map(i => (
//                   <tr key={i} className="animate-pulse">
//                     <td colSpan={5} className="py-6 px-6"><div className={`h-12 w-full rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}></div></td>
//                   </tr>
//                 ))
//               ) : variants.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="py-24 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}><Layers size={32} className={textMuted} /></div>
//                       <h3 className={`text-lg font-bold ${textMain} mb-2`}>No Variants Found</h3>
//                       <p className={`text-sm ${textMuted} mb-6 max-w-sm`}>This item currently acts as a single standard product.</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 variants.sort((a,b) => a.ivm_sort_order - b.ivm_sort_order).map((variant) => (
//                   <motion.tr layout key={variant.ivm_id} className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'}`}>
                    
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <p className={`font-black text-sm ${textMain}`}>{variant.ivm_variant_name}</p>
//                         {variant.ivm_is_default && <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm"><Star size={10} className="fill-current" /> Default</span>}
//                       </div>
//                     </td>

//                     <td className="py-4 px-6">
//                       <p className={`text-xs font-bold uppercase ${textMuted}`}>{variant.ivm_variant_code || 'N/A'}</p>
//                       <p className={`text-[10px] font-medium ${textMuted} mt-0.5`}>{variant.ivm_sku}</p>
//                     </td>

//                     <td className="py-4 px-6 text-right">
//                       {variant.ivm_compare_price > 0 ? (
//                         <div className="flex flex-col items-end">
//                           <span className={`text-sm font-black ${textMain}`}>₹{Number(variant.ivm_price).toFixed(2)}</span>
//                           <span className={`text-[10px] font-bold line-through ${textMuted}`}>₹{Number(variant.ivm_compare_price).toFixed(2)}</span>
//                         </div>
//                       ) : (
//                         <span className={`text-sm font-black ${textMain}`}>₹{Number(variant.ivm_price).toFixed(2)}</span>
//                       )}
//                     </td>

//                     <td className="py-4 px-6 text-center">
//                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${variant.ivm_is_available ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600') : (isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500')}`}>
//                         <span className={`w-1.5 h-1.5 rounded-full ${variant.ivm_is_available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
//                         {variant.ivm_is_available ? 'Active' : 'Muted'}
//                       </span>
//                     </td>

//                     <td className="py-4 px-6 text-right">
//                       <div className="flex items-center justify-end gap-1">
//                         <button onClick={() => { setSelectedVariant(variant); setIsModalOpen(true); }} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`}><Edit size={16} /></button>
//                         <button onClick={() => handleDelete(variant.ivm_id)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-red-900/30 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-600'}`}><Trash2 size={16} /></button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <VariantFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit} initialData={selectedVariant} itemId={parsedItemId} primaryColor={primaryColor} isDark={isDark} />
//     </div>
//   );
// };

// export default ItemVariantsPage;