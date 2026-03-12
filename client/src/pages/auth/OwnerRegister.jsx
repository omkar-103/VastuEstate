import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Phone, Loader2, ArrowRight, Building2, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';

const OwnerRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register/owner', data);
      login(res.data);
      toast.success('Owner application submitted. Please login while we verify your details.');
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Partner With Us" subtitle="List your properties and reach India's most verified buyer network.">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identity Section */}
        <div className="md:col-span-2 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl mb-1">
          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none">Identity & Access</p>
        </div>

        <div className="md:col-span-2 relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            {...register('name', { required: true })}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium"
            placeholder="Full Name"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email"
            {...register('email', { required: true })}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium"
            placeholder="Work Email"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            {...register('password', { required: true, minLength: 6 })}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium"
            placeholder="Portal Password"
          />
        </div>

        {/* Business Section */}
        <div className="md:col-span-2 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl mb-1 mt-2">
          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none">Business Verification</p>
        </div>

        <div className="relative">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            {...register('company', { required: true })}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium"
            placeholder="Company Name"
          />
        </div>

        <div className="relative">
          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            {...register('aadhaarOrPAN', { required: true })}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium uppercase"
            placeholder="Aadhaar / GST / PAN"
          />
        </div>

        <button
          disabled={loading}
          className="md:col-span-2 mt-4 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Request Verification <ArrowRight className="w-5 h-5" /></>}
        </button>

        <p className="md:col-span-2 text-center text-sm text-slate-500 font-medium">
          Already a partner? <Link to="/owner/login" className="text-emerald-600 font-bold hover:underline">Log In</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default OwnerRegister;
