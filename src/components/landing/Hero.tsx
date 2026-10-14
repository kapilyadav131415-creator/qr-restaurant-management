import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-6 text-center relative z-10">
        
        {/* Animated Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-bold tracking-wide cursor-pointer hover:bg-red-100 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            v2.0 is now live — See what's new
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-[1.15] tracking-tight max-w-5xl mx-auto">
          The Operating System for <br className="hidden md:block" />
          <span className="text-red-600">
            Modern Restaurants
          </span>
        </h1>
        
        {/* Sub-headline */}
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          Streamline operations, boost sales, and delight guests with our all-in-one digital menu, KDS, and POS platform. No apps required.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <button 
            onClick={() => navigate("/register")} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start for Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
            <Play className="w-5 h-5 text-gray-600 fill-gray-600" />
            Book a Demo
          </button>
        </div>

        {/* Hero Product Mockup / Dashboard Preview */}
        <div className="relative max-w-6xl mx-auto mt-10">
          <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-2xl">
            <div className="aspect-video bg-[url('assets/landingimage/herobanner.png')] bg-cover bg-top rounded-xl border border-gray-100 overflow-hidden bg-white">
               {/* Fallback pattern if image is missing */}
               <div className="w-full h-full bg-gray-50 flex items-center justify-center -z-10 absolute inset-0">
                  <div className="text-gray-300 font-medium">Dashboard Preview Image</div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;