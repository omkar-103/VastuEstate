import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Heart, Search, MapPin, IndianRupee, Bed, Bath, ArrowUpRight, ShieldCheck, Zap, Crown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { user, updateUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      // Backend should include property details in user response or we fetch them
      const { data } = await axios.get('/api/properties'); // For demo, we filter from all approved
      const savedIds = user?.wishlist || [];
      setWishlist(data.filter(p => savedIds.includes(p._id)));
    } catch (err) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user.wishlist]);

  const removeWishlist = async (id) => {
    try {
      const newList = user.wishlist.filter(pid => pid !== id);
      await axios.put('/api/auth/profile', { wishlist: newList });
      updateUser({ wishlist: newList });
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const planIcons = {
    Free: ShieldCheck,
    Standard: Zap,
    Premium: Crown
  };
  const PlanIcon = planIcons[user.subscriptionPlan] || ShieldCheck;

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      {/* User Info Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 mb-12 shadow-xl"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/20">
            {user.name?.[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">{user.name}</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center md:text-right border-r border-slate-100 pr-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Plan</p>
            <div className="flex items-center gap-2 mt-1 justify-center md:justify-end">
              <PlanIcon className="text-blue-600" size={20} />
              <span className="text-2xl font-black uppercase italic">{user.subscriptionPlan}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Manage Subscription
          </button>
        </div>
      </motion.div>

      {/* Wishlist Section */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight italic">Saved <span className="text-red-500">Properties</span></h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Properties you liked</p>
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400">{wishlist.length} Items</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-64 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Heart size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold mb-2 uppercase">Your heart is empty</h3>
            <p className="text-slate-500 mb-8">Click the heart on any property to save it here.</p>
            <Link to="/properties" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Explore Now</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map(p => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={p._id} 
                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all"
              >
                <div className="relative h-48">
                  <img src={p.media?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <button 
                    onClick={() => removeWishlist(p._id)}
                    className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg mb-2 line-clamp-1">{p.title}</h4>
                  <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {p.location?.city}</span>
                    <span className="flex items-center gap-1"><IndianRupee size={14} /> {(p.price/100000).toFixed(1)}L</span>
                  </div>
                  <Link 
                    to={`/property/${p._id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-black uppercase tracking-widest text-[10px] group-hover:bg-blue-600 group-hover:text-white transition-all"
                  >
                    View Details <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
