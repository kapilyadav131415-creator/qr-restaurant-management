import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, KeyRound, UserCheck, Calendar, Phone, Mail, Loader2 } from 'lucide-react';
import { StaffSchema, UpdateStaffSchema, ResetPasswordSchema, type ResetPasswordDTO } from '../types';
import { useRoles } from '../hooks/useRoles';

const drawerVariants = {
  hidden: {
    x: "100%",
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

// ==========================================
// ADD / EDIT STAFF DRAWER
// ==========================================
export const StaffFormDrawer = ({ isOpen, onClose, initialData, onSubmit, isDark, primaryColor }: any) => {
  const isEdit = !!initialData;
  const schema = isEdit ? UpdateStaffSchema : StaffSchema;
  const { data: roles = [], isLoading: loadingRoles } = useRoles();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: { role_id: 0 }
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({ staff_id: initialData.um_id, full_name: initialData.um_full_name, phone: initialData.um_phone, role_id: initialData.um_role_id });
      } else {
        reset({ full_name: '', username: '', email: '', phone: '', password: '', role_id: 0 });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onFormSubmit: SubmitHandler<any> = async (data) => {
    await onSubmit(data);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none text-sm focus:ring-2 transition-all ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm">
        <motion.div variants={drawerVariants} initial="hidden" animate="visible" exit="exit" className={`w-full max-w-md h-full flex flex-col shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{isEdit ? 'Edit Staff Member' : 'Add New Staff'}</h2>
            <button onClick={onClose} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X size={20} /></button>
          </div>
          
          <form onSubmit={handleSubmit(onFormSubmit)} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              
              {/* FIX: Hidden input for staff_id so Zod validation passes on Edit */}
              {isEdit && <input type="hidden" {...register('staff_id', { valueAsNumber: true })} />}

              <div>
                <label className={`text-xs font-bold uppercase mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Full Name *</label>
                <input {...register('full_name')} className={inputClass} placeholder="e.g., John Doe" />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message as string}</p>}
              </div>

              {!isEdit && (
                <>
                  <div>
                    <label className={`text-xs font-bold uppercase mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Username *</label>
                    <input {...register('username')} className={inputClass} placeholder="johndoe" />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message as string}</p>}
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email Address *</label>
                    <input type="email" {...register('email')} className={inputClass} placeholder="john@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Password *</label>
                    <input type="password" {...register('password')} className={inputClass} placeholder="••••••••" />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
                  </div>
                </>
              )}

              <div>
                <label className={`text-xs font-bold uppercase mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Phone Number *</label>
                <input {...register('phone')} className={inputClass} placeholder="10-digit number" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
              </div>

              <div>
                <label className={`text-xs font-bold uppercase mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Assign Role *</label>
                <select {...register('role_id', { valueAsNumber: true })} className={inputClass} disabled={loadingRoles}>
                  <option value={0} disabled>{loadingRoles ? 'Loading roles...' : 'Select a role'}</option>
                  {roles.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                {errors.role_id && <p className="text-red-500 text-xs mt-1">{errors.role_id.message as string}</p>}
              </div>
            </div>

            <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'} flex gap-3`}>
              <button type="button" onClick={onClose} className={`flex-1 py-3 rounded-xl font-bold text-sm ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 py-3 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform" style={{ backgroundColor: primaryColor?.value }}>
                {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} {isEdit ? 'Update Staff' : 'Save Staff'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ==========================================
// RESET PASSWORD MODAL
// ==========================================
export const ResetPasswordModal = ({ isOpen, onClose, staffId, onSubmit, isDark, primaryColor }: any) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ResetPasswordDTO>({ 
    resolver: zodResolver(ResetPasswordSchema) 
  });
  
  useEffect(() => { 
    if(isOpen) reset({ staff_id: staffId, password: '', confirmPassword: '' }); 
  }, [isOpen, staffId, reset]);
  
  if (!isOpen) return null;

  const onFormSubmit: SubmitHandler<ResetPasswordDTO> = async (data) => {
    await onSubmit(data);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none text-sm focus:ring-2 ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-6 text-center">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${isDark ? 'bg-gray-900' : 'bg-blue-50 text-blue-600'}`}><KeyRound size={32} /></div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Reset Password</h2>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Enter a new password for this staff member.</p>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col">
            {/* FIX: Hidden staff_id input */}
            <input type="hidden" {...register('staff_id', { valueAsNumber: true })} />

            <div className="p-6 pt-0 space-y-4">
              <div>
                <input type="password" {...register('password')} placeholder="New Password" className={inputClass} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <input type="password" {...register('confirmPassword')} placeholder="Confirm Password" className={inputClass} />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            
            <div className={`p-4 border-t flex gap-3 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              <button type="button" onClick={onClose} className={`flex-1 py-3 rounded-xl font-bold text-sm ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 py-3 text-white rounded-xl font-bold text-sm flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform shadow-lg" style={{ backgroundColor: primaryColor?.value }}>
                 {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : null} Confirm Reset
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ==========================================
// STAFF DETAILS DRAWER
// ==========================================
export const StaffDetailsDrawer = ({ isOpen, onClose, staff, isDark, primaryColor }: any) => {
  const { data: roles = [] } = useRoles();
  
  if (!isOpen || !staff) return null;
  const roleName = roles.find((r: any) => r.id === staff.um_role_id)?.name || 'Unknown Role';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm">
        <motion.div variants={drawerVariants} initial="hidden" animate="visible" exit="exit" className={`w-full max-w-md h-full flex flex-col shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-8 pb-6 flex justify-between items-start">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg`} style={{ backgroundColor: primaryColor?.value }}>
              {staff.um_full_name.charAt(0)}
            </div>
            <button onClick={onClose} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><X size={20} /></button>
          </div>
          <div className="px-8 pb-6 border-b dark:border-gray-700">
            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{staff.um_full_name}</h2>
            <p className="text-sm text-gray-500 font-medium">@{staff.um_username}</p>
            <div className="mt-4 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{roleName}</span>
              {staff.um_is_locked ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Locked</span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Active</span>
              )}
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4"><Mail className="text-gray-400"/><div className="text-sm"><p className="text-gray-500 text-xs font-bold uppercase">Email</p><p className={isDark ? 'text-white' : 'text-gray-900'}>{staff.um_email}</p></div></div>
            <div className="flex items-center gap-4"><Phone className="text-gray-400"/><div className="text-sm"><p className="text-gray-500 text-xs font-bold uppercase">Phone</p><p className={isDark ? 'text-white' : 'text-gray-900'}>{staff.um_phone}</p></div></div>
            <div className="flex items-center gap-4"><Calendar className="text-gray-400"/><div className="text-sm"><p className="text-gray-500 text-xs font-bold uppercase">Joined Date</p><p className={isDark ? 'text-white' : 'text-gray-900'}>{new Date(staff.um_created_at).toLocaleDateString()}</p></div></div>
            {staff.um_last_login && <div className="flex items-center gap-4"><UserCheck className="text-gray-400"/><div className="text-sm"><p className="text-gray-500 text-xs font-bold uppercase">Last Login</p><p className={isDark ? 'text-white' : 'text-gray-900'}>{new Date(staff.um_last_login).toLocaleString()}</p></div></div>}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};