import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  IndianRupee, MapPin, Bed, Bath, Square, 
  Car, ShieldCheck, User, Building, Phone, 
  Mail, Calendar, Heart, Share2, Check, Lock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/properties/${id}`);
        setProperty(data);
      } catch (err) {
        toast.error('Property not found');
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const toggleWishlist = async () => {
    if (!user) return toast.info('Login to save properties');
    try {
      const wishlist = user.wishlist || [];
      const isSaved = wishlist.includes(property._id);
      const newWishlist = isSaved 
        ? wishlist.filter(pid => pid !== property._id)
        : [...wishlist, property._id];
        
      await axios.put('/api/auth/profile', { wishlist: newWishlist });
      updateUser({ wishlist: newWishlist });
      toast.success(isSaved ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const isLocked = () => {
    if (!property) return false;
    if (property.visibilityTier === 'Free') return false;
    if (!user) return true;
    if (user.subscriptionPlan === 'Premium') return false;
    if (user.subscriptionPlan === 'Standard' && property.visibilityTier === 'Standard') return false;
    return true;
  };

  if (loading) return (
    <div className="pt-32 flex justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="pt-24 pb-24 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery & Content */}
        <div className="lg:col-span-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[3rem] overflow-hidden shadow-2xl mb-12 relative h-[500px]">
            <img 
              src={property.media?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'} 
              className={`w-full h-full object-cover ${isLocked() ? 'blur-2xl px-20 scale-150 grayscale' : ''}`}
            />
            {isLocked() && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-white/90 dark:bg-slate-900/90 p-12 rounded-[3rem] text-center backdrop-blur-xl border border-white/20 shadow-2xl max-w-sm">
                  <Lock size={48} className="mx-auto mb-6 text-amber-500" />
                  <h3 className="text-2xl font-black uppercase mb-4 italic">Exclusive Content</h3>
                  <p className="text-slate-500 text-sm font-medium mb-8">This property is reserved for {property.visibilityTier} members.</p>
                  <button onClick={() => navigate('/pricing')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Unlock Now</button>
                </div>
              </div>
            )}
            <div className="absolute top-6 left-6 flex gap-3">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{property.type}</span>
              {property.isVerified && <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={12} /> Verified</span>}
            </div>
          </motion.div>

          {/* Info */}
          <div className="px-6">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tight italic mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-slate-500 font-bold">
                  <MapPin size={18} className="text-blue-600" />
                  <span>{property.location?.address}, {property.location?.city}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-blue-600 font-black text-4xl mb-1">
                  <IndianRupee size={24} strokeWidth={3} />
                  {Math.floor(property.price/100000)}L
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{property.priceType}</span>
                {property.brokerFee > 0 && (
                  <div className="text-sm font-black text-amber-600 uppercase mt-2 tracking-tighter">
                    + Brokerage: ₹{property.brokerFee.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Features Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-slate-100 dark:border-slate-800 mb-10">
              <FeatureItem icon={Bed} label="Bedrooms" value={`${property.features?.bedrooms || 0} BHK`} />
              <FeatureItem icon={Bath} label="Bathrooms" value={`${property.features?.bathrooms || 0} Baths`} />
              <FeatureItem icon={Square} label="Total Area" value={property.features?.area || 'N/A'} />
              <FeatureItem icon={Car} label="Parking" value={property.features?.parking ? `${property.features.parking} Cars` : 'None'} />
            </div>

            <h3 className="text-xl font-black uppercase tracking-tight italic mb-6">Description</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg mb-12">
              {property.description}
            </p>

            {property.amenities?.length > 0 && (
              <>
                <h3 className="text-xl font-black uppercase tracking-tight italic mb-6">Amenities</h3>
                <div className="flex flex-wrap gap-4 mb-12">
                  {property.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors hover:border-blue-500">
                      <Check className="text-blue-600" size={16} />
                      <span className="text-sm font-bold uppercase tracking-tight">{a}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Owner Card */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-8 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Listed By</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                <User size={32} />
              </div>
              <div>
                <p className="text-xl font-black uppercase italic">{property.owner?.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Building size={10} /> {property.owner?.company || 'Authorized Seller'}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <ContactBtn icon={Phone} label="Call Seller" value={property.owner?.phone} />
              <ContactBtn icon={Mail} label="Message" value={property.owner?.email} />
            </div>

            <button className="w-full py-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl">
              Inquire Now
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <button 
              onClick={toggleWishlist}
              className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${
                (user?.wishlist || []).includes(property._id) ? 'bg-red-500 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Heart size={16} fill={(user?.wishlist || []).includes(property._id) ? 'currentColor' : 'none'} /> 
              {(user?.wishlist || []).includes(property._id) ? 'Saved' : 'Save'}
            </button>
            <button className="flex-1 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, label, value }) => (
  <div className="text-center md:text-left">
    <Icon className="text-blue-600 mb-3 mx-auto md:mx-0" size={24} />
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
    <p className="font-black text-lg">{value}</p>
  </div>
);

const ContactBtn = ({ icon: Icon, label, value }) => (
  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-xs font-bold truncate max-w-[150px]">{value || 'Login to view'}</p>
    </div>
  </div>
);

export default PropertyDetail;
