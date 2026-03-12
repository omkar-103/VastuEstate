import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Upload, X, MapPin, IndianRupee, Bed, Bath, Square, Car, Trash2, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', priceType: 'sale',
    address: '', city: '', state: '', pincode: '',
    type: 'Residential', bedrooms: '', bathrooms: '', area: '', parking: '',
    amenities: '', media: [], brokerFee: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        // map media to mediaUrls as expected by propertyController
        mediaUrls: formData.media
      };
      await axios.post('/api/properties', payload);
      toast.success('Listing submitted for review!');
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit property');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaAdd = () => {
    const url = window.prompt('Enter Image URL (Unsplash/Cloudinary):');
    if (url) setFormData({ ...formData, media: [...formData.media, url] });
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl"
      >
        <h1 className="text-4xl font-black uppercase tracking-tight mb-8 italic">Add <span className="text-blue-600">Listing</span></h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Basic Information</h3>
            <input 
              required placeholder="Property Title"
              className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
            />
            <textarea 
              required placeholder="Detailed Description" rows="4"
              className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" required placeholder="Price"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <select 
                className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Plot">Plot</option>
              </select>
            </div>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="number" placeholder="Broker Fee (Leave 0 if direct)"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.brokerFee} onChange={e => setFormData({...formData, brokerFee: e.target.value})}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Location Detailed</h3>
            <input 
              required placeholder="Full Address"
              className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
            />
            <div className="grid grid-cols-3 gap-4">
              <input required placeholder="City" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none" 
                value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              <input placeholder="State" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none" 
                value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
              <input placeholder="Pincode" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none" 
                value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Key Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative">
                <Bed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="number" placeholder="BHK" className="w-full pl-10 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none" 
                  value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} />
              </div>
              <div className="relative">
                <Bath className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="number" placeholder="Baths" className="w-full pl-10 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none" 
                  value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
              </div>
              <div className="relative">
                <Square className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input placeholder="Area" className="w-full pl-10 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none" 
                  value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
              </div>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="number" placeholder="Parking" className="w-full pl-10 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none" 
                  value={formData.parking} onChange={e => setFormData({...formData, parking: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Media & Images</h3>
            <div className="flex flex-wrap gap-4">
              {formData.media.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden group">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                  <button 
                    onClick={() => setFormData({...formData, media: formData.media.filter((_, idx) => idx !== i)})}
                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button 
                type="button" onClick={handleMediaAdd}
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'Submit for Review'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProperty;
