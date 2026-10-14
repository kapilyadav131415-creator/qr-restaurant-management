import React, { useEffect, useRef } from 'react';
import { BarChart3, Globe2, Clock, Smartphone, Sparkles, TrendingUp } from 'lucide-react';

const BentoFeatures: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    const cards = document.querySelectorAll('.bento-item');
    cards.forEach((card) => observer.observe(card));
    
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-gray-50 relative overflow-hidden font-sans border-b border-gray-100" ref={sectionRef}>
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-200 border border-gray-300 text-gray-700 text-xs font-bold tracking-widest uppercase mb-6">
            <Sparkles className="w-4 h-4 text-gray-600" />
            Core Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.15]">
            Everything you need. <br className="hidden md:block" />
            <span className="text-red-600">
              Nothing you don't.
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
            A meticulously crafted suite of tools designed to elevate your restaurant operations and maximize revenue.
          </p>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 max-w-6xl mx-auto h-auto md:h-[800px]">
          
          {/* 1. Large Feature - Sales Boost (Spans 2x2) */}
          <div className="bento-item opacity-0 translate-y-12 transition-all duration-1000 ease-out md:col-span-2 md:row-span-2 relative group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl overflow-hidden">
            
            <div className="p-8 h-full flex flex-col justify-between relative z-10">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-6 border border-red-100">
                  <TrendingUp className="text-red-600 w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Skyrocket Your Sales.</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                  Strategic upselling, beautiful imagery, and seamless ordering flows are proven to increase average ticket sizes drastically.
                </p>
              </div>

              {/* Data Visualization Mockup */}
              <div className="mt-8 relative h-48 w-full border-t border-gray-100 bg-gray-50/50 rounded-b-2xl overflow-hidden">
                {/* SVG Graph */}
                <svg className="absolute bottom-0 w-full h-40" viewBox="0 0 100 50" preserveAspectRatio="none">
                  <path d="M0,50 L0,40 C20,40 30,20 50,25 C70,30 80,5 100,10 L100,50 Z" fill="url(#grad)" opacity="0.3" className="group-hover:opacity-60 transition-opacity duration-1000"/>
                  <path d="M0,40 C20,40 30,20 50,25 C70,30 80,5 100,10" fill="none" stroke="#dc2626" strokeWidth="2" />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#fef2f2" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Floating Stat */}
                <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-xl p-3 shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Revenue Boost</div>
                  <div className="text-2xl font-black text-gray-900">+38<span className="text-red-600">%</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Global Audience (Spans 2x1) */}
          <div className="bento-item opacity-0 translate-y-12 transition-all duration-1000 ease-out delay-100 md:col-span-2 md:row-span-1 relative group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl overflow-hidden flex items-center">
             <div className="absolute -right-16 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                <Globe2 className="w-64 h-64 text-gray-900" />
             </div>
             <div className="p-8 relative z-10 w-full flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Speak Their Language.</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Auto-translate your menu into dozens of languages. Break barriers and make every tourist feel right at home.
                  </p>
                </div>
                {/* Language Pills */}
                <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
                   {['🇬🇧 EN', '🇪🇸 ES', '🇨🇳 ZH', '🇦🇪 AR', '🇮🇳 HI'].map((lang, i) => (
                     <div key={i} className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold group-hover:bg-gray-100 transition-colors">
                       {lang}
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* 3. Time Saving (Spans 1x2) */}
          <div className="bento-item opacity-0 translate-y-12 transition-all duration-1000 ease-out delay-200 md:col-span-1 md:row-span-2 relative group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl overflow-hidden flex flex-col justify-between">
             <div className="p-8 pb-0 relative z-10">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-200">
                  <Clock className="text-gray-600 w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Save Hours Daily.</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Update items, prices, and stock instantly without reprinting physical menus.
                </p>
             </div>
             
             {/* Abstract Clock / Time Element */}
             <div className="relative h-48 mt-auto flex items-end justify-center overflow-hidden bg-gray-50/50 border-t border-gray-100">
                <div className="w-32 h-32 rounded-full border border-dashed border-gray-300 relative animate-[spin_60s_linear_infinite] group-hover:border-red-300 transition-colors duration-500 flex items-center justify-center mb-[-40px]">
                  <div className="w-16 h-16 rounded-full border border-gray-200 absolute bg-white shadow-sm"></div>
                  <div className="w-1 h-8 bg-red-500 rounded-full absolute bottom-1/2 left-1/2 origin-bottom transform -translate-x-1/2 rotate-45 group-hover:rotate-180 transition-transform duration-[2s] ease-in-out"></div>
                  <div className="w-1 h-5 bg-gray-800 rounded-full absolute bottom-1/2 left-1/2 origin-bottom transform -translate-x-1/2 -rotate-12 group-hover:rotate-90 transition-transform duration-[3s] ease-in-out"></div>
                  <div className="w-2 h-2 bg-gray-900 rounded-full absolute"></div>
                </div>
             </div>
          </div>

          {/* 4. Device Agnostic (Spans 1x1) */}
          <div className="bento-item opacity-0 translate-y-12 transition-all duration-1000 ease-out delay-300 md:col-span-1 md:row-span-1 relative group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl overflow-hidden transition-all p-8 flex flex-col justify-center">
             <div className="flex items-center gap-4 mb-3">
               <Smartphone className="text-gray-900 w-6 h-6" />
               <h3 className="text-xl font-bold text-gray-900 tracking-tight">No Apps Needed.</h3>
             </div>
             <p className="text-gray-600 text-xs leading-relaxed">
               Works flawlessly in the browser of any smartphone. Zero friction for your hungry guests.
             </p>
          </div>

          {/* 5. Analytics (Spans 2x1) */}
          <div className="bento-item opacity-0 translate-y-12 transition-all duration-1000 ease-out delay-400 md:col-span-2 md:row-span-1 relative group rounded-2xl bg-gray-900 border border-gray-800 shadow-md hover:shadow-xl overflow-hidden p-8 flex items-center justify-between">
            <div className="relative z-10 w-2/3">
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Powerful Analytics.</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Know exactly what's selling, when it's selling, and who's buying. Make data-driven decisions.
              </p>
            </div>
            
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
               <BarChart3 className="text-white w-8 h-8" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;