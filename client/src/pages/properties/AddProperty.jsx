import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Building2, MapPin, IndianRupee, Bed, Bath, 
  Move, Image as ImageIcon, Loader2, ArrowRight,
  ShieldCheck, Info, CheckCircle2
} from 'lucide-react';

const AddProperty = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Create proposal
      await axios.post('http://localhost:5000/api/properties', {
        ...data,
        location: {
           address: data.address,
           city: data.city,
           state: data.state,
           pincode: data.pincode
        },
        features: {
           bedrooms: data.bedrooms,
           bathrooms: data.bathrooms,
           area: data.area,
           parking: data.parking
        }
      });
      toast.success('Property proposal submitted. Admin will review verification documents.');
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6 lg:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-3">
            <Building2 className="w-4 h-4" /> New Asset Manifest
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9]">
            Register <span className="text-emerald-600 not-italic">Property.</span>
          </h1>
          <p className="mt-4 text-slate-500 font-bold italic text-lg leading-relaxed">
            Submit your luxury estate for verification. Our board will review the architectural and legal compliance before listing.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
           {/* Section 1: Basic Info */}
           <div className="luxury-card p-10 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center font-black italic">01</div>
                 <h3 className="font-black uppercase italic text-lg text-slate-900 dark:text-white">Core Identity</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Listing Title</label>
                    <input 
                      {...register('title', { required: true })}
                      placeholder="e.g. Imperial Seafront Duplex" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-emerald-500/20" 
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Asset Type</label>
                    <select 
                      {...register('type', { required: true })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none"
                    >
                       <option value="Residential">Residential</option>
                       <option value="Commercial">Commercial</option>
                       <option value="Penthouse">Penthouse</option>
                       <option value="Plot">Premium Plot</option>
                    </select>
                 </div>
              </div>

              <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Asking Valuation (INR)</label>
                 <div className="relative group">
                    <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="number"
                      {...register('price', { required: true })}
                      placeholder="e.g. 45000000" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 pl-14 pr-6 text-lg font-black italic text-emerald-600 outline-none ring-2 ring-transparent focus:ring-emerald-500/20" 
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Architectural Description</label>
                 <textarea 
                   {...register('description', { required: true })}
                   rows="4"
                   placeholder="Detail the luxury features, finishes, and unique selling points..." 
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-emerald-500/20"
                 ></textarea>
              </div>
           </div>

           {/* Section 2: Technical Features */}
           <div className="luxury-card p-10 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center font-black italic">02</div>
                 <h3 className="font-black uppercase italic text-lg text-slate-900 dark:text-white">Technical Metrics</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Bedrooms</label>
                    <input {...register('bedrooms')} type="number" className="minimal-input" placeholder="3" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Bathrooms</label>
                    <input {...register('bathrooms')} type="number" className="minimal-input" placeholder="3" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Total Sqft</label>
                    <input {...register('area')} type="number" className="minimal-input" placeholder="2400" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Parking</label>
                    <input {...register('parking')} type="number" className="minimal-input" placeholder="2" />
                 </div>
              </div>
           </div>

           {/* Section 3: Geolocation */}
           <div className="luxury-card p-10 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center font-black italic">03</div>
                 <h3 className="font-black uppercase italic text-lg text-slate-900 dark:text-white">Geolocation Log</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Street Address</label>
                    <input {...register('address', { required: true })} className="minimal-input" placeholder="Project Name, Building, Floor" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">City</label>
                    <input {...register('city', { required: true })} className="minimal-input" placeholder="e.g. Mumbai" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Pincode</label>
                    <input {...register('pincode', { required: true })} className="minimal-input" placeholder="400001" />
                 </div>
              </div>
           </div>

           {/* Submit */}
           <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 p-6 bg-slate-900 text-white rounded-[2rem] flex items-center gap-6">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0"><ShieldCheck /></div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic leading-snug">All submissions undergo mandatory legal audit. Ensure title deeds and floor plans are ready for request.</p>
              </div>
              <button
                disabled={loading}
                className="w-full md:w-auto px-16 h-16 btn-primary shadow-2xl shadow-emerald-600/20"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Disptach Proposal <ArrowRight className="w-5 h-5" /></>}
              </button>
           </div>
        </form>
      </div>

      <style>{`
        .minimal-input {
           width: 100%;
           background: rgba(var(--emerald-600-rgb), 0.05);
           border: none;
           border-radius: 1rem;
           padding: 1rem 1.5rem;
           font-size: 0.875rem;
           font-weight: 700;
           outline: none;
           transition: all 0.2s;
        }
        .dark .minimal-input {
           background: rgba(15, 23, 42, 0.5);
           color: white;
        }
        .minimal-input:focus {
           box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AddProperty;
