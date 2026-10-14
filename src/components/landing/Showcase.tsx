import React from 'react';
import businessImg2 from '../../assets/landingimage/customize2.png';
import businessImg1 from '../../assets/landingimage/cutomize1.png'; 
import { ArrowRight } from 'lucide-react';

const Showcase = () => {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden relative font-sans border-b border-gray-100">
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* ===== First Row: Highlight Meals ===== */}
        <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24 mb-32">
          {/* Text Content */}
          <div className="lg:w-1/2 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-bold tracking-widest uppercase mb-6">
              Visual Merchandising
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.15]">
              Make your dishes <br className="hidden sm:block" />
              <span className="text-red-600">impossible to resist.</span>
            </h2>
            <p className="text-gray-600 text-lg font-medium leading-relaxed mb-10">
              Use the power of QR Dine to showcase high-res imagery, highlight special offers, and update your menu instantly. Create a modern dining experience that converts browsing into ordering.
            </p>
            <a href="#features" className="group inline-flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Explore the Menu Builder
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Image / Mockup */}
          <div className="lg:w-1/2 w-full relative">
            <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-2xl">
              <div className="bg-white rounded-xl overflow-hidden aspect-[4/3] relative border border-gray-100">
                <img 
                  src={businessImg1} 
                  alt="Digital menu showcase"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating UI Elements for realism */}
                <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-sm">🔥</div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Selling</div>
                    <div className="text-sm font-black text-gray-900">Spicy Ramen</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Second Row: Promote Events ===== */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16 md:gap-24">
          {/* Text Content */}
          <div className="lg:w-1/2 w-full">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-bold tracking-widest uppercase mb-6">
              Marketing Hub
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.15]">
              Promote events & <br className="hidden sm:block" />
              <span className="text-red-600">build a community.</span>
            </h2>
            <p className="text-gray-600 text-lg font-medium leading-relaxed mb-10">
              Turn your digital menu into a marketing channel. Showcase your latest events, run limited-time promotions, and feature your social media directly to the customers sitting at your tables.
            </p>
            <a href="#contact" className="group inline-flex items-center gap-2 text-gray-900 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg font-bold transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
              See Marketing Tools
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Image / Mockup */}
          <div className="lg:w-1/2 w-full relative">
            <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-2xl">
              <div className="bg-white rounded-xl overflow-hidden aspect-[4/3] relative border border-gray-100">
                <img 
                  src={businessImg2} 
                  alt="Event promotion mockup"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating UI Element */}
                <div className="absolute bottom-6 right-6 bg-gray-900 px-4 py-3 rounded-lg shadow-xl border border-gray-800 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <div>
                     <div className="text-white text-sm font-bold">Happy Hour Active</div>
                     <div className="text-gray-400 text-[10px] font-medium">Ends in 2h 45m</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Showcase;