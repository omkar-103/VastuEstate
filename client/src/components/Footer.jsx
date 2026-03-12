import React from 'react';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#040c0d] text-white pt-40 pb-16 mt-40 relative overflow-hidden border-t border-white/5">
      {/* Energy Flow lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-28">
          
          <div className="md:col-span-5 space-y-10">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110">
                <Sparkles size={32} />
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black tracking-tighter leading-none">VastuEstate</span>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mt-1 italic">Built by Swayam Elite</span>
              </div>
            </Link>
            <p className="text-gray-500 font-bold leading-relaxed text-xl max-w-md">
              India's first technology-enabled real estate experience centered around geometric balance and spiritual prosperity.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-white/10 cursor-pointer transition-all border border-white/5">
                  <Icon size={22} />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Explore</h4>
            <ul className="space-y-6 text-gray-500 font-black text-xs uppercase tracking-widest">
              <li><Link to="/properties" className="hover:text-white transition-colors">Mumbai Coast</Link></li>
              <li><Link to="/properties" className="hover:text-white transition-colors">Delhi Palaces</Link></li>
              <li><Link to="/properties" className="hover:text-white transition-colors">Bangalore Silicon</Link></li>
              <li><Link to="/properties" className="hover:text-white transition-colors">Coastal Luxury</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Philosophy</h4>
            <ul className="space-y-6 text-gray-500 font-black text-xs uppercase tracking-widest">
              <li><Link to="#" className="hover:text-white transition-colors">Vastu Guide</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Title Check</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Energy Audit</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Legal Shield</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-8 p-10 bg-white/5 rounded-[3rem] border border-white/10 shadow-inner">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Concierge</h4>
            <ul className="space-y-8 text-gray-400 font-bold text-sm">
              <li className="flex items-start gap-5">
                <MapPin className="text-primary mt-1 shrink-0" size={24} /> 
                <span className="leading-tight">Level 12, Tower C, <br />BKC, Mumbai 400051</span>
              </li>
              <li className="flex items-center gap-5">
                <Phone className="text-primary shrink-0" size={24} /> 
                <span>+91 99999 00001</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-600 text-[10px] font-black tracking-[0.3em] gap-8 uppercase">
          <p>© 2026 VastuEstate. Engineered with ❤️ by <span className="text-white hover:text-primary transition-colors cursor-pointer">Swayam</span></p>
          <div className="flex gap-10">
            <span className="cursor-pointer hover:text-white transition-colors">Privacy Shield</span>
            <span className="cursor-pointer hover:text-white transition-colors">Energy Protocol</span>
            <span className="cursor-pointer hover:text-white transition-colors flex items-center gap-3">
              Elite Member <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
