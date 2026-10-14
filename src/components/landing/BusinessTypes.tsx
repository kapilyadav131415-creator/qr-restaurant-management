import React, { useState } from 'react';
import businessImg2 from '../../assets/landingimage/bussiness2.png';
import businessImg1 from '../../assets/landingimage/bussiness1.png'; 
import { ArrowRight, Play } from 'lucide-react';

const BusinessTypes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Arabic Cuisine');

  const categories = [
    { name: 'Arabic Cuisine', icon: '🥙' },
    { name: 'Pizzerias', icon: '🍕' },
    { name: 'Indian', icon: '🍛' },
    { name: 'Fast Food', icon: '🍔' },
    { name: 'Cafes', icon: '☕' },
  ];

  return (
    <section className="py-24 md:py-32 bg-gray-50 border-t border-gray-100 font-sans relative overflow-hidden">
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Header Section */}
        <div className="mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-[11px] font-black tracking-[0.2em] text-red-600 uppercase bg-red-50 rounded-md border border-red-100">
            Versatile Platform
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.15]">
            A unified experience for <br className="hidden md:block"/>
            <span className="text-red-600">
              every business type.
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            Whether you run a fine dining restaurant, a cozy café, a fast-food joint, or a hotel buffet, 
            QR Dine adapts to your style seamlessly.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-20 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(cat.name)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 border ${
                activeTab === cat.name
                  ? 'bg-gray-900 border-gray-900 text-white shadow-lg transform scale-105'
                  : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <span className="text-xl drop-shadow-sm">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mockups Display Area */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mb-20">
          
          {/* Left Mockup */}
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-200 relative group overflow-hidden h-[500px]">
             <div className="bg-gray-50 rounded-xl overflow-hidden h-full relative border border-gray-100">
                <img 
                  src={businessImg1} 
                  alt={`${activeTab} Menu`} 
                  className="w-full h-full object-cover"
                />
             </div>
          </div>

          {/* Right Mockup */}
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-200 relative group overflow-hidden h-[500px] transform lg:translate-y-12">
             <div className="bg-gray-50 rounded-xl overflow-hidden h-full flex flex-col border border-gray-100 relative">
                <div className="flex-1 relative">
                  <img 
                    src={businessImg2} 
                    alt={`${activeTab} Detail`} 
                    className="w-full h-full object-cover"
                  />
                </div>
             </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 lg:mt-32">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Create Menu Now
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
            <Play className="w-5 h-5 text-gray-600 fill-gray-600" />
            View Demo Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default BusinessTypes;