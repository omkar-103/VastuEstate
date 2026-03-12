import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Shield, IndianRupee, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Pricing = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: 0,
      icon: Shield,
      color: 'slate',
      features: ['Browse all properties', 'Contact up to 3 owners', 'Basic search filters', 'Community access'],
      cta: 'Current Plan',
      disabled: true
    },
    {
      name: 'Standard',
      price: 999,
      icon: Zap,
      color: 'blue',
      features: ['Unlock all properties', 'Unlimited owner contacts', 'Advanced filters', 'New listing alerts', 'Verified badge'],
      cta: 'Upgrade to Standard',
      highlight: true
    },
    {
      name: 'Premium',
      price: 2999,
      icon: Crown,
      color: 'amber',
      features: ['Early access to listings', 'Priority support', 'Legal document assistance', 'Custom property reports', 'Dedicated manager'],
      cta: 'Go Premium'
    }
  ];

  const handleUpgrade = async (plan) => {
    if (!user) return toast.info('Please login to upgrade');
    if (user.subscriptionPlan === plan) return toast.info(`You are already on the ${plan} plan`);
    
    try {
      setLoading(true);
      const { data } = await axios.post('/api/subscriptions/create-order', { plan });
      
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'VastuEstate',
        description: `${plan} Subscription`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const ver = await axios.post('/api/subscriptions/verify', {
              ...response,
              plan: data.plan
            });
            if (ver.data.success) {
              updateUser(ver.data.user);
              toast.success(`Successfully upgraded to ${plan}!`);
            }
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ''
        },
        theme: { color: '#2563eb' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to initiate subscription process.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 bg-slate-50 dark:bg-slate-950 transition-colors min-h-screen">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 uppercase italic"
        >
          Choose Your <span className="text-blue-600">Plan</span>
        </motion.h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs">
          Unlock the full potential of VastuEstate and find your dream home faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((p, idx) => {
          const isCurrent = user?.subscriptionPlan === p.name || (p.name === 'Free' && !user?.subscriptionPlan);
          
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-10 rounded-[3rem] border-2 transition-all duration-500 hover:-translate-y-4 flex flex-col ${
                p.highlight 
                ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/20' 
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100'
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                  <Zap size={10} strokeWidth={3} /> Most Popular
                </div>
              )}

              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-3xl ${p.highlight ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <p.icon size={32} className={p.highlight ? 'text-white' : `text-${p.color}-600`} />
                </div>
                <div className="text-right">
                  <p className={`text-xs font-black uppercase tracking-widest ${p.highlight ? 'text-blue-100' : 'text-slate-400'}`}>
                    {p.name}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-4xl font-black tracking-tighter italic">₹{p.price}</span>
                    <span className={`text-[10px] font-bold uppercase ${p.highlight ? 'text-blue-200' : 'text-slate-400'}`}>/mo</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex-grow mb-10">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${p.highlight ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      <Check size={14} className={p.highlight ? 'text-white' : 'text-blue-600'} />
                    </div>
                    <span className={`text-sm font-medium ${p.highlight ? 'text-white/90' : 'text-slate-600 dark:text-slate-400'}`}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={isCurrent || p.disabled || loading}
                onClick={() => handleUpgrade(p.name)}
                className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 ${
                  isCurrent 
                  ? 'bg-emerald-500 text-white cursor-default'
                  : p.highlight
                  ? 'bg-white text-blue-600 hover:bg-slate-100 shadow-lg'
                  : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (isCurrent ? 'Active Plan' : p.cta)}
                {!isCurrent && !p.disabled && !loading && <ArrowRight size={18} />}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
