import React from "react";

const steps = [
  {
    step: "01",
    title: "Onboard & Setup",
    desc: "Reach out and get onboarded in minutes. Our team helps you integrate QR Dine with your existing operations seamlessly.",
    img: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=800",
  },
  {
    step: "02",
    title: "Digitize & Customize",
    desc: "Create your digital menu. Add mouth-watering photos, manage modifiers, update prices, and tweak categories in real-time.",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
  },
  {
    step: "03",
    title: "Launch & Scale",
    desc: "Customers scan the QR, browse the menu in their native language, and order instantly. Watch your average ticket size soar.",
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=800",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="relative py-28 lg:py-36 bg-white overflow-hidden font-sans border-b border-gray-100">
      
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-gray-700 text-[11px] font-bold uppercase tracking-widest mb-4 bg-gray-100 px-3 py-1 rounded-md">
            Implementation Pipeline
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.15]">
            From concept to live in <br className="hidden md:block" />
            <span className="text-red-600">
              under 24 hours.
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
            We’ve engineered the deployment process to be as frictionless as possible. 
            No hardware installation, no downtime.
          </p>
        </div>

        {/* Workflow Cards */}
        <div className="relative">
          {/* Connecting line (visible on desktop) */}
          <div className="hidden lg:block absolute top-[112px] left-[10%] right-[10%] h-[2px] bg-gray-200 z-0"></div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-56 rounded-xl overflow-hidden mb-6 bg-gray-100 border border-gray-100">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Floating Pill Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-white px-3 py-1 rounded-md text-[10px] font-bold tracking-widest text-gray-900 shadow-sm border border-gray-200">
                    STEP {item.step}
                  </div>
                </div>

                {/* Text Content */}
                <div className="px-2 pb-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;