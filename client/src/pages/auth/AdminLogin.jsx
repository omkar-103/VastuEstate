import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock, Loader2, KeyRound, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';

const AdminLogin = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        ...data,
        expectedRole: 'admin'
      });
      login(res.data);
      toast.success('Administrator terminal accessed.');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unauthorized access attempt logged.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Admin Command" subtitle="Restricted access for platform administrators.">
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-6 flex gap-3 text-purple-600">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-bold italic leading-tight uppercase tracking-tight">System monitoring active. Unauthorized access is strictly prohibited.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Admin Identity</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none font-mono text-sm leading-none"
              placeholder="admin@vastuestate.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Security Key</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              {...register('password', { required: true })}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none font-mono text-sm leading-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Authenticate Terminal <KeyRound className="w-5 h-5" /></>}
        </button>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
