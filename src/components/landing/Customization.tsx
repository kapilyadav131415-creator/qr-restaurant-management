import React, { useState } from "react";

const Customization: React.FC = () => {
  // All interactive states for the live preview
  const [darkMode, setDarkMode] = useState(false);
  const [badge, setBadge] = useState(true);
  const [brandColor, setBrandColor] = useState('#dc2626'); // red-600
  const [cornerRadius, setCornerRadius] = useState('2rem');
  const [prepTimeVisible, setPrepTimeVisible] = useState(true);
  const [activeLanguage, setActiveLanguage] = useState('en'); // 'en' or 'hi'
  const [selectedFont, setSelectedFont] = useState('font-sans');
  
  // Font mapping for preview
  const fontClasses = {
    'font-sans': 'font-sans',
    'font-serif': 'font-serif',
    'font-mono': 'font-mono',
    'font-semibold': 'font-sans font-semibold'
  };

  const getDescription = () => {
    if (activeLanguage === 'hi') {
      return "एक समृद्ध और मलाईदार उत्तर भारतीय व्यंजन, तंदूर में मसालों के साथ भुना हुआ।";
    }
    return "A rich and creamy North Indian delicacy roasted in a tandoor with aromatic spices.";
  };

  const getTitle = () => {
    return activeLanguage === 'hi' ? "शाही पनीर टिक्का" : "Shahi Paneer Tikka";
  };

  // Corner radius options
  const radiusOptions = [
    { value: '0.5rem', label: 'sm', class: 'rounded-lg' },
    { value: '1rem', label: 'md', class: 'rounded-2xl' },
    { value: '2rem', label: 'lg', class: 'rounded-3xl' },
    { value: '9999px', label: 'full', class: 'rounded-full' }
  ];

  return (
    <div className="py-24 bg-white flex justify-center font-sans border-b border-gray-100">
      <div className="relative w-full max-w-[1300px] bg-gray-50 rounded-2xl border border-gray-200 p-8 md:p-16 overflow-hidden mx-6">
        
        {/* Heading Area */}
        <div className="text-center mb-16 relative z-10">
          <span className="inline-flex items-center gap-2 text-gray-700 text-[11px] font-bold uppercase tracking-widest mb-4 bg-gray-200 px-3 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Live Demo
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.15]">
            Customize Your Menu The Way <br className="hidden md:block" /> 
            <span className="text-red-600">You Want</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Fully customizable menu that fits perfectly with your business brand identity.
          </p>

          {/* Top Pill Tabs */}
          <div className="flex justify-center mt-10">
            <div className="flex p-1 bg-white rounded-md gap-1 border border-gray-200">
              {["Item Card", "Item Details", "Section Banner", "Promotion"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all duration-300 ${
                    tab === "Item Card"
                      ? "bg-gray-100 text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main 3-Column Layout */}
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-16 items-start relative z-10">

          {/* LEFT PANEL - Controls */}
          <div className="space-y-10 flex flex-col items-center  lg:items-start">
            
            {/* Appearance */}
            <div className="w-full max-w-[220px]">
              <span className="text-[11px] font-bold text-gray-400 mb-3 block uppercase tracking-wider">Appearance</span>
              <div className="flex p-1 bg-white border border-gray-200 rounded-md">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`flex-1 px-4 py-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-2 transition-all ${
                    !darkMode ? "bg-gray-100 shadow-sm text-gray-900" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm">☼</span> Light
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={`flex-1 px-4 py-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-2 transition-all ${
                    darkMode ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm">☾</span> Dark
                </button>
              </div>
            </div>

            {/* Font Samples with live update */}
            <div className="w-full max-w-[220px]">
              <span className="text-[11px] font-bold text-gray-400 mb-3 block uppercase tracking-wider">Font Samples</span>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setSelectedFont('font-sans')}
                  className={`bg-white p-5 rounded-lg flex justify-center items-center shadow-sm border cursor-pointer transition-all hover:border-gray-300 ${selectedFont === 'font-sans' ? 'ring-2 ring-red-500 border-transparent' : 'border-gray-200'}`}
                >
                  <span className="text-3xl font-sans font-bold text-gray-900">Aa</span>
                </div>
                <div 
                  onClick={() => setSelectedFont('font-serif')}
                  className={`bg-white p-5 rounded-lg flex justify-center items-center shadow-sm border cursor-pointer transition-all hover:border-gray-300 ${selectedFont === 'font-serif' ? 'ring-2 ring-red-500 border-transparent' : 'border-gray-200'}`}
                >
                  <span className="text-3xl font-serif text-gray-700">Aa</span>
                </div>
                <div 
                  onClick={() => setSelectedFont('font-mono')}
                  className={`bg-white p-5 rounded-lg flex justify-center items-center shadow-sm border cursor-pointer transition-all hover:border-gray-300 ${selectedFont === 'font-mono' ? 'ring-2 ring-red-500 border-transparent' : 'border-gray-200'}`}
                >
                  <span className="text-3xl font-mono text-gray-700">Aa</span>
                </div>
                <div 
                  onClick={() => setSelectedFont('font-semibold')}
                  className={`bg-white p-5 rounded-lg flex justify-center items-center shadow-sm border cursor-pointer transition-all hover:border-gray-300 ${selectedFont === 'font-semibold' ? 'ring-2 ring-red-500 border-transparent' : 'border-gray-200'}`}
                >
                  <span className="text-3xl font-sans font-black text-gray-700">Aa</span>
                </div>
              </div>
            </div>

            {/* Language Sample */}
            <div className="w-full max-w-[220px]">
              <span className="text-[11px] font-bold text-gray-400 mb-3 block uppercase tracking-wider">Language</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveLanguage('hi')}
                  className={`bg-white p-4 rounded-lg shadow-sm border flex flex-col items-center justify-center gap-2 flex-1 transition-all hover:border-gray-300 ${activeLanguage === 'hi' ? 'ring-2 ring-red-500 border-transparent' : 'border-gray-200'}`}
                >
                  <span className="text-3xl drop-shadow-sm">🇮🇳</span>
                  <span className="text-[11px] font-bold text-gray-800">हिंदी</span>
                </button>
                <button
                  onClick={() => setActiveLanguage('en')}
                  className={`bg-white p-4 rounded-lg shadow-sm border flex flex-col items-center justify-center gap-2 flex-1 transition-all hover:border-gray-300 ${activeLanguage === 'en' ? 'ring-2 ring-red-500 border-transparent' : 'border-gray-200'}`}
                >
                  <span className="text-3xl drop-shadow-sm">🇬🇧</span>
                  <span className="text-[11px] font-bold text-gray-500">English</span>
                </button>
              </div>
            </div>

            {/* Preparation Time Toggle */}
            <div className="w-full max-w-[220px]">
              <span className="text-[11px] font-bold text-gray-400 mb-3 block uppercase tracking-wider">Prep Time</span>
              <div className="inline-flex p-1 bg-white border border-gray-200 rounded-md">
                <button
                  onClick={() => setPrepTimeVisible(true)}
                  className={`px-6 py-2 rounded-md text-[11px] font-bold transition-all ${prepTimeVisible ? "bg-gray-100 shadow-sm text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  ON
                </button>
                <button
                  onClick={() => setPrepTimeVisible(false)}
                  className={`px-6 py-2 rounded-md text-[11px] font-bold transition-all ${!prepTimeVisible ? "bg-gray-100 shadow-sm text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  OFF
                </button>
              </div>
            </div>
          </div>

          {/* CENTER CARD - Live Preview Card */}
          <div className="flex justify-center w-full">
            <div 
              className={`w-[360px] transition-all duration-500 shadow-xl border ${darkMode ? 'bg-gray-900 text-white border-gray-800' : 'bg-white border-gray-200'}`}
              style={{ borderRadius: cornerRadius, overflow: 'hidden' }}
            >
              {/* Image Section */}
              <div className="relative h-[260px] p-3" style={{ backgroundColor: darkMode ? '#111' : '#fff' }}>
                <img
                  src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800"
                  alt="Shahi Paneer Tikka"
                  className="w-full h-full object-cover rounded-xl border border-gray-100"
                  style={{ borderRadius: `calc(${cornerRadius} - 0.5rem)` }}
                />
                
                {/* Time Badge */}
               
                {/* NEW Badge */}
                {badge && (
                  <div className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center drop-shadow-sm">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full fill-current text-red-600">
                      <path d="M50 0L56.1485 10.9575L68.3013 7.02705L70.198 19.3496L82.1394 19.3496L79.6106 31.4287L89.6056 36.3192L83.0538 46.5414L91.6882 54.5126L81.7225 61.5434L86.6025 72.483L74.8878 75.986L75.698 88.4552L63.8515 88.4552L60.4079 100L49.198 94.6738L37.9881 100L34.5445 88.4552L22.698 88.4552L23.5082 75.986L11.7935 72.483L16.6735 61.5434L6.70776 54.5126L15.3422 46.5414L8.79041 36.3192L18.7854 31.4287L16.2566 19.3496L28.198 19.3496L30.0947 7.02705L42.2475 10.9575L50 0Z" />
                    </svg>
                    <span className="relative z-10 text-white font-bold text-[10px] italic">NEW</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 pt-4" style={{ backgroundColor: darkMode ? '#1a1a1a' : '#fff' }}>
                <h3 className={`text-xl font-bold mb-2 leading-tight transition-all ${selectedFont} ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {getTitle()}
                </h3>
                <p className={`text-xs font-medium leading-relaxed mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {getDescription()}
                </p>

                {/* Logo preview & price */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👨‍🍳</span>
                    <span className="text-[10px] font-bold text-gray-500">QR Dine</span>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className={`text-sm font-bold ${darkMode ? 'text-gray-500' : 'text-gray-500'}`} style={{ color: darkMode ? '#888' : brandColor }}>₹</span>
                    <span className="text-3xl font-bold tracking-tight" style={{ color: darkMode ? '#fff' : brandColor }}>349</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - More Controls */}
          <div className="space-y-10 w-full max-w-[220px] mx-auto lg:mx-0">
            
            {/* Logo Samples */}
            <div>
              <span className="text-[11px] font-bold text-gray-400 mb-3 block uppercase tracking-wider">Logo Samples</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-5 rounded-lg flex justify-center items-center shadow-sm border border-gray-200 text-3xl text-gray-900">👨‍🍳</div>
                <div className="bg-white p-5 rounded-lg flex justify-center items-center shadow-sm border border-gray-200 text-3xl text-gray-500 hover:border-gray-300">🍛</div>
                <div className="bg-white p-5 rounded-lg flex justify-center items-center shadow-sm border border-gray-200 text-3xl text-gray-500 hover:border-gray-300">☕</div>
                <div className="bg-white p-5 rounded-lg flex justify-center items-center shadow-sm border border-gray-200 text-3xl text-gray-500 hover:border-gray-300">🍲</div>
              </div>
            </div>

            {/* Brand Color Picker */}
            <div>
              <span className="text-[11px] font-bold text-gray-400 mb-3 block uppercase tracking-wider">Brand Color</span>
              <div className="flex gap-3 items-center flex-wrap">
                {['#dc2626', '#10b981', '#f97316', '#fbbf24'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrandColor(color)}
                    className={`w-7 h-7 rounded-full transition-all ${brandColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'opacity-70 hover:opacity-100'}`}
                    style={{ backgroundColor: color }}
                  ></button>
                ))}
                <div className="w-7 h-7 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-500 text-xs cursor-pointer shadow-sm hover:bg-gray-50">
                  ✎
                </div>
              </div>
            </div>

            {/* Corner Radius Selector */}
            <div>
              <span className="text-[11px] font-bold text-gray-400 mb-3 block uppercase tracking-wider">Corner Radius</span>
              <div className="grid grid-cols-4 gap-2">
                {radiusOptions.map((radius) => (
                  <button
                    key={radius.value}
                    onClick={() => setCornerRadius(radius.value)}
                    className={`h-8 transition-all ${cornerRadius === radius.value ? 'bg-gray-900 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'} text-[10px] font-bold rounded-md`}
                  >
                    {radius.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Toggle */}
            <div>
              <span className="text-[11px] font-bold text-gray-400 mb-3 block uppercase tracking-wider">Badge</span>
              <div className="inline-flex p-1 bg-white border border-gray-200 rounded-md">
                <button
                  onClick={() => setBadge(true)}
                  className={`px-6 py-2 rounded-md text-[11px] font-bold transition-all ${badge ? "bg-gray-100 shadow-sm text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  ON
                </button>
                <button
                  onClick={() => setBadge(false)}
                  className={`px-6 py-2 rounded-md text-[11px] font-bold transition-all ${!badge ? "bg-gray-100 shadow-sm text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  OFF
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Customization;