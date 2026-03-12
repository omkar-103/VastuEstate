import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Calendar, Clock, MapPin, 
  ArrowUpRight, Users, User, Phone, 
  Mail, History, Package, Loader2,
  Trash2, ShieldCheck, TrendingUp
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [wishRes, tourRes] = await Promise.all([
        axios.get('http://localhost:5000/api/properties/wishlist'),
        axios.get('http://localhost:5000/api/tours/my-tours')
      ]);
      setWishlist(wishRes.data);
      setTours(tourRes.data);
    } catch (err) { console.error('Dash fetch failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clearWishlist = async () => {
    try {
      await axios.delete('http://localhost:5000/api/properties/wishlist/clear');
      toast.success('Wishlist cleared');
      setWishlist([]);
    } catch (err) { toast.error('Action failed'); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Profile Card */}
        <div className="luxury-card p-10 mb-12 flex flex-col lg:flex-row items-center justify-between gap-10 bg-emerald-600 text-white overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-[2.5rem] bg-white text-emerald-600 flex items-center justify-center text-4xl font-black italic shadow-2xl border-4 border-emerald-400/30">
              {user?.name?.substring(0,2).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30 backdrop-blur-md"> Investor Account </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user?.subscriptionPlan === 'Premium' ? 'bg-amber-400 border-amber-300 text-amber-900' : 'bg-emerald-700 border-emerald-500 text-white'}`}> {user?.subscriptionPlan} </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-2">{user?.name}</h1>
              <p className="text-emerald-100 font-bold flex items-center gap-2 opacity-80 uppercase tracking-widest text-xs">
                <Mail className="w-4 h-4" /> {user?.email} · Member since {new Date(user?.createdAt).getFullYear()}
              </p>
            </div>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 gap-4">
             <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 text-center min-w-[140px]">
                <div className="text-3xl font-black mb-1 leading-none">{wishlist.length}</div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Saves</div>
             </div>
             <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 text-center min-w-[140px]">
                <div className="text-3xl font-black mb-1 leading-none">{tours.length}</div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Visits</div>
             </div>
          </div>

          <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
          <Package className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-10 rotate-12" />
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Wishlist Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 italic">Personal Collection</div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic leading-none">Your <span className="text-emerald-600 not-italic">Wishlist.</span></h2>
              </div>
              {wishlist.length > 0 && (
                <button onClick={clearWishlist} className="text-[10px] font-black uppercase text-red-500 hover:tracking-[0.2em] transition-all flex items-center gap-2">
                  <Trash2 className="w-3 h-3" /> Purge Collection
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {loading ? (
                Array(2).fill(0).map((_, i) => <div key={i} className="h-40 luxury-card animate-pulse" />)
              ) : wishlist.length === 0 ? (
                <div className="col-span-full py-20 luxury-card bg-slate-100/50 dark:bg-slate-900/50 border-dashed border-2 text-center text-slate-400 font-bold italic">
                  Your portfolio is currently empty.
                </div>
              ) : (
                wishlist.map(item => (
                  <Link key={item._id} to={`/properties/${item._id}`} className="luxury-card group overflow-hidden flex flex-col hover:scale-[1.02] transition-all">
                    <div className="h-32 bg-slate-200 relative overflow-hidden">
                       <img src={item.media?.[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                       <div className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-900/80 rounded-xl backdrop-blur-md">
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                       </div>
                    </div>
                    <div className="p-5">
                       <h3 className="font-black text-slate-900 dark:text-white uppercase italic text-sm mb-1">{item.title}</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">₹{item.price?.toLocaleString()} · {item.location?.city}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Tour Requests Section */}
          <div className="space-y-8">
             <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 italic">Operations Log</div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic leading-none">Tour <span className="text-emerald-600 not-italic">Status.</span></h2>
             </div>

             <div className="space-y-4">
               {loading ? (
                 Array(3).fill(0).map((_, i) => <div key={i} className="h-24 luxury-card animate-pulse" />)
               ) : tours.length === 0 ? (
                 <div className="py-12 px-6 rounded-3xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 text-center font-bold italic text-slate-400 text-sm">
                   No active site visits scheduled.
                 </div>
               ) : (
                 tours.map(tour => (
                   <div key={tour._id} className="luxury-card p-5 group flex items-start gap-4 hover:border-emerald-500/50 transition-all">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
                         <Calendar className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-slate-900 dark:text-white uppercase italic text-xs leading-none">{tour.propertyId?.title || 'Property Tour'}</h4>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                              tour.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                              tour.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                              'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>{tour.status}</span>
                         </div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-2 italic">Scheduled: {new Date(tour.date).toLocaleDateString('en-GB')}</p>
                         <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time: {tour.timeSlot}</span>
                         </div>
                      </div>
                   </div>
                 ))
               )}
             </div>

             <div className="p-8 bg-slate-900 dark:bg-white rounded-[2.5rem] text-white dark:text-slate-900 relative overflow-hidden group">
                <div className="relative z-10">
                   <h3 className="font-black italic uppercase text-lg leading-tight mb-2">Exclusive High-Growth Real Estate Outlook.</h3>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-6">Expert curated investment insights delivered weekly.</p>
                   <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-2xl shadow-emerald-600/20">
                      Access Insight Portal <TrendingUp className="w-3 h-3" />
                   </button>
                </div>
                <ArrowUpRight className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-125 transition-transform" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
