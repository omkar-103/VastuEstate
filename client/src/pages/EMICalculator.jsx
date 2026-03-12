import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, IndianRupee, Clock, TrendingUp, 
  ArrowRight, Info, PieChart, Landmark,
  ChevronRight, Sparkles
} from 'lucide-react';

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const calculateEMI = () => {
    let r = interestRate / 12 / 100;
    let n = tenure * 12;
    let emiVal = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(Math.round(emiVal));
    setTotalPayment(Math.round(emiVal * n));
    setTotalInterest(Math.round((emiVal * n) - loanAmount));
  };

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-[0.4em] mb-4 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
            <Calculator className="w-4 h-4" /> Financial Planning Terminal
          </div>
          <h1 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
            EMI <span className="text-emerald-600 not-italic">Engine.</span>
          </h1>
          <p className="mt-6 text-slate-500 font-bold italic text-xl max-w-2xl mx-auto leading-relaxed">
            Execute high-precision mortgage simulations. Calibrate your investment architecture with absolute mathematical certainty.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Controls */}
          <div className="lg:col-span-3 space-y-10">
            <div className="luxury-card p-10 space-y-12">
               {/* Loan Amount */}
               <div className="space-y-6">
                  <div className="flex justify-between items-end">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">Principal Investment</label>
                     <div className="text-2xl font-black text-slate-900 dark:text-white italic">₹{loanAmount.toLocaleString()}</div>
                  </div>
                  <input 
                    type="range" min="1000000" max="100000000" step="100000" 
                    value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-tighter italic">
                     <span>10 Lakhs</span>
                     <span>10 Crores</span>
                  </div>
               </div>

               {/* Interest Rate */}
               <div className="space-y-6">
                  <div className="flex justify-between items-end">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">Annual Interest Rate</label>
                     <div className="text-2xl font-black text-slate-900 dark:text-white italic">{interestRate}%</div>
                  </div>
                  <input 
                    type="range" min="5" max="15" step="0.1" 
                    value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-tighter italic">
                     <span>5.0% Min</span>
                     <span>15.0% Max</span>
                  </div>
               </div>

               {/* Tenure */}
               <div className="space-y-6">
                  <div className="flex justify-between items-end">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">Amortization Period</label>
                     <div className="text-2xl font-black text-slate-900 dark:text-white italic">{tenure} Years</div>
                  </div>
                  <input 
                    type="range" min="5" max="30" step="1" 
                    value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-tighter italic">
                     <span>5 Years</span>
                     <span>30 Years</span>
                  </div>
               </div>
            </div>

            <div className="bg-emerald-600 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl shadow-emerald-500/20">
               <div className="relative z-10">
                  <h3 className="text-2xl font-black uppercase italic italic leading-none mb-3">Institutional Funding.</h3>
                  <p className="text-sm font-bold text-emerald-100 max-w-sm">Get pre-approved for a home loan within 24 hours through our partner banks.</p>
               </div>
               <button className="relative z-10 px-10 py-5 bg-white text-emerald-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">Apply for Finance</button>
               <Landmark className="absolute -bottom-6 -right-6 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2 space-y-8">
             <div className="luxury-card p-10 bg-slate-900 text-white relative flex flex-col items-center text-center overflow-hidden">
                <div className="relative z-10">
                   <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6 flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" /> Monthly Repayment
                   </div>
                   <div className="text-6xl font-black tracking-tighter mb-4 italic">₹{emi.toLocaleString()}</div>
                   <p className="text-xs font-black uppercase tracking-widest opacity-40">Fixed installments over {tenure} years</p>
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
             </div>

             <div className="luxury-card p-10 space-y-8">
                <div className="space-y-6">
                   <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Principal</div>
                         <div className="text-lg font-black text-slate-900 dark:text-white italic">₹{loanAmount.toLocaleString()}</div>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600"><IndianRupee /></div>
                   </div>

                   <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Interest Payable</div>
                         <div className="text-lg font-black text-slate-900 dark:text-white italic">₹{totalInterest.toLocaleString()}</div>
                      </div>
                      <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600"><TrendingUp /></div>
                   </div>

                   <div className="flex justify-between items-center bg-slate-900 dark:bg-white p-8 rounded-3xl text-white dark:text-slate-900 shadow-xl">
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Gross Outflow</div>
                         <div className="text-2xl font-black italic">₹{totalPayment.toLocaleString()}</div>
                      </div>
                      <PieChart className="w-10 h-10 opacity-40" />
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                   <div className="flex gap-2 items-center text-amber-500 mb-4">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Financial Advisory Log</span>
                   </div>
                   <p className="text-xs font-bold text-slate-500 italic leading-relaxed">Values are indicative. Exact rates depend on institutional policies and your credit terminal score.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
