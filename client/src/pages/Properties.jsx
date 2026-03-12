import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Home as HomeIcon, IndianRupee, BedDouble, Bath, Square, Car, Heart, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Properties = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', type: '', minPrice: '', maxPrice: '', bedrooms: '', sortBy: 'newest' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/properties', { params: filters });
      setProperties(Array.isArray(data.properties) ? data.properties : (Array.isArray(data) ? data : []));
    } catch (err) {
      toast.error('Failed to load properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const toggleWishlist = async (id) => {
    if (!user) return toast.info('Login to save properties');
    try {
      const wishlist = user.wishlist || [];
      const isSaved = wishlist.includes(id);
      const newWishlist = isSaved 
        ? wishlist.filter(pid => pid !== id)
        : [...wishlist, id];
        
      await axios.put('/api/auth/profile', { wishlist: newWishlist });
      updateUser({ wishlist: newWishlist });
      toast.success(isSaved ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by city (e.g. Mumbai, Pune)..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-4 rounded-2xl border transition-all ${
            showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Filter size={20} />
          <span className="font-semibold">Filters</span>
        </button>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Property Type</label>
                <select 
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border"
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Plot">Plot</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Min Price (₹)</label>
                <input 
                  type="number" className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border"
                  placeholder="Min" value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Bedrooms</label>
                <input 
                  type="number" className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border"
                  placeholder="3+" value={filters.bedrooms}
                  onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Sort By</label>
                <select 
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-[450px] rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold">No properties found</h3>
          <p className="text-slate-500">Try adjusting your filters or search city.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => {
            const isLocked = property._isLocked;
            const isSaved = (user?.wishlist || []).includes(property._id);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={property._id}
                className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.media?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'}
                    alt={property.title}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLocked ? 'blur-md grayscale' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      property.visibilityTier === 'Premium' ? 'bg-amber-500 text-white' : 
                      property.visibilityTier === 'Standard' ? 'bg-blue-500 text-white' : 'bg-slate-500/80 text-white'
                    }`}>
                      {property.visibilityTier}
                    </span>
                    {property.isVerified && (
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle size={10} /> VERIFIED
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleWishlist(property._id)}
                    className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all ${
                      isSaved ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
                    }`}
                  >
                    <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mt-1">
                        <MapPin size={14} />
                        <span className="text-sm">{property.location?.city}, {property.location?.state}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-black text-xl">
                        <IndianRupee size={18} strokeWidth={3} />
                        {property.price?.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                        {property.priceType || 'For Sale'}
                      </span>
                      {property.brokerFee > 0 && (
                        <div className="text-[10px] text-amber-600 font-black uppercase mt-1">
                          + ₹{property.brokerFee.toLocaleString()} Broker Fee
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-center p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                      <BedDouble size={18} className="text-blue-500 mb-1" />
                      <span className="text-xs font-bold">{property.features?.bedrooms || 0} BHK</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                      <Bath size={18} className="text-indigo-500 mb-1" />
                      <span className="text-xs font-bold">{property.features?.bathrooms || 0} Bath</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                      <Square size={18} className="text-emerald-500 mb-1" />
                      <span className="text-xs font-bold truncate w-full text-center">{property.features?.area || 'N/A'}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  {isLocked ? (
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <Lock size={18} />
                        <span className="text-xs font-bold uppercase">Upgrade Required</span>
                      </div>
                      <button 
                        onClick={() => navigate('/pricing')}
                        className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                      >
                        Unlock Now
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => navigate(`/property/${property._id}`)}
                      className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-1"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Properties;
