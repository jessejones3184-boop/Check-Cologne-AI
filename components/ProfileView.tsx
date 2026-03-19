import React, { useState } from 'react';
import { Zap, CreditCard, Star, Loader2, FlaskConical } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileViewProps {
  user: UserType | null;
  onSubscribe: (priceType: 'single' | 'monthly') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onSubscribe }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="h-full bg-white flex items-center justify-center p-8 text-center">
        <FlaskConical className="w-10 h-10 text-accent animate-pulse" />
      </div>
    );
  }

  const handleSubscribeClick = (type: 'single' | 'monthly') => {
    setIsLoading(type);
    onSubscribe(type);
  };

  return (
    <div className="h-full bg-white safe-top flex flex-col overflow-y-auto no-scrollbar pb-40">
      <div className="px-8 py-12 text-center">
        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-slate-900/20">
          <Star className="w-8 h-8 text-cyan-400 fill-cyan-400" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-slate-900">Get More Scans</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed max-w-[250px] mx-auto">
          Choose the plan that fits your needs. AI Authentication requires high computing power.
        </p>
      </div>

      <div className="px-8 space-y-4">
        {/* Single Scan */}
        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center">
          <h3 className="font-black text-sm uppercase tracking-wide mb-1 text-slate-900">Single Scan</h3>
          <div className="text-3xl font-black tracking-tight mb-6 text-slate-900">$2.99</div>
          <button 
            onClick={() => handleSubscribeClick('single')}
            disabled={!!isLoading}
            className="w-full py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-slate-900 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            {isLoading === 'single' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            {isLoading === 'single' ? 'Processing...' : 'Buy 1 Scan'}
          </button>
        </div>

        {/* Unlimited Monthly */}
        <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[8px] font-black uppercase tracking-widest px-5 py-2 rounded-bl-2xl">Best Value</div>
          <h3 className="font-black text-sm uppercase tracking-wide mb-1">Unlimited Pro</h3>
          <div className="text-3xl font-black tracking-tight mb-6">$7.99<span className="text-[10px] text-slate-400">/mo</span></div>
          <button 
            onClick={() => handleSubscribeClick('monthly')}
            disabled={!!isLoading}
            className="w-full py-5 bg-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            {isLoading === 'monthly' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isLoading === 'monthly' ? 'Processing...' : 'Go Unlimited'}
          </button>
        </div>

        <p className="text-center text-[9px] text-slate-400 font-black uppercase tracking-widest px-8 pt-4">
          Secure payments processed by Stripe. Cancel monthly anytime.
        </p>
      </div>
    </div>
  );
};
