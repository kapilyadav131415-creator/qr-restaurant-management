import React, { useState } from 'react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    businessType: 'Restaurant',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you! We will get back to you soon.');
  };

  return (
    <section id="contact" className="py-24 bg-white relative font-sans border-t border-gray-100 flex justify-center">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Main Background Banner */}
        <div className="relative bg-gray-50 rounded-2xl border border-gray-200 p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 md:pr-[420px]">
          
          {/* Left Side Content */}
          <div className="flex-1 relative z-10">
            <span className="inline-block px-3 py-1 mb-6 text-[11px] font-bold tracking-widest text-gray-700 uppercase bg-white rounded-md shadow-sm border border-gray-200">
              Get In Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.15]">
              Ready to create your own <br className="hidden md:block" /> 
              <span className="text-red-600">
                digital QR menu?
              </span>
            </h2>
            
            <p className="text-gray-600 text-lg font-medium leading-relaxed mb-6">
              Transform your menu and reach out to us — we'll set everything up for you. 
              Whether you need a simple QR menu or full-service management, we've got you covered.
            </p>

            <p className="text-gray-900 font-bold text-sm md:text-base mb-8">
              Reach us today and take the first step toward a smarter, more engaging menu!
            </p>

            <a 
              href="tel:+971527565719" 
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-md"
            >
              <span>📞</span> Call Us: +971 52 756 57 19
            </a>

            {/* Hand-drawn Red Arrow SVG (Visible on Desktop) */}
            <div className="hidden lg:block absolute right-[-80px] top-[40%] text-red-600 w-16 h-16">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
                <path d="M10 60 C 30 20, 60 10, 90 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M75 35 L 90 40 L 85 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          </div>

          {/* Right Side Form Card (Floating Overlap on Desktop) */}
          <div className="w-full md:absolute md:right-10 md:top-1/2 md:-translate-y-1/2 md:w-[420px] bg-white rounded-2xl shadow-xl border border-gray-100 p-8 z-20">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
              Let's Talk Your Menu!
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Name */}
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="My Business"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition bg-gray-50/50"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@yourbusiness.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition bg-gray-50/50"
                />
              </div>

              {/* Phone Number (With Flag Prefix) */}
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Phone Number</label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition bg-gray-50/50">
                  <div className="flex items-center gap-1.5 px-3 bg-gray-100/50 border-r border-gray-200">
                    <span className="text-base drop-shadow-sm">🇦🇪</span>
                    <span className="text-xs font-bold text-gray-700">+971</span>
                    <span className="text-gray-400 text-[10px] ml-1">▼</span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="X XXXX XXXX XXXX"
                    required
                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Your Business</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition bg-gray-50/50 text-gray-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:10px_10px]"
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Cafe">Café</option>
                  <option value="Hotel">Hotel</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">How Can We Help You?</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your needs..."
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition bg-gray-50/50 resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-bold py-4 rounded-lg text-sm shadow-md hover:bg-red-700 transform hover:-translate-y-0.5 active:scale-[0.98] transition-all mt-6"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default ContactUs;