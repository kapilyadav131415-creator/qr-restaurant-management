 
import {    useNavigate } from 'react-router-dom';


const About = () => {
  return (
     <>
    <MissionSection />
    
   
    
 </>
   
  );
};

 
 
const MissionSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-40 -left-20 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <div className="order-2 md:order-1">
            <span className="inline-block text-orange-500 text-sm font-bold uppercase tracking-wider bg-orange-50 px-4 py-1.5 rounded-full mb-6">
              Our Mission
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
              Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Restaurant Experience</span>
            </h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              This QR-based system helps restaurants digitize operations, reduce wait time, 
              and improve efficiency with real-time tracking and automation.
            </p>
            
            <div className="space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="bg-green-100 p-2.5 rounded-xl group-hover:bg-green-200 transition">
                  <span className="text-xl">✅</span>
                </div>
                <span className="text-gray-700 font-medium text-lg">95% faster order processing</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="bg-green-100 p-2.5 rounded-xl group-hover:bg-green-200 transition">
                  <span className="text-xl">✅</span>
                </div>
                <span className="text-gray-700 font-medium text-lg">Zero touch dining experience</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="bg-green-100 p-2.5 rounded-xl group-hover:bg-green-200 transition">
                  <span className="text-xl">✅</span>
                </div>
                <span className="text-gray-700 font-medium text-lg">Increase table turnover by 40%</span>
              </div>
            </div>
          </div>
          
          {/* Right Mockup (enhanced) */}
          <div className="order-1 md:order-2 relative">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl p-4 shadow-2xl">
                <div className="bg-gray-900 rounded-2xl p-5 text-white shadow-inner">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🍔</span>
                      <span className="font-bold">Burger Mania</span>
                    </div>
                    <span className="text-orange-400 font-extrabold">$12.99</span>
                  </div>
                  <div className="mb-5">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Order Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 w-3/4 h-2.5 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="inline-block bg-orange-500/20 text-orange-300 px-4 py-1.5 rounded-full text-sm font-bold">
                      Live Order: #284 - Preparing
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-gray-500">
                    <span>⏱️ Est. 8 min</span>
                    <span>👨‍🍳 Chef Raj</span>
                  </div>
                </div>
                <div className="mt-4 text-center text-gray-500 text-sm font-medium">
                  Real-time kitchen dashboard preview
                </div>
              </div>
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-orange-200 rounded-full opacity-50 -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-red-200 rounded-full opacity-50 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;


