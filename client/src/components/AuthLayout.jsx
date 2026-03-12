import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-24">
        <Link to="/" className="flex items-center gap-2 mb-12 group">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">V</div>
          <span className="text-sm font-bold tracking-tighter text-slate-900 dark:text-white uppercase italic group-hover:text-emerald-600 transition-colors">
            VastuEstate
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">
            {subtitle}
          </p>

          <div className="glass-card p-1 dark:p-1 overflow-hidden rounded-[2.5rem]">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.3rem] shadow-sm">
              {children}
            </div>
          </div>
        </motion.div>

        <p className="mt-8 text-sm text-slate-500 font-medium">
          © 2024 VastuEstate India. Premium Luxury Assets.
        </p>
      </div>

      {/* Right side: Visual (Luxury Image) */}
      <div className="hidden lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070"
          alt="Luxury Mansion"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute bottom-20 left-20 z-20 max-w-lg">
          <h2 className="text-5xl font-black text-white mb-4 leading-tight italic">
            Secure Your <span className="text-emerald-400">Legacy.</span>
          </h2>
          <p className="text-white/80 text-lg font-medium">
            Join India's most exclusive network of high-net-worth real estate investors and property owners.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
