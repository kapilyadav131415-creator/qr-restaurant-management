import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Store, CreditCard, Mail, Phone, MapPin, Building, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../../config/axios';
import toast, { Toaster } from 'react-hot-toast';

interface ProfileData {
  personal_info: {
    user_id: number;
    name: string;
    email: string;
    phone: string | null;
    status: number;
    role: string;
  };
  restaurant_info: {
    name: string;
    legal_name: string;
    owner_name: string;
    owner_email: string;
    owner_phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    currency: string;
  } | null;
  subscription_info: {
    plan_name: string;
    end_date: string;
    status: string;
  } | null;
}

const ProfilePage = () => {
  const { theme, isDark, primaryColor } = useOutletContext<any>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        if (response.data.status === 'success') {
          setProfile(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load profile details");
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const cardClasses = `rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`;
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: primaryColor.value }}></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <Toaster position="top-right" />
        <h2 className={`text-2xl font-bold ${textMain}`}>Profile not found</h2>
        <p className={textSub}>We couldn't load your profile details at this time.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Toaster position="top-right" />
      
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
      >
        <div className="h-32 w-full" style={{ background: `linear-gradient(to right, ${primaryColor.value}, ${primaryColor.value}99)` }}></div>
        <div className="px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
            <div 
              className="h-32 w-32 rounded-full border-4 flex items-center justify-center shadow-lg bg-white relative overflow-hidden"
              style={{ borderColor: isDark ? '#1F2937' : '#FFFFFF' }}
            >
              <User size={64} style={{ color: primaryColor.value }} />
            </div>
            <div className="flex-1 text-center sm:text-left mb-2">
              <h1 className={`text-3xl font-black ${textMain}`}>{profile.personal_info.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  <ShieldCheck size={14} />
                  {profile.personal_info.role}
                </span>
                {profile.personal_info.status === 1 ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <CheckCircle2 size={14} /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">
                    <XCircle size={14} /> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONAL INFO CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cardClasses}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor.value}15`, color: primaryColor.value }}>
              <User size={20} />
            </div>
            <h2 className={`text-xl font-bold ${textMain}`}>Personal Information</h2>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <Mail size={18} className={`mt-0.5 ${textSub}`} />
              <div>
                <p className={`text-sm font-medium ${textSub}`}>Email Address</p>
                <p className={`font-semibold ${textMain}`}>{profile.personal_info.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone size={18} className={`mt-0.5 ${textSub}`} />
              <div>
                <p className={`text-sm font-medium ${textSub}`}>Phone Number</p>
                <p className={`font-semibold ${textMain}`}>{profile.personal_info.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SUBSCRIPTION INFO CARD */}
        {profile.subscription_info && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cardClasses}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor.value}15`, color: primaryColor.value }}>
                <CreditCard size={20} />
              </div>
              <h2 className={`text-xl font-bold ${textMain}`}>Subscription Details</h2>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${textSub}`}>Current Plan</p>
                  <p className={`text-lg font-black`} style={{ color: primaryColor.value }}>{profile.subscription_info.plan_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  profile.subscription_info.status === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                }`}>
                  {profile.subscription_info.status}
                </span>
              </div>
              
              <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <p className={`text-sm font-medium ${textSub}`}>Valid Until</p>
                <p className={`font-semibold ${textMain}`}>
                  {profile.subscription_info.end_date 
                    ? new Date(profile.subscription_info.end_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) 
                    : 'Lifetime'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* RESTAURANT INFO CARD */}
        {profile.restaurant_info && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`md:col-span-2 ${cardClasses}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor.value}15`, color: primaryColor.value }}>
                <Store size={20} />
              </div>
              <h2 className={`text-xl font-bold ${textMain}`}>Restaurant Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Store size={18} className={`mt-0.5 ${textSub}`} />
                <div>
                  <p className={`text-sm font-medium ${textSub}`}>Restaurant Name</p>
                  <p className={`font-semibold ${textMain}`}>{profile.restaurant_info.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Building size={18} className={`mt-0.5 ${textSub}`} />
                <div>
                  <p className={`text-sm font-medium ${textSub}`}>Legal Entity</p>
                  <p className={`font-semibold ${textMain}`}>{profile.restaurant_info.legal_name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin size={18} className={`mt-0.5 ${textSub}`} />
                <div>
                  <p className={`text-sm font-medium ${textSub}`}>Location</p>
                  <p className={`font-semibold ${textMain}`}>
                    {[profile.restaurant_info.address, profile.restaurant_info.city, profile.restaurant_info.state, profile.restaurant_info.country]
                      .filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User size={18} className={`mt-0.5 ${textSub}`} />
                <div>
                  <p className={`text-sm font-medium ${textSub}`}>Owner Name</p>
                  <p className={`font-semibold ${textMain}`}>{profile.restaurant_info.owner_name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail size={18} className={`mt-0.5 ${textSub}`} />
                <div>
                  <p className={`text-sm font-medium ${textSub}`}>Owner Email</p>
                  <p className={`font-semibold ${textMain}`}>{profile.restaurant_info.owner_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className={`mt-0.5 ${textSub}`} />
                <div>
                  <p className={`text-sm font-medium ${textSub}`}>Owner Phone</p>
                  <p className={`font-semibold ${textMain}`}>{profile.restaurant_info.owner_phone}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
