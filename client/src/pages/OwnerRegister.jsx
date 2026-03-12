import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Building2, UserPlus, Mail, Lock, User, Phone, Briefcase, FileText, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const OwnerRegister = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', phone: '', company: '', aadhaarOrPAN: '' 
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/register-owner', formData);
      login(data);
      toast.success('Business account created! Verify documents to go live.');
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Business <span className="text-emerald-600">Growth</span></h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Partner with VastuEstate</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput label="Full Name" icon={User} placeholder="John Doe" 
            value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
          
          <FormInput label="Business Email" icon={Mail} placeholder="name@company.com" type="email"
            value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />

          <FormInput label="Company Name" icon={Briefcase} placeholder="Raj Properties" 
            value={formData.company} onChange={(v) => setFormData({...formData, company: v})} />

          <FormInput label="Phone Number" icon={Phone} placeholder="+91 98765 43210" 
            value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />

          <FormInput label="PAN / Aadhaar" icon={FileText} placeholder="Required for verification" 
            value={formData.aadhaarOrPAN} onChange={(v) => setFormData({...formData, aadhaarOrPAN: v})} />

          <FormInput label="Password" icon={Lock} placeholder="••••••••" type="password"
            value={formData.password} onChange={(v) => setFormData({...formData, password: v})} />

          <div className="md:col-span-2 mt-4">
            <button
              type="submit" disabled={loading}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Owner Account'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const FormInput = ({ label, icon: Icon, value, onChange, type = "text", placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type={type} required
        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default OwnerRegister;
