import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, Settings, ShieldCheck, CheckCircle, Package, Star, Heart, Calendar, MessageSquare, List, LogOut, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, logout, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [listings, setListings] = useState([]);
  const [myTours, setMyTours] = useState([]);
  const [receivedTours, setReceivedTours] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // Profile edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const [resListings, resMyTours, resRecTours, resEnquiries, resWishlist] = await Promise.all([
        axios.get('http://localhost:5000/api/properties/my-listings', config),
        axios.get('http://localhost:5000/api/tours/my-tours', config),
        axios.get('http://localhost:5000/api/tours/received', config),
        axios.get('http://localhost:5000/api/enquiries/my-enquiries', config),
        axios.get('http://localhost:5000/api/wishlist', config)
      ]);

      setListings(resListings.data);
      setMyTours(resMyTours.data);
      setReceivedTours(resRecTours.data);
      setEnquiries(resEnquiries.data);
      setWishlist(resWishlist.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put('http://localhost:5000/api/auth/profile', editForm, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      // Update local context
      updateUserData(data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const formatPrice = (p) => {
    if (!p) return '₹0';
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(2)} L`;
    return `₹${p.toLocaleString('en-IN')}`;
  };

  if (!user) return (
    <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-slate-950 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
           <User size={48} />
        </div>
        <h2 className="text-4xl font-black text-white">Access Restricted</h2>
        <p className="text-gray-400 max-w-sm">Please log in to your elite account to access the dashboard components.</p>
        <Link to="/login" className="btn-primary py-4 px-10 inline-block uppercase tracking-widest text-xs">Return to Login</Link>
      </motion.div>
    </div>
  );

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: <Package size={18} />, count: listings.length },
    { id: 'tours', label: 'Tours', icon: <Calendar size={18} />, count: myTours.length + receivedTours.length },
    { id: 'enquiries', label: 'Enquiries', icon: <MessageSquare size={18} />, count: enquiries.length },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} />, count: wishlist.length },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen pt-40 pb-24 bg-slate-950 px-6 text-white font-['Inter']">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Dashboard Header / Profile Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="glass p-10 rounded-[3.5rem] bg-white/5 border-white/5 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500 to-emerald-700 opacity-20"></div>
               <div className="relative pt-6">
                  <div className="w-32 h-32 bg-emerald-500 rounded-[2.5rem] mx-auto flex items-center justify-center text-slate-950 font-black text-5xl shadow-2xl shadow-emerald-500/20 mb-6">
                    {user.name.charAt(0)}
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter mb-1">{user.name}</h2>
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] bg-emerald-500/10 inline-block px-4 py-1.5 rounded-full border border-emerald-500/20 mb-8">
                    {user.subscriptionPlan || 'Free'} Member
                  </p>
                  
                  <div className="space-y-6 text-left border-t border-white/10 pt-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500"><Mail size={18} /></div>
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Elite Channel</p>
                        <p className="text-xs font-bold truncate max-w-[180px]">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500"><Phone size={18} /></div>
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Direct Line</p>
                        <p className="text-xs font-bold">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      Profile Settings
                    </button>
                    <button 
                      onClick={logout}
                      className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
               </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Visits Scheduled</p>
                  <p className="text-3xl font-black text-emerald-500">{myTours.length}</p>
               </div>
               <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Saved Gems</p>
                  <p className="text-3xl font-black text-emerald-500">{wishlist.length}</p>
               </div>
            </div>
          </motion.div>

          {/* Main Dashboard Interaction */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-white/5 rounded-[4rem] border border-white/5 overflow-hidden flex flex-col"
          >
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto bg-white/5 p-4 gap-2 no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon} {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-1 px-2 py-0.5 rounded-md text-[8px] ${activeTab === tab.id ? 'bg-slate-950/20' : 'bg-white/10'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-8 lg:p-12 flex-1 overflow-y-auto max-h-[800px] no-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'listings' && (
                  <motion.div 
                    key="listings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center mb-10">
                       <h3 className="text-2xl font-black tracking-tight uppercase">My Listed Estates</h3>
                       <Link to="/add-property" className="bg-emerald-500 text-slate-950 p-3 rounded-xl hover:scale-105 transition-all"><PlusCircle size={24} /></Link>
                    </div>
                    {listings.length === 0 ? (
                      <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <Package size={48} className="mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-500 font-bold">List your first property to see it here.</p>
                      </div>
                    ) : (
                      listings.map(p => (
                        <div key={p._id} className="group p-6 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row items-center gap-6">
                           <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
                             <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                           </div>
                           <div className="flex-1 text-center md:text-left">
                              <h4 className="text-lg font-black tracking-tight mb-1">{p.title}</h4>
                              <p className="text-xs text-gray-500 font-bold mb-3">{p.location.city}, India</p>
                              <div className="flex items-center gap-4 justify-center md:justify-start">
                                 <span className="text-emerald-500 font-black text-sm">{formatPrice(p.price)}</span>
                                 <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest text-gray-500 border border-white/10">Active</span>
                              </div>
                           </div>
                           <div className="flex gap-2">
                             <Link to={`/properties/${p._id}`} className="p-4 bg-white/5 rounded-2xl text-gray-400 hover:text-emerald-500 transition-all"><ArrowRight size={20} /></Link>
                             <button className="p-4 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-all"><Edit3 size={20} /></button>
                           </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'tours' && (
                  <motion.div 
                    key="tours" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    {/* CRITICAL 7: Received Tours Section */}
                    {receivedTours.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tight uppercase text-emerald-500">Incoming Requests</h3>
                        <div className="space-y-4">
                           {receivedTours.map(t => (
                             <div key={t._id} className="p-6 bg-white/5 rounded-[2.5rem] border border-emerald-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
                               <div className="flex items-center gap-6">
                                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 font-black"><User size={24} /></div>
                                  <div>
                                    <h4 className="font-black text-sm">{t.requester.name} wants to tour</h4>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{t.property.title}</p>
                                  </div>
                               </div>
                               <div className="text-center md:text-right">
                                  <p className="text-sm font-black text-white">{new Date(t.requestedDate).toLocaleDateString()}</p>
                                  <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${t.status === 'confirmed' ? 'bg-emerald-500 text-slate-950' : 'bg-gray-800 text-gray-400'}`}>
                                    {t.status}
                                  </span>
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      <h3 className="text-2xl font-black tracking-tight uppercase">My Booked Sessions</h3>
                      {myTours.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-[3rem]">
                           <Calendar size={48} className="mx-auto text-gray-700 mb-4" />
                           <p className="text-gray-500 font-bold">No tours booked yet.</p>
                        </div>
                      ) : (
                        myTours.map(t => (
                          <div key={t._id} className="p-6 bg-white/5 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl overflow-hidden">
                                   <img src={t.property.images[0]} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                  <h4 className="font-black text-sm">{t.property.title}</h4>
                                  <p className="text-xs text-emerald-500 font-bold mt-1">Visit Date: {new Date(t.requestedDate).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <div className="px-6 py-2 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.status}</span>
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'enquiries' && (
                  <motion.div 
                    key="enquiries" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-black tracking-tight uppercase">Private Communications</h3>
                    {enquiries.length === 0 ? (
                       <div className="text-center py-20 bg-white/5 rounded-[3rem]">
                         <MessageSquare size={48} className="mx-auto text-gray-700 mb-4" />
                         <p className="text-gray-500 font-bold">No enquiries found.</p>
                       </div>
                    ) : (
                      enquiries.map(e => (
                        <div key={e._id} className="p-8 bg-white/5 rounded-[3rem] border border-white/5 space-y-4">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500"><User size={20} /></div>
                                 <h4 className="text-sm font-black tracking-tight uppercase">Enquiry re: {e.property.title}</h4>
                              </div>
                              <span className="text-[10px] text-gray-500 font-black">{new Date(e.createdAt).toLocaleDateString()}</span>
                           </div>
                           <p className="text-gray-400 text-sm leading-relaxed font-medium italic">"{e.message}"</p>
                           <div className="pt-4 flex justify-end">
                              <button className="px-6 py-2 bg-emerald-500 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest">Reply Securely</button>
                           </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'wishlist' && (
                  <motion.div 
                    key="wishlist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-black tracking-tight uppercase">Curated Gems</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {wishlist.length === 0 ? (
                         <div className="col-span-full text-center py-20 bg-white/5 rounded-[3rem]">
                           <Heart size={48} className="mx-auto text-gray-700 mb-4" />
                           <p className="text-gray-500 font-bold">Your collection is empty.</p>
                         </div>
                       ) : (
                         wishlist.map(p => (
                           <Link key={p._id} to={`/properties/${p._id}`} className="group relative rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/5">
                              <div className="h-48 overflow-hidden">
                                 <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                              </div>
                              <div className="p-6">
                                 <h4 className="font-black truncate mb-1">{p.title}</h4>
                                 <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 font-bold">{p.location.city}</span>
                                    <span className="text-emerald-500 font-black">{formatPrice(p.price)}</span>
                                 </div>
                              </div>
                             <div className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl shadow-lg shadow-red-500/20">
                               <Heart size={16} fill="currentColor" />
                             </div>
                           </Link>
                         ))
                       )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div 
                    key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="flex justify-between items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500"><User size={28} /></div>
                           <div>
                              <h3 className="text-xl font-black tracking-tight uppercase">Profile Meta</h3>
                              <p className="text-gray-500 text-xs font-bold">Maintain your heritage identity.</p>
                           </div>
                        </div>
                        <button onClick={() => setIsEditing(!isEditing)} className="p-4 bg-emerald-500 text-slate-950 rounded-2xl hover:scale-105 transition-all">
                          {isEditing ? <X size={24} /> : <Edit3 size={24} />}
                        </button>
                    </div>

                    <form onSubmit={handleUpdateProfile} className={`space-y-6 transition-all ${isEditing ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-4">Legal Name</label>
                              <input 
                                type="text" value={editForm.name} 
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-colors"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-4">Phone Number</label>
                              <input 
                                type="text" value={editForm.phone} 
                                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-colors"
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-4">Secret Access Identifier (Password)</label>
                            <input 
                              type="password" placeholder="Leave blank to keep current signature"
                              onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        {isEditing && (
                           <button type="submit" className="w-full bg-emerald-500 text-slate-950 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.01] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
                              Commit Changes <Save size={18} />
                           </button>
                        )}
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
