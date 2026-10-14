import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 selection:bg-red-100">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-2xl border border-gray-100 dark:border-gray-700 text-center">
        
        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Access Denied</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8 leading-relaxed">
          You do not have the required permissions to view this module. Please contact your system administrator if you believe this is a mistake.
        </p>

        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full py-3.5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <ArrowLeft size={18} /> Return to Dashboard
        </button>

      </div>
    </div>
  );
}