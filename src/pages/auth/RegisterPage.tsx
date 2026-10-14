import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../config/axios";
import toast, { Toaster } from "react-hot-toast";
import logo from "../../assets/logo/logo.png"; 

const RegisterPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match!", {
        style: {
          borderRadius: '8px', background: '#18181B', color: '#fff',
          padding: '12px 16px', fontSize: '14px', fontWeight: 500,
        },
        iconTheme: { primary: '#EF4444', secondary: '#18181B' }
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.", {
        style: {
          borderRadius: '8px', background: '#18181B', color: '#fff',
          padding: '12px 16px', fontSize: '14px', fontWeight: 500,
        },
        iconTheme: { primary: '#EF4444', secondary: '#18181B' }
      });
      return;
    }

    try {
      setLoading(true);
      const { confirm_password, ...apiData } = formData; 
      
      const response = await api.post("/auth/register", apiData);

      toast.success("Account created successfully!", {
        style: {
          borderRadius: '8px', background: '#18181B', color: '#fff',
          padding: '12px 16px', fontSize: '14px', fontWeight: 500,
        },
        iconTheme: { primary: '#10B981', secondary: '#18181B' }
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed. Please try again.", {
        style: {
          borderRadius: '8px', background: '#18181B', color: '#fff',
          padding: '12px 16px', fontSize: '14px', fontWeight: 500,
        },
        iconTheme: { primary: '#EF4444', secondary: '#18181B' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-red-100 selection:text-red-900 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Subtle Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sm:mx-auto sm:w-full sm:max-w-[480px] relative z-10"
      >
        <div className="bg-white py-12 px-6 sm:px-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] border border-gray-100">
          
          {/* Header Section Inside Card */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex justify-center mb-6">
              <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-3 transform transition hover:scale-105 hover:shadow-md">
                <img src={logo} alt="QR Dine" className="h-full w-full object-contain" />
              </div>
            </Link>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
              Create an account
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Get started with QR Dine to manage your restaurant.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="full_name" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Business Name
              </label>
              <div className="mt-1">
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="My Business"
                  className="appearance-none block w-full px-4 py-3.5 border border-gray-200 bg-gray-50/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 focus:bg-white sm:text-sm transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="appearance-none block w-full px-4 py-3.5 border border-gray-200 bg-gray-50/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 focus:bg-white sm:text-sm transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="appearance-none block w-full px-4 py-3.5 border border-gray-200 bg-gray-50/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 focus:bg-white sm:text-sm transition-all font-medium pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Confirm
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`appearance-none block w-full px-4 py-3.5 border bg-gray-50/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white sm:text-sm transition-all font-medium pr-10 ${
                      formData.confirm_password && formData.password !== formData.confirm_password 
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-red-100 focus:border-red-500'
                    }`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 hover:shadow-md transform hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-gray-900 hover:text-red-600 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-center w-full z-0">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Powered by QR Dine
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;