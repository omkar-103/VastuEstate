import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';

const UserLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        ...data,
        expectedRole: 'user'
      });
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Account Login" subtitle="Access your wishlist, tours, and premium listings.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
              placeholder="name@example.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1 font-bold ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 ml-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
            <Link to="/forgot-password" size="sm" className="text-xs font-bold text-emerald-600 hover:underline">Forgot?</Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 font-bold ml-1">{errors.password.message}</p>}
        </div>

        <button
          disabled={loading}
          className="w-full btn-primary h-14"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
        </button>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            New to VastuEstate? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Create Account</Link>
          </p>
        </div>

        <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-4" />

        <div className="flex flex-col gap-3">
          <Link to="/owner/login" className="text-center text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">
            Property Owner? Login here
          </Link>
          <Link to="/admin/login" className="text-center text-xs font-bold text-slate-500 hover:text-purple-500 transition-colors">
            Site Administrator? Login here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default UserLogin;
