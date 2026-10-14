import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, User, Menu, X, Settings, LogOut, Loader2 } from "lucide-react";
import * as FiIcons from "react-icons/fi";
import api from "../../config/axios";
import logo from "../../assets/logo/logo.png";

// --- CONFIGURATION ---
const THEME_COLORS = [
  { name: "Byte Orange", value: "#F97316", hover: "#EA580C", bg: "bg-orange-500" },
  { name: "Royal Red", value: "#DC2626", hover: "#B91C1C", bg: "bg-red-600" },
  { name: "Ocean Blue", value: "#2563EB", hover: "#1D4ED8", bg: "bg-blue-600" },
  { name: "Emerald Green", value: "#10B981", hover: "#059669", bg: "bg-emerald-500" },
  { name: "Purple Night", value: "#7C3AED", hover: "#6D28D9", bg: "bg-violet-600" },
  { name: "Rose Pink", value: "#EC4899", hover: "#DB2777", bg: "bg-pink-500" },
  { name: "Luxury Gold", value: "#D4A017", hover: "#B8860B", bg: "bg-yellow-600" },
  { name: "Teal Modern", value: "#0F766E", hover: "#115E59", bg: "bg-teal-700" },
  { name: "Cyber Cyan", value: "#06B6D4", hover: "#0891B2", bg: "bg-cyan-500" },
  { name: "Dark Graphite", value: "#374151", hover: "#1F2937", bg: "bg-gray-700" },
  { name: "Brand Blue", value: "#0b59d7", hover: "#114ea3", bg: "bg-blue-700" },
];

// --- TYPES ---
export interface NavbarModule {
  module_id: string;
  module_name: string;
  route_path: string;
  icon_name: string;
  parent_id: string | null;
  sub_modules: NavbarModule[];
}

// --- DYNAMIC ICON COMPONENT ---
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = FiIcons[name as keyof typeof FiIcons];
  if (!IconComponent) return <FiIcons.FiCircle className={className} />;
  return <IconComponent className={className} />;
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ---
  const [navItems, setNavItems] = useState<NavbarModule[]>([]);
  const [loadingNav, setLoadingNav] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [profileData, setProfileData] = useState<{name: string, email: string} | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  // --- THEME STATE ---
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [dir, setDir] = useState(localStorage.getItem("dir") || "ltr");
  const [primaryColor, setPrimaryColor] = useState(
    JSON.parse(localStorage.getItem("color") || "null") || THEME_COLORS[0]
  );

  // --- FETCH DYNAMIC NAVBAR ---
  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const response = await api.get("/permissions/my-navbar");
        
        if (response.data?.status === "success") {
          const fetchedItems = response.data.data;
          setNavItems(fetchedItems);

          // Auto-open menus that have sub-modules
          const initialOpenState: Record<string, boolean> = {};
          fetchedItems.forEach((item: NavbarModule) => {
            if (item.sub_modules?.length > 0) initialOpenState[item.module_name] = true;
          });
          setOpenMenus(initialOpenState);
        }
      } catch (error) {
        console.error("Failed to fetch navbar", error);
      } finally {
        setLoadingNav(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        if (response.data?.status === "success") {
          setProfileData({
            name: response.data.data.personal_info.name,
            email: response.data.data.personal_info.email
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchNavbar();
    fetchProfile();
  }, []);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("dir", dir);
    localStorage.setItem("color", JSON.stringify(primaryColor));
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, dir, primaryColor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- HANDLERS ---
  const handleLogout = async () => {
    try {
      // Optional: Call logout API
      // await api.post("/auth/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const toggleMenu = (menuName: string) => {
    if (isSidebarCollapsed) setIsSidebarCollapsed(false);
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  // --- STYLES ---
  const isDark = theme === "dark";
  const bgMain = isDark ? "bg-gray-900" : "bg-[#FAFAFA]";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const sidebarBg = isDark ? "bg-[#0B0F19]" : "bg-white";
  const sidebarHover = isDark ? "hover:bg-gray-800" : "hover:bg-gray-50";
  const sidebarText = isDark ? "text-gray-300" : "text-gray-600";
  const borderColor = isDark ? "border-gray-800" : "border-gray-100";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";

  return (
    <div dir={dir} className={`flex h-screen w-full overflow-hidden ${bgMain} font-sans transition-colors duration-300`}>
      
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarCollapsed ? 80 : 280,
          x: isMobileSidebarOpen ? 0 : window.innerWidth < 1024 ? -280 : 0
        }}
        className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col shadow-[10px_0_40px_rgba(0,0,0,0.03)] transition-all duration-300 lg:relative ${sidebarBg} border-r ${borderColor}`}
      >
        {/* LOGO AREA */}
        <div className={`flex h-20 shrink-0 items-center justify-between px-6 border-b ${borderColor}`}>
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
              <img src={logo || "https://via.placeholder.com/40"} alt="Logo" className="h-8 w-8 object-contain" />
            </div>
            {!isSidebarCollapsed && (
              <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-wide truncate`}>SaaS ERP</span>
            )}
          </Link>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)} 
            className="lg:hidden text-gray-400 hover:text-white p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar space-y-1.5">
          {loadingNav ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : navItems.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-10">No modules available</div>
          ) : (
            navItems.map((item) => {
              const hasSubLinks = item.sub_modules && item.sub_modules.length > 0;
              const isActive = location.pathname === item.route_path;
              const isOpen = openMenus[item.module_name];

              return (
                <div key={item.module_id}>
                  {hasSubLinks ? (
                    // DROPDOWN PARENT
                    <button
                      onClick={() => toggleMenu(item.module_name)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${sidebarHover} ${isOpen ? (isDark ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-900') : sidebarText}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <DynamicIcon 
                          name={item.icon_name} 
                          className={`h-5 w-5 shrink-0 ${isOpen ? '' : 'opacity-70'}`} 
                        />
                        {!isSidebarCollapsed && (
                          <span className="truncate">{item.module_name}</span>
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <ChevronRight 
                          size={16} 
                          className={`transition-transform duration-200 shrink-0 ${isOpen ? (isDark ? 'rotate-90 text-white' : 'rotate-90 text-gray-900') : 'opacity-50'}`} 
                        />
                      )}
                    </button>
                  ) : (
                    // SINGLE LINK
                    <Link
                      to={item.route_path}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                        isActive ? 'text-white shadow-md' : `${sidebarText} ${sidebarHover}`
                      }`}
                      style={isActive ? { backgroundColor: primaryColor.value } : {}}
                    >
                      <DynamicIcon 
                        name={item.icon_name} 
                        className={`h-5 w-5 shrink-0 ${isActive ? 'opacity-100' : 'opacity-70'}`} 
                      />
                      {!isSidebarCollapsed && (
                        <span className="truncate">{item.module_name}</span>
                      )}
                    </Link>
                  )}

                  {/* SUB-LINKS */}
                  <AnimatePresence>
                    {hasSubLinks && isOpen && !isSidebarCollapsed && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 space-y-1 pl-11 pr-2">
                          {item.sub_modules.map((sub) => {
                            const isSubActive = location.pathname === sub.route_path;
                            return (
                              <Link
                                key={sub.module_id}
                                to={sub.route_path}
                                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                                  isSubActive 
                                    ? (isDark ? 'text-white bg-white/10' : 'text-gray-900 bg-gray-100')
                                    : (isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900')
                                }`}
                              >
                                <DynamicIcon name={sub.icon_name} className="h-4 w-4 opacity-70" />
                                <span>{sub.module_name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* SIDEBAR COLLAPSE BUTTON (Desktop only) */}
        <div className={`hidden lg:flex p-4 border-t ${borderColor} justify-center`}>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`flex items-center justify-center rounded-xl font-bold transition-all duration-300 text-white hover:scale-[1.02] active:scale-[0.97] shadow-md ${
              isSidebarCollapsed ? "p-3" : "px-4 py-3 w-full gap-3"
            }`}
            style={{ 
              backgroundColor: primaryColor.value,
              boxShadow: `0 4px 12px ${primaryColor.value}40`
            }}
          >
            <Menu size={20} className={`transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`} />
            {!isSidebarCollapsed && <span className="text-sm whitespace-nowrap">Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* HEADER */}
        <header className={`flex h-20 shrink-0 items-center justify-between border-b px-6 transition-colors lg:px-10 ${cardBg} ${borderColor}`}>
          <div className="flex items-center gap-4 min-w-0">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)} 
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Menu size={20} />
            </button>
            
            {/* Desktop Collapse Toggle */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              className="hidden lg:flex p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <h2 className={`hidden sm:block text-xl font-black ${textMain} tracking-tight truncate`}>
              {navItems.flatMap(i => [i, ...(i.sub_modules || [])])
                .find(m => m?.route_path === location.pathname)?.module_name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            
            {/* Notifications Button */}
            <button className={`relative p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
              <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></div>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </button>

            {/* Settings Button */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <Settings size={22} />
            </button>

            {/* Divider */}
            <div className={`h-8 w-px mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

            {/* PROFILE DROPDOWN */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} 
                className={`flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 border transition-all ${isDark ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
              >
                <div 
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white font-bold shadow-sm"
                  style={{ backgroundColor: primaryColor.value }}
                >
                  <User size={16} />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className={`text-sm font-bold leading-none ${textMain}`}>
                    {profileData?.name || "Loading..."}
                  </span>
                </div>
                <ChevronDown size={14} className={`${isDark ? 'text-gray-400' : 'text-gray-500'} ml-1`} />
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-3 w-64 rounded-2xl border shadow-[0_10px_40px_rgba(0,0,0,0.1)] ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-2 z-50`}
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3 mb-2">
                      <p className={`text-sm font-bold ${textMain}`}>{profileData?.name || "Admin User"}</p>
                      <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{profileData?.email || "Loading..."}</p>
                    </div>
                    
                    <div className={`my-1 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}></div>
                    
                    {/* Menu Items */}
                    <div className="space-y-1 mt-2">
                      <Link 
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <User size={18} className="text-gray-400" /> My Profile
                      </Link>
                      
                      <button 
                        onClick={() => { setIsSettingsOpen(true); setIsProfileDropdownOpen(false); }} 
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <Settings size={18} className="text-gray-400" /> Theme Settings
                      </button>
                      
                      <button 
                        onClick={handleLogout} 
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <LogOut size={18} className="text-red-500" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto p-6 lg:p-10 custom-scrollbar">
          <Outlet context={{ theme, dir, primaryColor, isDark }} />
        </main>
      </div>

      {/* THEME SETTINGS MODAL */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-full max-w-sm h-full p-6 shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className={`text-xl font-black ${textMain}`}>Theme Preferences</h3>
                <button 
                  onClick={() => setIsSettingsOpen(false)} 
                  className={`p-2 rounded-full ${isDark ? 'bg-gray-700 text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-black'}`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Theme Mode */}
              <div className="mb-8">
                <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Mode
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setTheme("light")} 
                    className={`py-3 rounded-xl font-bold border-2 transition-all ${
                      theme === "light" 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setTheme("dark")} 
                    className={`py-3 rounded-xl font-bold border-2 transition-all ${
                      theme === "dark" 
                        ? 'border-blue-500 bg-gray-900 text-white' 
                        : isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Direction */}
              <div className="mb-8">
                <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Direction
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setDir("ltr")} 
                    className={`py-3 rounded-xl font-bold border-2 transition-all ${
                      dir === "ltr" 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    LTR
                  </button>
                  <button 
                    onClick={() => setDir("rtl")} 
                    className={`py-3 rounded-xl font-bold border-2 transition-all ${
                      dir === "rtl" 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    RTL
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Primary Color
                </h4>
                <div className="grid grid-cols-5 gap-3">
                  {THEME_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setPrimaryColor(c)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                        primaryColor.name === c.name 
                          ? 'ring-4 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' 
                          : ''
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;