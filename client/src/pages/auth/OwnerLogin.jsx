import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';

const OwnerLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        ...data,
        expectedRole: 'owner'
      });
      login(res.data);
      toast.success(`Dashboard access granted. Welcome ${res.data.name}!`);
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Owner Portal" subtitle="Manage your luxury listings and track proposal status.">
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex gap-3 text-amber-600">
        <ShieldCheck className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-bold italic leading-tight">Secure access for verified property owners and developers only.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Partner Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="email"
              {...register('email', { required: 'Partner email is required' })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-medium"
              placeholder="owner@company.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1 font-bold ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Portal Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none font-medium"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Enter Dashboard <ArrowRight className="w-5 h-5" /></>}
        </button>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Not a partner yet? <Link to="/owner/register" className="text-emerald-600 font-bold hover:underline text-[12px]">Submit Partnership Inquiry</Link>
          </p>
        </div>

        <Link to="/login" className="block text-center text-xs font-bold text-slate-500 hover:text-emerald-600 pt-4">
          ← Back to User Login
        </Link>
      </form>
    </AuthLayout>
  );
};

export default OwnerLogin;
