import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, ChevronDown, Plus, Package } from 'lucide-react';
import type { AddonGroupEntity, AddonItemEntity } from '../types';

interface Props {
  group: AddonGroupEntity;
  items: AddonItemEntity[];
  onEditGroup: (group: AddonGroupEntity) => void;
  onDeleteGroup: (id: number) => void;
  onAddItem: (groupId: number) => void;
  onEditItem: (item: AddonItemEntity) => void;
  onDeleteItem: (id: number) => void;
  isDark: boolean;
  primaryColor: { value: string };
}

export const AddonGroupCard: React.FC<Props> = ({
  group, items, onEditGroup, onDeleteGroup,
  onAddItem, onEditItem, onDeleteItem, isDark, primaryColor
}) => {
  const [expanded, setExpanded] = useState(true);
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <motion.div layout className={`rounded-[24px] border overflow-hidden shadow-sm transition-all ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* GROUP HEADER */}
      <div className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`} onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            <Package size={20} />
          </div>
          <div>
            <h3 className={`font-black text-lg ${textMain}`}>{group.ag_name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${group.ag_selection_type === 'single' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                {group.ag_selection_type} Selection
              </span>
              {group.ag_is_required && (
                <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                  Required
                </span>
              )}
              <span className={`text-[10px] font-medium ${textMuted}`}>• {items.length} Addons</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onEditGroup(group); }} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500'}`}>
            <Edit size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDeleteGroup(group.ag_id); }} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'}`}>
            <Trash2 size={16} />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} className={textMuted}>
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </div>

      {/* ITEMS LIST */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`border-t ${isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-100 bg-gray-50/50'}`}>
            <div className="p-5">
              {items.length === 0 ? (
                <div className={`p-6 border border-dashed rounded-xl flex flex-col items-center justify-center text-center ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-white'}`}>
                  <p className={`text-sm font-bold ${textMain}`}>No Addons inside "{group.ag_name}"</p>
                  <button onClick={() => onAddItem(group.ag_id)} className="mt-3 text-xs font-bold px-4 py-2 rounded-lg text-white shadow-md transition-transform hover:scale-105" style={{ backgroundColor: primaryColor.value }}>
                    + Add Item
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.ai_id} className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-inner`} style={{ backgroundColor: primaryColor.value }}>
                          {item.ai_name.charAt(0)}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${textMain}`}>{item.ai_name}</p>
                          <p className={`text-[10px] font-black mt-0.5 ${textMuted}`}>₹{item.ai_price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${item.ai_is_available ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700') : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')}`}>
                          {item.ai_is_available ? 'Active' : 'Off'}
                        </span>
                        <div className="flex gap-1 border-l pl-3 ml-1 dark:border-gray-700">
                          <button onClick={() => onEditItem(item)} className={`p-1.5 rounded-md transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                            <Edit size={14} />
                          </button>
                          <button onClick={() => onDeleteItem(item.ai_id)} className={`p-1.5 rounded-md transition-colors ${isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'}`}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => onAddItem(group.ag_id)} className={`w-full py-3 rounded-xl border border-dashed text-xs font-bold transition-colors flex items-center justify-center gap-2 ${isDark ? 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white' : 'border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <Plus size={14} /> Add Another Item
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};