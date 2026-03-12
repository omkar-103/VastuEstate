import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Users, Building2, CreditCard, ShieldCheck, Trash2, CheckCircle2,
  XCircle, Filter, Search, Loader2, ArrowUpRight, TrendingUp,
  LayoutGrid, ScrollText, AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(res.data);
    } catch (err) { toast.error('Failed to load stats'); }
  };

  const fetchTabData = async (tab) => {
    setLoading(true);
    try {
      const endpoints = {
        users: '/api/admin/users',
        owners: '/api/admin/owners',
        properties: '/api/admin/properties',
        proposals: '/api/admin/proposals',
        payments: '/api/admin/payments'
      };
      if (endpoints[tab]) {
        const res = await axios.get(`http://localhost:5000${endpoints[tab]}`);
        setData(res.data);
      }
    } catch (err) { toast.error(`Failed to load ${tab}`); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStats();
    if (activeTab !== 'stats') fetchTabData(activeTab);
    else setLoading(false);
  }, [activeTab]);

  const handleAction = async (endpoint, method = 'put', body = {}) => {
    try {
      await axios[method](`http://localhost:5000${endpoint}`, body);
      toast.success('Action successful');
      fetchTabData(activeTab);
      fetchStats();
    } catch (err) { toast.error('Action failed'); }
  };

  const tabs = [
    { id: 'stats', label: 'Command Center', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'proposals', label: 'Review Proposals', icon: <ScrollText className="w-4 h-4" />, count: stats?.pendingProposals },
    { id: 'users', label: 'Investors', icon: <Users className="w-4 h-4" /> },
    { id: 'owners', label: 'Partners', icon: <Building2 className="w-4 h-4" /> },
    { id: 'payments', label: 'Revenue', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto pt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-black text-xs uppercase tracking-[0.3em] mb-2">
              <ShieldCheck className="w-4 h-4" /> Secure Admin Terminal
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">
              Command <span className="text-emerald-600 not-italic">Center.</span>
            </h1>
          </div>
          <div className="hidden md:block">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right mb-1">Last Update Logged</div>
            <div className="text-sm font-bold text-slate-600 dark:text-slate-400 italic">{new Date().toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-10 pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${activeTab === tab.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'}`}
            >
              {tab.icon} {tab.label}
              {tab.count > 0 && <span className="w-5 h-5 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <CreditCard />, color: 'text-emerald-500', trend: '+12.5%' },
                { label: 'Active Users', value: stats.totalUsers, icon: <Users />, color: 'text-blue-500', trend: '+8.2%' },
                { label: 'Verified Partners', value: stats.totalOwners, icon: <Building2 />, color: 'text-amber-500', trend: '+4.1%' },
                { label: 'Market Assets', value: stats.totalProperties, icon: <Building2 />, color: 'text-purple-500', trend: '+18.7%' },
              ].map((s, i) => (
                <div key={i} className="luxury-card p-8 group hover:border-emerald-500/50">
                  <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 ${s.color} inline-block mb-4 group-hover:scale-110 transition-transform`}>{s.icon}</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 leading-none tracking-tight">{s.value}</div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {s.label} <span className="text-emerald-500 flex items-center gap-1 font-bold lowercase italic">{s.trend} <TrendingUp className="w-3 h-3" /></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 luxury-card p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">Critical Alerts</h3>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">Automated Defense Logging</div>
                </div>
                {stats.pendingProposals > 0 ? (
                  <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 p-6 rounded-3xl flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><ScrollText /></div>
                      <div>
                        <div className="text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-widest mb-1">Queue Priority: Urgent</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white italic">{stats.pendingProposals} Property Proposals Awaiting Review</div>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('proposals')} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-105 transition-transform uppercase tracking-widest">Review Now</button>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-100/50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 font-bold italic">No critical alerts detected in system queue.</div>
                )}
              </div>

              <div className="luxury-card p-8 bg-emerald-600 text-white">
                <h3 className="text-xl font-black uppercase italic mb-6">Growth Hack</h3>
                <p className="font-bold opacity-80 leading-relaxed mb-8 italic">Revenue is up 12% this month. Premium plan conversion has peaked. Launch localized campaigns for Mumbai & Delhi to capitalize on current buyer demand.</p>
                <button className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:translate-y-[-2px] transition-all shadow-xl">Go To Analytics</button>
              </div>
            </div>
          </div>
        )}

        {(activeTab !== 'stats') && (
          <div className="luxury-card overflow-hidden">
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"><Filter className="w-4 h-4" /></button>
                <button
                  onClick={() => fetchTabData(activeTab)}
                  className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-emerald-500 transition-colors"
                >
                  <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-8 py-4">Sno</th>
                    <th className="px-8 py-4">Identity / Detail</th>
                    <th className="px-8 py-4">Status / Metrics</th>
                    <th className="px-8 py-4">Registration</th>
                    <th className="px-8 py-4">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                   <tr><td colSpan="5" className="py-20 text-center text-slate-400 font-black tracking-widest uppercase italic">Decrypting System Log...</td></tr>
                  ) : data.length === 0 ? (
                    <tr><td colSpan="5" className="py-20 text-center text-slate-400 font-black tracking-widest uppercase italic">No Entry Found in Terminal Log</td></tr>
                  ) : data.filter(item => JSON.stringify(item).toLowerCase().includes(search.toLowerCase())).map((item, i) => (
                    <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-6 text-slate-400 font-mono text-xs">0x0{i+1}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-black text-xs uppercase">
                            {item.name ? item.name.substring(0,2) : item.type ? item.type.substring(0,2) : 'EV'}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase italic leading-none mb-1">{item.name || item.title || item.plan}</div>
                            <div className="text-[10px] text-slate-400 font-bold tracking-tight line-clamp-1">{item.email || item.company || item.razorpayOrderId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          {activeTab === 'users' && (
                            <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${item.subscriptionPlan === 'Premium' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                              {item.subscriptionPlan} Tier
                            </div>
                          )}
                          {activeTab === 'proposals' && (
                            <div className="text-emerald-500 text-xs font-black uppercase italic tracking-widest flex items-center gap-1">
                              ₹{(item.price || 0).toLocaleString()} <ArrowUpRight className="w-3 h-3" />
                            </div>
                          )}
                          {(activeTab === 'users' || activeTab === 'owners') && (
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                              <span className="text-[10px] font-black uppercase text-slate-400">{item.isActive ? 'Operational' : 'Restricted'}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          {activeTab === 'proposals' && (
                            <>
                              <button onClick={() => handleAction(`/api/admin/proposals/${item._id}/approve`, 'put', { visibilityTier: 'Standard' })} className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg group" title="Approve Standard"><CheckCircle2 className="w-4 h-4" /></button>
                              <button onClick={() => handleAction(`/api/admin/proposals/${item._id}/reject`, 'put')} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                            </>
                          )}
                          {(activeTab === 'users' || activeTab === 'owners') && (
                            <>
                              <button onClick={() => handleAction(`/api/admin/users/${item._id}/toggle`)} className={`p-2 rounded-lg transition-all ${item.isActive ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`} title={item.isActive ? 'Deactivate' : 'Activate'}>
                                {item.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                              </button>
                              <button onClick={() => handleAction(`/api/admin/users/${item._id}`, 'delete')} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all" title="Terminate Data"><Trash2 className="w-4 h-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
