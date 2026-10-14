import React, { useState, useEffect } from 'react';
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import About from "../components/landing/About";
import Footer from "../components/landing/Footer";
import Pricing from "../components/landing/Pricing";
import Customization from "../components/landing/Customization";
import Showcase from "../components/landing/Showcase";
import BusinessTypes from "../components/landing/BusinessTypes";
import BentoFeatures from "../components/landing/BentoFeatures";
import Contact from "../components/landing/contact";
import Loader from "../components/landing/Loader"; // Import the new loader

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (e.g., 2.5 seconds)
    // In a real app, you might wait for images or API calls to finish here
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); 

    return () => clearTimeout(timer);
  }, []);

  // Show the loader while loading
  if (isLoading) {
    return <Loader />;
  }

  // Once loading is false, show the actual landing page with a smooth fade-in
  return (
    <div className="bg-gray-50 text-gray-800 animate-[fadeIn_0.5s_ease-in-out]">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Customization/>
      <Showcase/>
      <BusinessTypes/>
      <BentoFeatures/>
      <Pricing />
      <Contact/>
      <Footer />
      
      {/* Add a quick fade-in animation for the main page */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;