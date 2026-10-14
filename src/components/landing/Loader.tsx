import React, { useState, useEffect } from 'react';
// Make sure this path points to your actual logo location
import logo from '../../assets/logo/logo.png'; 

const Loader: React.FC = () => {
  const [textIndex, setTextIndex] = useState(0);
  
  // Tagline-inspired loading steps
  const loadingTexts = [
    "Scanning QR...", 
    "Preparing Menu...", 
    "Taking Order...", 
    "Almost Ready..."
  ];

  useEffect(() => {
    // Cycle through the texts every 600ms
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Premium subtle background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Floating Logo Animation */}
        <div className="mb-10 animate-[float_3s_ease-in-out_infinite]">
          <img 
            src={logo} 
            alt="ByteMenu Loading" 
            className="h-32 md:h-40 object-contain drop-shadow-2xl" 
          />
        </div>

        {/* Sleek Progress Bar */}
        <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6 shadow-inner relative">
          <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-[slide_1.5s_ease-in-out_infinite]"></div>
        </div>

        {/* Dynamic Tagline Text */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-gray-500 font-semibold tracking-[0.2em] text-xs uppercase animate-pulse">
            {loadingTexts[textIndex]}
          </p>
        </div>
      </div>

      {/* Inline styles for custom premium animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes slide {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; transform: translateX(20%); }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Loader;