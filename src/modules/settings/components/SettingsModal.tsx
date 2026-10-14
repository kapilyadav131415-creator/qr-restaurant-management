import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Theme state passed from Layout
  theme: string;
  setTheme: (val: string) => void;
  dir: string;
  setDir: (val: string) => void;
  primaryColor: any;
  setPrimaryColor: (color: any) => void;
  THEME_COLORS: any[];
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, theme, setTheme, dir, setDir, primaryColor, setPrimaryColor, THEME_COLORS
}) => {
  const [activeTab, setActiveTab] = useState('theme');
  const isDark = theme === 'dark';

  // --- THEME CLASSES ---
  const modalBg = isDark ? 'bg-gray-800' : 'bg-white';
  const sidebarBg = isDark ? 'bg-gray-900/80' : 'bg-gray-50';
  const textMain = isDark ? 'text-white' : 'text-[#111827]';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          
          {/* Background Overlay (Fades In) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
          />

          {/* Sliding Side Drawer */}
          <motion.div 
            initial={{ x: dir === 'ltr' ? '100%' : '-100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir === 'ltr' ? '100%' : '-100%', opacity: 0.5 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`absolute top-0 ${dir === 'ltr' ? 'right-0 rounded-l-[32px] border-l' : 'left-0 rounded-r-[32px] border-r'} h-full w-full max-w-4xl flex flex-col sm:flex-row ${modalBg} ${borderColor} shadow-2xl overflow-hidden`}
          >
            
            {/* LEFT SIDEBAR (Tabs) */}
            <div className={`w-full sm:w-64 ${sidebarBg} border-r ${borderColor} flex flex-col`}>
              <div className="p-8 pb-4">
                <h2 className={`text-2xl font-black tracking-tight ${textMain}`}>Settings</h2>
                <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${textMuted}`}>Portal Preferences</p>
              </div>
              
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {[
                  { id: 'theme', label: 'Theme & UI', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
                  { id: 'restaurant', label: 'Restaurant Profile', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                  { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                      activeTab === tab.id 
                        ? `${isDark ? 'bg-gray-800 shadow-md border border-gray-700' : 'bg-white shadow-sm border border-gray-100'} ${textMain}` 
                        : `${textMuted} hover:${isDark ? 'bg-gray-800/50' : 'bg-white/60'}`
                    }`}
                    style={activeTab === tab.id ? { color: primaryColor.value } : {}}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path></svg>
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Bottom Version Info */}
              <div className="p-6">
                <p className={`text-[10px] font-bold tracking-widest uppercase ${textMuted}`}>ByteMenu v2.1.0</p>
              </div>
            </div>

            {/* RIGHT CONTENT AREA */}
            <div className="flex-1 flex flex-col relative overflow-hidden h-full">
              
              {/* Close Button Top Right */}
              <div className="absolute top-6 right-6 z-10">
                 <button onClick={onClose} className={`p-2.5 rounded-full ${isDark ? 'bg-gray-900 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'} transition-colors`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 sm:p-12 custom-scrollbar">
                
                {/* --- TAB 1: THEME & UI --- */}
                {activeTab === 'theme' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-xl">
                    <div>
                      <h3 className={`text-3xl font-black tracking-tight ${textMain} mb-2`}>Theme & UI</h3>
                      <p className={`text-sm ${textMuted} font-medium`}>Customize how your partner portal looks and feels.</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className={`text-[11px] font-bold uppercase tracking-widest ${textMuted} block mb-3`}>Theme Mode</label>
                        <div className={`flex p-1.5 rounded-2xl border ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                          <button onClick={() => setTheme('light')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${theme === 'light' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>☀️ Light Mode</button>
                          <button onClick={() => setTheme('dark')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${theme === 'dark' ? 'bg-gray-800 text-white shadow-sm border border-gray-700' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>🌙 Dark Mode</button>
                        </div>
                      </div>

                      <div>
                        <label className={`text-[11px] font-bold uppercase tracking-widest ${textMuted} block mb-3`}>Layout Direction</label>
                        <div className={`flex p-1.5 rounded-2xl border ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                          <button onClick={() => setDir('ltr')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${dir === 'ltr' ? (isDark ? 'bg-gray-800 text-white shadow-sm border border-gray-700' : 'bg-white text-gray-900 shadow-sm border border-gray-100') : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>LTR (Left to Right)</button>
                          <button onClick={() => setDir('rtl')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${dir === 'rtl' ? (isDark ? 'bg-gray-800 text-white shadow-sm border border-gray-700' : 'bg-white text-gray-900 shadow-sm border border-gray-100') : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>RTL (Arabic)</button>
                        </div>
                      </div>

                      <div>
                        <label className={`text-[11px] font-bold uppercase tracking-widest ${textMuted} block mb-3`}>Primary Accent Color</label>
                        <div className="grid grid-cols-4 gap-4">
                          {THEME_COLORS.map((color) => (
                            <button
                              key={color.name}
                              onClick={() => setPrimaryColor(color)}
                              className={`h-16 rounded-2xl flex items-center justify-center transition-all ${primaryColor.name === color.name ? 'ring-[3px] ring-offset-4 ring-offset-transparent shadow-xl scale-105' : 'hover:scale-105 shadow-sm'}`}
                              style={{ backgroundColor: color.value  }}
                              title={color.name}
                            >
                              {primaryColor.name === color.name && (
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* --- TAB 2: RESTAURANT PROFILE --- */}
                {activeTab === 'restaurant' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-2xl">
                    <div>
                      <h3 className={`text-3xl font-black tracking-tight ${textMain} mb-2`}>Restaurant Profile</h3>
                      <p className={`text-sm ${textMuted} font-medium`}>Update your business information and contact details.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className={`text-[11px] font-bold uppercase tracking-widest ${textMuted} mb-2 block`}>Business Name</label>
                        <input type="text" defaultValue="The Grand Plaza" className={`w-full px-5 py-4 rounded-xl border outline-none font-medium focus:ring-2 ${inputBg}`} style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }} />
                      </div>
                      <div>
                        <label className={`text-[11px] font-bold uppercase tracking-widest ${textMuted} mb-2 block`}>Support Email</label>
                        <input type="email" defaultValue="hello@grandplaza.com" className={`w-full px-5 py-4 rounded-xl border outline-none font-medium focus:ring-2 ${inputBg}`} style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }} />
                      </div>
                      <div>
                        <label className={`text-[11px] font-bold uppercase tracking-widest ${textMuted} mb-2 block`}>Support Phone</label>
                        <input type="text" defaultValue="+971 52 756 57 19" className={`w-full px-5 py-4 rounded-xl border outline-none font-medium focus:ring-2 ${inputBg}`} style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={`text-[11px] font-bold uppercase tracking-widest ${textMuted} mb-2 block`}>Address</label>
                        <textarea rows={3} defaultValue="123 Food Street, Downtown Dubai, UAE" className={`w-full px-5 py-4 rounded-xl border outline-none font-medium focus:ring-2 resize-none ${inputBg}`} style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }} />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="text-white px-8 py-4 rounded-xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg" style={{ backgroundColor: primaryColor.value, boxShadow: `0 4px 14px 0 ${primaryColor.value}40` }}>
                        Save Profile Changes
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* --- TAB 3: NOTIFICATIONS --- */}
                {activeTab === 'notifications' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-xl">
                    <div>
                      <h3 className={`text-3xl font-black tracking-tight ${textMain} mb-2`}>Notifications</h3>
                      <p className={`text-sm ${textMuted} font-medium`}>Control how and when you get alerted.</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { title: 'New Order Alerts', desc: 'Play a sound when a new order arrives.' },
                        { title: 'Daily Reports', desc: 'Receive a summary email at the end of the day.' },
                        { title: 'Low Inventory', desc: 'Get notified when stock items are running low.' }
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center justify-between p-6 rounded-2xl border ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                          <div>
                            <label className={`text-sm font-bold ${textMain} block mb-1`}>{item.title}</label>
                            <p className={`text-xs font-medium ${textMuted}`}>{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                            <div className={`w-12 h-6.5 rounded-full peer transition-all relative ${isDark ? 'bg-gray-700' : 'bg-gray-300'} peer-checked:bg-opacity-100`} style={i !== 2 ? { backgroundColor: primaryColor.value } : {}}>
                              <div className={`absolute top-[3px] left-[3px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${i !== 2 ? 'translate-x-[22px] border-white shadow-sm' : ''}`}></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;