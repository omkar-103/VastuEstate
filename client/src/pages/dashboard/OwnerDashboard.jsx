import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Plus, LayoutGrid, ScrollText, 
  MessageSquare, TrendingUp, CheckCircle2, Clock, 
  AlertTriangle, ArrowUpRight, Loader2, Eye, Edit3
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [propRes, statRes] = await Promise.all([
        axios.get('http://localhost:5000/api/properties/my-properties'),
        axios.get('http://localhost:5000/api/properties/my-stats')
      ]);
      setData(propRes.data);
      setStats(statRes.data);
    } catch (err) { console.error('Owner fetch failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const tabs = [
    { id: 'properties', label: 'My Estates', icon: <Building2 className="w-4 h-4" /> },
    { id: 'proposals', label: 'Proposals', icon: <ScrollText className="w-4 h-4" /> },
    { id: 'enquiries', label: 'Investor Leads', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-3">
              <CheckCircle2 className="w-4 h-4" /> Verified Partner Terminal
            </div>
            <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">
              Asset <span className="text-emerald-600 not-italic">Manager.</span>
            </h1>
            <p className="mt-4 text-slate-500 font-bold italic text-lg leading-relaxed">
              Welcome back, {user?.name}. Oversee your portfolio and respond to high-intent investor inquiries.
            </p>
          </div>
          
          <Link to="/properties/add" className="btn-primary h-16 px-10 flex items-center gap-3 shadow-2xl shadow-emerald-600/20 group">
             New Proposal <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
           {[
             { label: 'Total Assets', value: stats?.totalProperties || 0, icon: <LayoutGrid />, color: 'text-emerald-500' },
             { label: 'Active Leads', value: stats?.totalEnquiries || 0, icon: <MessageSquare />, color: 'text-blue-500' },
             { label: 'Verified Revenue', value: stats?.totalRevenue || '₹0', icon: <TrendingUp />, color: 'text-amber-500' },
           ].map((s, i) => (
             <div key={i} className="luxury-card p-8 group hover:border-emerald-500/50">
               <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 ${s.color} inline-block mb-4 transition-transform group-hover:scale-110`}>{s.icon}</div>
               <div className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tight mb-2">{s.value}</div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</div>
             </div>
           ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-2xl' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="luxury-card overflow-hidden">
           {loading ? (
             <div className="py-40 text-center">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Syncing Portfolio Data...</p>
             </div>
           ) : data.length === 0 ? (
             <div className="py-32 text-center">
                <Building2 className="w-20 h-20 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic mb-2">Portfolio Empty</h3>
                <p className="text-slate-500 font-medium mb-8">Ready to list your first luxury property?</p>
                <Link to="/properties/add" className="text-emerald-600 font-black uppercase tracking-widest text-sm hover:underline">Submit Your First Proposal →</Link>
             </div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Property Details</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Verification / Tier</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Leads</th>
                         <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {data.map(item => (
                         <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-16 h-12 rounded-xl bg-slate-200 overflow-hidden shadow-lg">
                                     <img src={item.media?.[0]} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                     <div className="text-sm font-black text-slate-900 dark:text-white uppercase italic leading-none mb-1">{item.title}</div>
                                     <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{item.location?.city} · ₹{item.price?.toLocaleString()}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border inline-block ${item.visibilityTier === 'Premium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                  {item.visibilityTier} Exposure
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${item.status === 'Approved' ? 'bg-emerald-500 animate-pulse' : item.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                  <span className="text-[10px] font-black uppercase text-slate-400">{item.status}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-1 font-black text-slate-900 dark:text-white italic">
                                  {item.enquiryCount || 0} <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex justify-end gap-2">
                                  <Link to={`/properties/${item._id}`} className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 rounded-xl transition-all"><Eye className="w-4 h-4" /></Link>
                                  <button className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-500 rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}
        </div>

        {/* Insight Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
           <div className="bg-slate-900 text-white p-10 rounded-[3rem] relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-xl font-black uppercase italic mb-4 leading-tight">Increase Exposure by 300% with Premium Tier.</h4>
                 <p className="text-sm font-medium opacity-60 mb-8 max-w-sm">Premium listings are featured at the top of search results and unlocked for all high-net-worth investors.</p>
                 <button className="px-8 py-4 bg-emerald-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">Upgrade Listing Exposure</button>
              </div>
              <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 group-hover:scale-125 transition-all" />
           </div>

           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem]">
              <div className="flex gap-4 items-center mb-6">
                 <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white"><AlertTriangle /></div>
                 <div>
                    <h4 className="font-black uppercase italic leading-none text-slate-900 dark:text-white">Partner Policy</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strict Verification protocol</p>
                 </div>
              </div>
              <p className="text-sm font-bold text-slate-500 italic leading-relaxed">Ensure all property documentation (Aadhaar/GST/Property Papers) is uploaded correctly to avoid terminal suspension. For support, contact partner@vastuestate.com.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
