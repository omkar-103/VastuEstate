import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, XCircle, Home, IndianRupee, 
  Trash2, Plus, ArrowUpRight, BarChart3, Star, 
  MapPin, ShieldAlert, Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/properties/my/all');
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axios.delete(`/api/properties/${id}`);
      setProperties(properties.filter(p => p._id !== id));
      toast.success('Property removed');
    } catch (err) {
      toast.error('Failed to delete property');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="text-emerald-500" size={18} />;
      case 'Pending':  return <Clock className="text-amber-500" size={18} />;
      case 'Rejected': return <XCircle className="text-red-500" size={18} />;
      default: return null;
    }
  };

  const stats = [
    { label: 'Total Listings', value: properties.length, icon: Home, color: 'blue' },
    { label: 'Approved', value: properties.filter(p => p.status === 'Approved').length, icon: CheckCircle, color: 'emerald' },
    { label: 'Pending Review', value: properties.filter(p => p.status === 'Pending').length, icon: Clock, color: 'amber' },
    { label: 'Total Enquiries', value: properties.reduce((s, p) => s + (p.enquiryCount || 0), 0), icon: Zap, color: 'indigo' },
  ];

  if (loading) return (
    <div className="pt-32 flex justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Owner Dashboard
          </h1>
          <p className="text-slate-500 flex items-center gap-2">
            Welcome back, <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
            {user.isVerified && <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Verified</span>}
          </p>
        </div>
        <Link 
          to="/owner/add-property"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} /> List New Property
        </Link>
      </div>

      {!user.isVerified && (
        <div className="mb-12 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-3xl flex items-start gap-4">
          <ShieldAlert className="text-amber-600 shrink-0" />
          <div>
            <h4 className="font-bold text-amber-800 dark:text-amber-400">Account Pending Verification</h4>
            <p className="text-sm text-amber-700/80 dark:text-amber-500/80 mt-1">
              Your listings will not be visible to users until an admin verifies your identity documents. 
              This usually takes 24-48 hours.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={s.label}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${s.color}-100 dark:bg-${s.color}-900/30 flex items-center justify-center mb-4`}>
              <s.icon className={`text-${s.color}-600 dark:text-${s.color}-400`} size={24} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
            <h3 className="text-3xl font-black mt-1">{s.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Property List */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase tracking-tight">Your Listings</h2>
          <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            {properties.length} Total Properties
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">No listings yet</h3>
            <p className="text-slate-500 mb-8">Start by adding your first property for the world to see.</p>
            <Link to="/owner/add-property" className="text-blue-600 font-bold hover:underline uppercase tracking-widest text-sm">
              Create First Listing →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Property</th>
                  <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500 text-center">Price</th>
                  <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500 text-center">Status</th>
                  <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500 text-center">Enquiries</th>
                  <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {properties.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={p.media?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'} 
                          className="w-16 h-16 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-bold line-clamp-1">{p.title}</p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-black tracking-tighter mt-1">
                            <MapPin size={10} /> {p.location?.city} • {p.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-0.5 font-bold text-slate-800 dark:text-slate-200">
                        <IndianRupee size={14} />
                        {Math.floor(p.price/100000)}L
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full inline-flex font-black text-[10px] uppercase tracking-widest mx-auto">
                        {getStatusIcon(p.status)}
                        <span className={
                          p.status === 'Approved' ? 'text-emerald-600' :
                          p.status === 'Pending' ? 'text-amber-600' : 'text-red-500'
                        }>
                          {p.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="font-bold text-slate-600 dark:text-slate-400">{p.enquiryCount || 0}</span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/property/${p._id}`} className="p-2 hover:text-blue-600 transition-colors">
                          <ArrowUpRight size={20} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p._id)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
