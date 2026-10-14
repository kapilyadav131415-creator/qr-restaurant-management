const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden font-sans">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-md">
                <span className="font-bold text-white text-xl">Q</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-white">
                QR <span className="text-red-500">Dine</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm font-medium">
              Smart QR-based restaurant management solution for the digital age. 
              Empowering restaurants to serve smarter, faster, and better.
            </p>
            <div className="flex gap-4">
              {['FB', 'TW', 'IG', 'LI'].map((icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200">
                  {icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="text-sm font-bold mb-6 text-white uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition">How it Works</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#integrations" className="hover:text-white transition">Integrations</a></li>
              <li><a href="#changelog" className="hover:text-white transition">Changelog</a></li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="text-sm font-bold mb-6 text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#about" className="hover:text-white transition">About Us</a></li>
              <li><a href="#blog" className="hover:text-white transition">Blog</a></li>
              <li><a href="#careers" className="hover:text-white transition">Careers</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              <li><a href="#partners" className="hover:text-white transition">Partners</a></li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-bold mb-6 text-white uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#privacy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#cookies" className="hover:text-white transition">Cookie Policy</a></li>
              <li><a href="#security" className="hover:text-white transition">Security</a></li>
              <li><a href="#gdpr" className="hover:text-white transition">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500">
          <p>© {new Date().getFullYear()} QR Dine. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;