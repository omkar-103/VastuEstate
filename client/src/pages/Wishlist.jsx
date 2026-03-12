import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MapPin, BedDouble, Bath, Square, ArrowRight, Trash2, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/wishlist', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setProperties(properties.filter(p => p._id !== id));
      toast.info('Removed from saved items');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const formatPrice = (p) => {
    if (!p) return '₹0';
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(2)} L`;
    return `₹${p.toLocaleString()}`;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user]);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-surface px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-4"
            >
              My Collection
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-black text-text-main leading-tight tracking-tighter"
            >
              Saved <span className="text-gradient">Luxuries</span>
            </motion.h1>
          </div>
          <div className="bg-white px-8 py-4 rounded-3xl shadow-premium border border-gray-100 flex items-center gap-4">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Items</span>
            <span className="text-3xl font-black text-primary">{properties.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-100 h-[450px] rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {properties.map((property, idx) => (
              <motion.div 
                key={property._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-premium group border border-gray-100 relative"
              >
                <button 
                  onClick={() => removeFromWishlist(property._id)}
                  className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/40 rounded-2xl flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-all shadow-xl"
                  title="Remove from wishlist"
                >
                  <Trash2 size={22} />
                </button>

                <Link to={`/properties/${property._id}`} className="block">
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={property.title}
                    />
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-gray-900/80 backdrop-blur rounded-full text-[10px] font-black uppercase text-white tracking-widest">
                      {property.type}
                    </div>
                    <div className="absolute bottom-6 left-6 bg-white text-gray-900 px-6 py-2 rounded-2xl font-black text-xl shadow-2xl">
                      {formatPrice(property.price)}
                    </div>
                  </div>
                  
                  <div className="p-10">
                    <h3 className="text-2xl font-black text-text-main group-hover:text-primary transition-colors line-clamp-1 mb-2">{property.title}</h3>
                    <div className="flex items-center text-gray-500 mb-8 font-bold text-sm gap-2">
                      <MapPin size={18} className="text-primary" />
                      <span className="truncate">{property.location.city}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                      <div className="flex gap-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Beds</span>
                          <div className="flex items-center gap-1 font-black text-gray-900">{property.bedrooms}</div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Baths</span>
                          <div className="flex items-center gap-1 font-black text-gray-900">{property.bathrooms}</div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sqft</span>
                          <div className="flex items-center gap-1 font-black text-gray-900">{property.area}</div>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight size={24} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-40 bg-white rounded-[3rem] border border-gray-100 shadow-premium"
          >
            <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-10 relative">
              <Heart size={80} className="text-gray-100" />
              <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Your wishlist is empty</h3>
            <p className="text-gray-400 font-bold max-w-sm mx-auto mb-10 text-lg">You haven't saved any master-pieces yet. Start exploring our featured listings.</p>
            <Link to="/properties" className="btn-primary">Explore All Properties</Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
