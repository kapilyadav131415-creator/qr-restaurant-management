import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import { LogIn, ArrowRight, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  const scrollToSection = (sectionId: string) => {
    closeMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-sm border-b border-gray-100 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand / Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection("home")}
          >
            <img
              src={logo}
              alt="ByteMenu Logo"
              className="h-9 md:h-10 w-auto object-contain"
            />
            <div className="hidden md:flex flex-col leading-none justify-center">
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                QR <span className="text-red-600">Dine</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            {['Home', 'How It Works', 'Features', 'Pricing'].map((item, index) => {
               const sectionId = item.toLowerCase().replace(/\s+/g, '-');
               return (
                <button 
                  key={index} 
                  onClick={() => scrollToSection(sectionId === 'features' ? 'bento' : sectionId)} 
                  className="hover:text-red-600 transition-colors"
                >
                  {item}
                </button>
               )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-gray-700 font-bold px-4 py-2 hover:text-red-600 transition-colors text-sm"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex items-center justify-center p-2 text-gray-700 hover:text-red-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-[400px] py-4" : "max-h-0 py-0 border-transparent"
        }`}
      >
        <div className="flex flex-col px-6 space-y-4 text-sm font-bold text-gray-700">
          <button onClick={() => scrollToSection("home")} className="text-left w-full hover:text-red-600 transition">Home</button>
          <button onClick={() => scrollToSection("how-it-works")} className="text-left w-full hover:text-red-600 transition">How It Works</button>
          <button onClick={() => scrollToSection("features")} className="text-left w-full hover:text-red-600 transition">Features</button>
          <button onClick={() => scrollToSection("pricing")} className="text-left w-full hover:text-red-600 transition">Pricing</button>
          
          <div className="h-px w-full bg-gray-100 my-2"></div>
          
          <button
            onClick={() => { closeMenu(); navigate("/login"); }}
            className="flex items-center justify-center gap-2 w-full bg-gray-50 border border-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Login
          </button>
          <button
            onClick={() => { closeMenu(); navigate("/register"); }}
            className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
          >
            Get Started Free
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;