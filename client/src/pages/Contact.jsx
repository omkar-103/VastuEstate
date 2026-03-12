import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Twitter, Instagram, Linkedin, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent! Our team will contact you soon.');
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 uppercase italic leading-none">
              Get In <span className="text-blue-600">Touch</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-12 max-w-lg">
              Have questions about a property or our plans? Our experts are here to help you 24/7.
            </p>

            <div className="space-y-8">
              <ContactInfo icon={Mail} label="Email Us" value="support@vastuestate.com" />
              <ContactInfo icon={Phone} label="Call Us" value="+91 22 4567 8900" />
              <ContactInfo icon={MapPin} label="Our Office" value="BKC Corporate Park, Mumbai, IN" />
            </div>

            <div className="mt-16 flex gap-6">
              {[Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="First Name" placeholder="Aman" />
                <FormInput label="Last Name" placeholder="Gupta" />
              </div>
              <FormInput label="Email Address" placeholder="aman@example.com" type="email" />
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Your Message</label>
                <textarea 
                  required rows="5"
                  placeholder="Tell us about your property requirements..."
                  className="w-full p-5 rounded-2xl bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Send Message
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-6">
    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

const FormInput = ({ label, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">{label}</label>
    <input 
      type={type} required
      placeholder={placeholder}
      className="w-full p-5 rounded-2xl bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all"
    />
  </div>
);

export default Contact;
