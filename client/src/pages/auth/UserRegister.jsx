import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Phone, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';

const UserRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register/user', data);
      login(res.data);
      toast.success(`Welcome to VastuEstate, ${res.data.name}! Your account is ready.`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join the elite real estate network and unlock premium features.">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
              placeholder="Swayam More"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">Phone (In +91)</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              {...register('phone')}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
              placeholder="+91 99999..."
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              {...register('password', { required: 'Required', minLength: { value: 6, message: 'Too short' } })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 font-medium"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="md:col-span-2 btn-primary h-14 mt-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Register Account <ArrowRight className="w-5 h-5" /></>}
        </button>

        <p className="md:col-span-2 text-center text-sm text-slate-500 mt-2">
          Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Log In</Link>
        </p>

        <div className="md:col-span-2 h-[1px] bg-slate-100 dark:bg-slate-800 mt-2" />
        <Link to="/owner/register" className="md:col-span-2 text-center text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:tracking-[0.2em] transition-all">
          Register as Property Owner →
        </Link>
      </form>
    </AuthLayout>
  );
};

export default UserRegister;
