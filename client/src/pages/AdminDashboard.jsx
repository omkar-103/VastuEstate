import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Building, IndianRupee, PieChart, 
  Clock, CheckCircle, XCircle, ShieldCheck, 
  Trash2, Search, ExternalLink, ChevronDown, 
  UserPlus, MapPin, Eye, Building2
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('proposals');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, pRes, oRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/proposals/pending'),
        axios.get('/api/admin/owners'),
      ]);
      setStats(sRes.data);
      setProposals(pRes.data);
      setOwners(oRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id, tier = 'Free') => {
    try {
      await axios.patch(`/api/admin/proposals/${id}/approve`, { visibilityTier: tier });
      toast.success('Property approved!');
      fetchData();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id) => {
    const note = window.prompt('Reason for rejection:');
    if (note === null) return;
    try {
      await axios.patch(`/api/admin/proposals/${id}/reject`, { adminNote: note });
      toast.success('Property rejected');
      fetchData();
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  const verifyOwner = async (id) => {
    try {
      await axios.patch(`/api/admin/owners/${id}/verify`);
      toast.success('Owner verified');
      fetchData();
    } catch (err) {
      toast.error('Verification failed');
    }
  };

  if (loading || !stats) return (
    <div className="pt-32 flex justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-2 uppercase italic flex items-center gap-3">
          <ShieldCheck className="text-blue-600" size={36} /> Control Center
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Global Overview & Action Panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="blue" />
        <StatCard label="Live Ads" value={stats.totalProperties} icon={Building} color="emerald" />
        <StatCard label="Pending" value={stats.pendingProposals} icon={Clock} color="amber" highlight />
        <StatCard label="Revenue" value={`₹${stats.totalRevenue?.toLocaleString()}`} icon={IndianRupee} color="indigo" />
      </div>

      {/* Main Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-slate-800">
          <TabBtn active={activeTab === 'proposals'} onClick={() => setActiveTab('proposals')} icon={Building2} label="Proposals" count={proposals.length} />
          <TabBtn active={activeTab === 'owners'} onClick={() => setActiveTab('owners')} icon={UserPlus} label="Verify Owners" count={owners.filter(o => !o.isVerified).length} />
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'proposals' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="props">
                <h3 className="text-xl font-black mb-8 uppercase tracking-tight">Property Proposals</h3>
                {proposals.length === 0 ? (
                  <EmptyState msg="No pending property proposals" />
                ) : (
                  <div className="space-y-6">
                    {proposals.map(p => (
                      <div key={p._id} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-1">
                          <img src={p.media?.[0]} className="w-16 h-16 rounded-2xl object-cover" />
                        </div>
                        <div className="lg:col-span-4">
                          <h4 className="font-bold line-clamp-1">{p.title}</h4>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mt-1 tracking-tighter">
                            By {p.owner?.name} ({p.owner?.company || 'Indep.'})
                          </span>
                        </div>
                        <div className="lg:col-span-2 text-center">
                          <p className="text-xs font-bold text-slate-500 uppercase">Valuation</p>
                          <p className="font-black text-blue-600">₹{(p.price/100000).toFixed(1)}L</p>
                        </div>
                        <div className="lg:col-span-5 flex flex-wrap gap-2 justify-end">
                          <TierBtn tier="Free" onClick={() => handleApprove(p._id, 'Free')} />
                          <TierBtn tier="Standard" onClick={() => handleApprove(p._id, 'Standard')} variant="blue" />
                          <TierBtn tier="Premium" onClick={() => handleApprove(p._id, 'Premium')} variant="amber" />
                          <button onClick={() => handleReject(p._id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl transition-all">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="owners">
                <h3 className="text-xl font-black mb-8 uppercase tracking-tight">Owner Verification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {owners.map(o => (
                    <div key={o._id} className="p-6 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <div>
                        <p className="font-black">{o.name}</p>
                        <p className="text-xs text-slate-500 uppercase">{o.company || 'Private Seller'}</p>
                        {!o.isVerified && (
                          <div className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full inline-block">
                             ID PENDING
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!o.isVerified && (
                          <button 
                            onClick={() => verifyOwner(o._id)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                          >
                            Verify
                          </button>
                        )}
                        <button className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-500"><Eye size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, highlight }) => (
  <div className={`bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 transition-all ${highlight ? 'border-blue-500 shadow-blue-500/10' : 'border-slate-100 dark:border-slate-800'}`}>
    <div className={`w-14 h-14 rounded-2xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mb-6`}>
      <Icon className={`text-${color}-600 dark:text-${color}-400`} size={28} />
    </div>
    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{label}</p>
    <h3 className="text-4xl font-black mt-1 tracking-tighter">{value}</h3>
  </div>
);

const TabBtn = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-3 py-6 font-black uppercase tracking-widest text-xs transition-all border-b-2 ${
      active ? 'border-blue-600 text-blue-600 bg-blue-50/10' : 'border-transparent text-slate-400 hover:text-slate-600'
    }`}
  >
    <Icon size={18} />
    {label} {count > 0 && <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px]">{count}</span>}
  </button>
);

const TierBtn = ({ tier, onClick, variant = 'slate' }) => {
  const colors = {
    slate: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
    blue:  'bg-blue-100 dark:bg-blue-900/40 text-blue-600 py-2.5',
    amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600',
  };
  return (
    <button onClick={onClick} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${colors[variant || 'slate']} transition-transform hover:scale-105 active:scale-95`}>
      Approve {tier}
    </button>
  );
};

const EmptyState = ({ msg }) => (
  <div className="py-20 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
    <ShieldCheck size={48} className="mx-auto mb-4 opacity-20" />
    <p className="font-bold uppercase tracking-widest text-xs">{msg}</p>
  </div>
);

export default AdminDashboard;
