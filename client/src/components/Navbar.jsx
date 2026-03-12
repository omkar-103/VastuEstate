import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, LayoutDashboard, LogOut, Menu, X, Sun, Moon, CreditCard, Building, ShieldCheck, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' 
                      : user?.role === 'owner' ? '/owner/dashboard' 
                      : '/dashboard';

  const NavLink = ({ to, children, icon: Icon }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
          active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
            : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
        }`}
      >
        <Icon size={18} />
        <span className="font-medium">{children}</span>
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-slate-800 py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-500/40">
              <Home className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              VastuEstate
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/properties" icon={Search}>Properties</NavLink>
            <NavLink to="/pricing" icon={CreditCard}>Pricing</NavLink>
            
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-slate-800 mx-2" />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4 ml-4">
                {/* ── THE BADGE FIX: Only show Plan for regular users ── */}
                {user.role === 'user' && (
                  <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-800 animate-pulse">
                    {(user.subscriptionPlan || 'Free').toUpperCase()} PLAN
                  </div>
                )}
                {user.role === 'admin' && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-800">
                    <ShieldCheck size={12} /> ADMIN PORTAL
                  </div>
                )}
                {user.role === 'owner' && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                    <Building size={12} /> OWNER PORTAL
                  </div>
                )}

                <Link to={dashboardLink} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-9 h-9 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
                    <UserIcon size={20} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{user.role}</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login" className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Btn */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 dark:text-slate-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <NavLink to="/" icon={Home}>Home</NavLink>
              <NavLink to="/properties" icon={Search}>Properties</NavLink>
              <NavLink to="/pricing" icon={CreditCard}>Pricing</NavLink>
              <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
                {user ? (
                  <>
                    <Link to={dashboardLink} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <UserIcon className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-slate-500 uppercase">{user.role}</p>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
                    >
                      <LogOut size={20} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 text-center rounded-xl bg-gray-100 dark:bg-slate-800 font-bold">Login</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="px-4 py-3 text-center rounded-xl bg-blue-600 text-white font-bold">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
