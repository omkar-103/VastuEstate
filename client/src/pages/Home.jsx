import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, House, Building2, MapPin, ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-black uppercase tracking-[0.3em] mb-6">
              Premium Real Estate Platform
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
              FIND YOUR <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">DREAM ESTATE.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
              VastuEstate connects you with the most exclusive properties across India. 
              Verified listings, secure payments, and seamless experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/properties')}
                className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 group"
              >
                Explore Properties
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/pricing')}
                className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                View Plans
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 left-0 right-0 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-white/50 text-[10px] font-bold uppercase tracking-[0.5em]">
            <span>12,000+ PROPERTIES</span>
            <span>45+ CITIES</span>
            <span>99.9% VERIFIED</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white dark:bg-slate-950 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={ShieldCheck} 
              title="Verified Owners" 
              desc="Every owner on our platform goes through a strict verification process."
              color="blue"
            />
            <FeatureCard 
              icon={Zap} 
              title="Quick Search" 
              desc="Our advanced filters help you find the perfect match in seconds."
              color="indigo"
            />
            <FeatureCard 
              icon={Heart} 
              title="Premium Support" 
              desc="Dedicated support team to help you with your property journey."
              color="emerald"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
    <div className={`w-16 h-16 rounded-2xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <Icon size={32} className={`text-${color}-600 dark:text-${color}-400`} />
    </div>
    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
      {desc}
    </p>
  </div>
);

export default Home;
