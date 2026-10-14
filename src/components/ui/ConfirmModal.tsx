import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean; // If true, the confirm button is red
  isDark?: boolean;
  primaryColor?: { value: string };
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  isDark = false,
  primaryColor,
}) => {
  const bgMain = isDark ? 'bg-gray-800' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderCol = isDark ? 'border-gray-700' : 'border-gray-200';
  
  const confirmBtnClass = isDanger 
    ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500' 
    : 'text-white'; // Will use primaryColor via inline style if not danger

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`pointer-events-auto w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl ${bgMain} ${borderCol}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-transparent">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isDanger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className={`text-xl font-bold ${textMain}`}>{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-4">
                <p className={`text-sm ${textMuted}`}>{message}</p>
              </div>

              {/* Footer */}
              <div className={`px-6 py-5 flex items-center justify-end gap-3 border-t ${borderCol} ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <button
                  onClick={onClose}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmBtnClass}`}
                  style={!isDanger && primaryColor ? { 
                    backgroundColor: primaryColor.value, 
                    boxShadow: `0 4px 14px 0 ${primaryColor.value}40` 
                  } : {}}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;