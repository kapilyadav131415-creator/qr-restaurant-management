import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { getSubscriptionPlans, submitRestaurantSetup, createPaymentOrder } from '../api';
import type { SubscriptionPlan, RestaurantSetupFormData } from '../types';
import logo from '../../../assets/logo/logo.png';
import { Check, Building2, Store, ArrowRight, ArrowLeft, Rocket, MapPin, Building, CreditCard, ChevronRight } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Restaurant Info', icon: <Store size={20} /> },
  { id: 2, title: 'Location', icon: <MapPin size={20} /> },
  { id: 3, title: 'Business details', icon: <Building size={20} /> },
  { id: 4, title: 'Subscription', icon: <CreditCard size={20} /> },
  { id: 5, title: 'Branch Setup', icon: <Building2 size={20} /> },
  { id: 6, title: 'Launch', icon: <Rocket size={20} /> }
];

const SetupWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State strictly matching API Body requirements
  const [formData, setFormData] = useState<RestaurantSetupFormData>({
    p_rm_name: "",
    p_rm_legal_name: "",
    p_rm_owner_name: "",
    p_rm_owner_phone: "",
    p_rm_owner_email: "",
    p_rm_contact_phone: "",
    p_rm_contact_email: "",
    p_rm_address_line1: "",
    p_rm_address_line2: "", 
    p_rm_city: "",
    p_rm_state: "",
    p_rm_country: "India",
    p_rm_postal_code: "", 
    p_rm_gst_number: "",
    p_rm_fssai_license: "",
    p_rm_website: "", 
    p_rm_timezone: "Asia/Kolkata", 
    p_rm_currency: "INR", 
    p_plan_id: 0,
    p_branch_name: ""
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getSubscriptionPlans();
        setPlans(data);
      } catch (err) {
        toast.error("Failed to load subscription plans.");
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation Logic
  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.p_rm_name.trim()) return "Restaurant Name is required";
        if (!formData.p_rm_legal_name.trim()) return "Legal Name is required";
        if (!formData.p_rm_owner_name.trim()) return "Owner Name is required";
        if (!formData.p_rm_owner_phone.trim()) return "Owner Phone is required";
        if (!formData.p_rm_owner_email.trim()) return "Owner Email is required";
        return null;
      case 2:
        if (!formData.p_rm_address_line1.trim()) return "Address Line 1 is required";
        if (!formData.p_rm_city.trim()) return "City is required";
        if (!formData.p_rm_state.trim()) return "State is required";
        if (!formData.p_rm_country.trim()) return "Country is required";
        return null;
      case 3:
        // No strictly required fields here in the backend based on previous setup, 
        // but let's ensure currency is present just in case
        if (!formData.p_rm_currency) return "Currency is required";
        return null;
      case 4:
        if (formData.p_plan_id === 0) return "Please select a subscription plan";
        return null;
      case 5:
        if (!formData.p_branch_name.trim()) return "Main Branch Name is required";
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      toast.error(error);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handlePaymentAndSubmit = async () => {
    if (formData.p_plan_id === 0) {
      toast.error("Please select a plan first");
      return;
    }

    try {
      setLoading(true);
      const orderResponse = await createPaymentOrder(formData.p_plan_id);
      
      if (orderResponse.status === 'success' && orderResponse.data) {
        const options = {
          key: "rzp_test_TMPCFqtq9fIbbj", // The test key
          amount: orderResponse.data.amount,
          currency: orderResponse.data.currency,
          name: "Byte Menu",
          description: "Subscription Plan Payment",
          order_id: orderResponse.data.id,
          handler: async function (response: any) {
            // Callback when payment succeeds
            const finalData = {
              ...formData,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            };
            await handleSubmit(finalData);
          },
          prefill: {
            name: formData.p_rm_owner_name,
            email: formData.p_rm_owner_email,
            contact: formData.p_rm_owner_phone
          },
          theme: {
            color: "#DC2626"
          }
        };

        // @ts-ignore
        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response: any) {
          toast.error("Payment failed. Please try again.");
          setLoading(false);
        });
        rzp1.open();
      } else {
        toast.error("Failed to initiate payment");
        setLoading(false);
      }
    } catch (err: any) {
      toast.error("Payment initialization failed");
      setLoading(false);
    }
  };

  const handleSubmit = async (finalData: RestaurantSetupFormData) => {
    try {
      setLoading(true);
      const res = await submitRestaurantSetup(finalData);
      
      // The backend now returns a fresh token with the new restaurant_id
      if (res && res.token) {
        localStorage.setItem('token', res.token);
      }

      toast.success("Restaurant Setup Complete! Welcome aboard.");
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-gray-900 font-medium transition-all shadow-sm";
  const labelClass = "block text-xs font-bold text-gray-700 mb-1.5";

  // --- UI RENDERING FOR EACH STEP ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className={labelClass}>Restaurant Name <span className="text-red-500">*</span></label><input type="text" name="p_rm_name" placeholder="e.g. The Grand Kitchen" value={formData.p_rm_name} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Legal Name (Company) <span className="text-red-500">*</span></label><input type="text" name="p_rm_legal_name" placeholder="e.g. Grand Kitchen Pvt Ltd" value={formData.p_rm_legal_name} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Owner Name <span className="text-red-500">*</span></label><input type="text" name="p_rm_owner_name" placeholder="Full Name" value={formData.p_rm_owner_name} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Owner Phone <span className="text-red-500">*</span></label><input type="text" name="p_rm_owner_phone" placeholder="+91 9876543210" value={formData.p_rm_owner_phone} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Owner Email <span className="text-red-500">*</span></label><input type="email" name="p_rm_owner_email" placeholder="owner@example.com" value={formData.p_rm_owner_email} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Support Phone</label><input type="text" name="p_rm_contact_phone" placeholder="Customer Support No." value={formData.p_rm_contact_phone} onChange={handleChange} className={inputClass} /></div>
              <div className="md:col-span-2"><label className={labelClass}>Support Email</label><input type="email" name="p_rm_contact_email" placeholder="support@restaurant.com" value={formData.p_rm_contact_email} onChange={handleChange} className={inputClass} /></div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div><label className={labelClass}>Address Line 1 <span className="text-red-500">*</span></label><input type="text" name="p_rm_address_line1" placeholder="Street Address, Area" value={formData.p_rm_address_line1} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>Address Line 2</label><input type="text" name="p_rm_address_line2" placeholder="Building, Landmark" value={formData.p_rm_address_line2} onChange={handleChange} className={inputClass} /></div>
            <div className="grid grid-cols-2 gap-5">
              <div><label className={labelClass}>City <span className="text-red-500">*</span></label><input type="text" name="p_rm_city" placeholder="City" value={formData.p_rm_city} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>State <span className="text-red-500">*</span></label><input type="text" name="p_rm_state" placeholder="State" value={formData.p_rm_state} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Postal Code</label><input type="text" name="p_rm_postal_code" placeholder="Zip / PIN" value={formData.p_rm_postal_code} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass}>Country <span className="text-red-500">*</span></label><input type="text" name="p_rm_country" value={formData.p_rm_country} onChange={handleChange} className={inputClass} /></div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className={labelClass}>GST Number</label><input type="text" name="p_rm_gst_number" placeholder="Optional" value={formData.p_rm_gst_number} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass}>FSSAI License</label><input type="text" name="p_rm_fssai_license" placeholder="Optional" value={formData.p_rm_fssai_license} onChange={handleChange} className={inputClass} /></div>
            <div className="md:col-span-2"><label className={labelClass}>Website URL</label><input type="url" name="p_rm_website" placeholder="https://www.yourrestaurant.com" value={formData.p_rm_website} onChange={handleChange} className={inputClass} /></div>
            <div>
              <label className={labelClass}>Currency <span className="text-red-500">*</span></label>
              <select name="p_rm_currency" value={formData.p_rm_currency} onChange={handleChange} className={inputClass}>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
            <div><label className={labelClass}>Timezone</label><input type="text" name="p_rm_timezone" value={formData.p_rm_timezone} onChange={handleChange} className={inputClass} /></div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 gap-5 h-full max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar pb-6">
            {plans.map((plan) => (
              <div 
                key={plan.spm_id} 
                onClick={() => setFormData({...formData, p_plan_id: Number(plan.spm_id)})}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 ${formData.p_plan_id === Number(plan.spm_id) ? 'border-red-600 bg-red-50/50 shadow-md ring-4 ring-red-500/10' : 'border-gray-200 hover:border-red-300 bg-white'}`}
              >
                {formData.p_plan_id === Number(plan.spm_id) && (
                  <div className="absolute top-4 right-4 text-red-600">
                    <Check size={24} strokeWidth={3} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{plan.spm_name}</h3>
                    {plan.spm_is_trial && <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">TRIAL</span>}
                  </div>
                  <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                    <span><strong className="text-gray-900">{plan.spm_max_tables}</strong> Tables</span>
                    <span>&bull;</span>
                    <span><strong className="text-gray-900">{plan.spm_max_users}</strong> Users</span>
                    <span>&bull;</span>
                    <span><strong className="text-gray-900">{plan.spm_max_branches}</strong> Branches</span>
                  </div>
                </div>
                
                <div className="text-left md:text-right">
                  <p className="text-3xl font-black text-gray-900">
                    ₹{plan.spm_price}
                  </p>
                  <p className="text-sm text-gray-500 font-medium mt-1">/ {plan.spm_duration_days} days</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 py-8">
             <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-red-600 shrink-0">
                  <Store size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Your first branch</h3>
                  <p className="text-gray-500 text-sm mb-5">Set up your main restaurant location. You can add more branches later from the dashboard.</p>
                  
                  <label className={labelClass}>Branch Name <span className="text-red-500">*</span></label>
                  <input 
                      type="text" 
                      name="p_branch_name" 
                      placeholder="e.g. Connaught Place Branch" 
                      value={formData.p_branch_name} 
                      onChange={handleChange} 
                      className={inputClass} 
                    />
                </div>
             </div>
          </div>
        );
      case 6:
        return (
          <div className="text-center py-12 space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 text-green-500 mb-2 ring-8 ring-green-50/50">
              <Check size={40} strokeWidth={4} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">Ready to launch!</h2>
              <p className="text-gray-500 mt-3 max-w-sm mx-auto text-base">
                Your setup is complete. We're ready to create your workspace.
              </p>
            </div>
            
            <button 
              onClick={handlePaymentAndSubmit} 
              disabled={loading} 
              className="mt-8 px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl shadow-[0_8px_20px_rgba(220,38,38,0.25)] transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 w-full sm:w-auto mx-auto"
            >
              {loading ? "Processing..." : <>Pay & Enter Dashboard <ArrowRight size={20} /></>}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Sidebar (Dark Theme) */}
        <div className="md:w-1/3 bg-[#0B0F19] p-8 md:p-10 flex flex-col text-white">
          <div className="mb-12">
            <img src={logo} alt="Logo" className="h-10 mb-6 drop-shadow-md brightness-0 invert" />
            <h1 className="text-2xl font-black tracking-tight mb-2">Getting Started</h1>
            <p className="text-gray-400 text-sm leading-relaxed">Complete these simple steps to set up your restaurant and start taking orders.</p>
          </div>
          
          <div className="flex md:flex-col gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 hide-scrollbar flex-1">
            {STEPS.map((step, index) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex items-start gap-4 group relative">
                  {/* Vertical Line for Desktop */}
                  {index < STEPS.length - 1 && (
                    <div className={`hidden md:block absolute left-5 top-12 bottom-[-24px] w-[2px] transition-colors duration-500 ${isPast ? 'bg-red-500' : 'bg-gray-800'}`} />
                  )}
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 z-10
                    ${isActive ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 
                      isPast ? 'bg-red-500 text-white' : 
                      'bg-gray-800 text-gray-500'}`}
                  >
                    {isPast ? <Check size={18} strokeWidth={3} /> : step.icon}
                  </div>
                  <div className="hidden md:block pt-2">
                    <p className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : isPast ? 'text-gray-300' : 'text-gray-500'}`}>{step.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:w-2/3 flex flex-col bg-white">
          <div className="flex-1 p-8 md:p-12 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep} 
                initial={{ x: 10, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                exit={{ x: -10, opacity: 0 }} 
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-gray-900">{STEPS[currentStep - 1].title}</h2>
                  {currentStep < 6 && <p className="text-gray-500 text-sm mt-1">Please fill in the required details below.</p>}
                </div>
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          {currentStep < 6 && (
            <div className="p-6 md:px-12 md:py-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <button 
                type="button"
                onClick={handlePrev} 
                disabled={currentStep === 1} 
                className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-0 flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button 
                type="button"
                onClick={handleNext} 
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-black hover:shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SetupWizard;