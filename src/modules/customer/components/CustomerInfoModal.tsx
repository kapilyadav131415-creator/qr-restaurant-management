// src/components/CustomerInfoModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, ArrowRight } from 'lucide-react';

interface CustomerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, mobile: string) => void;
}

export default function CustomerInfoModal({ isOpen, onClose, onSave }: CustomerInfoModalProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; mobile?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(name.trim(), mobile.trim());
      setName('');
      setMobile('');
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-white">Welcome!</h2>
              <button 
                onClick={onClose}
                className="p-1.5 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-white/80 text-sm mt-1">Please enter your details to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setMobile(value);
                      if (errors.mobile) setErrors({ ...errors, mobile: undefined });
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.mobile 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black text-sm shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all active:scale-95"
            >
              Continue to Menu <ArrowRight size={18} />
            </button>

            <p className="text-center text-xs text-gray-400 mt-2">
              Your details will be used for order processing
            </p>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}