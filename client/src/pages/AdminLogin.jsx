import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // portal separation — only allow admin role
      const { data } = await axios.post('/api/auth/login', { ...formData, expectedRole: 'admin' });
      login(data);
      toast.success('System Authenticated. Welcome, Admin.');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unauthorized Access Attempt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900 p-12 rounded-[3rem] border border-blue-900/30 shadow-[0_0_50px_rgba(37,99,235,0.1)]"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600/20 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Admin <span className="text-blue-500">Secure</span></h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input
                type="email" required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
                placeholder="admin@vastu.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input
                type="password" required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Credentials'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-slate-600 hover:text-slate-400 text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            ← Back to Public Site
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
