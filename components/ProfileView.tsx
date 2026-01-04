
import React from 'react';
import { User, Zap, Settings, ShieldCheck, Lock, ChevronRight, Globe, Bell } from 'lucide-react';

export const ProfileView: React.FC<{ count: number; isPro: boolean; onUpgrade: () => void; onBack: () => void }> = ({ count, isPro, onUpgrade }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-black safe-top flex flex-col">
      <div className="px-6 py-12">
        <div className="flex items-center gap-6 mb-10">
           <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-neutral-800 to-black border border-white/10 flex items-center justify-center shadow-2xl relative">
              <User className="w-10 h-10 text-white/40" />
              {isPro && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#00F2FF] rounded-full flex items-center justify-center border-4 border-black">
                   <Zap className="w-3.5 h-3.5 text-black fill-black" />
                </div>
              )}
           </div>
           <div>
              <div className={`px-2 py-0.5 rounded-full border text-[7px] font-black uppercase tracking-[0.2em] mb-2 inline-block ${isPro ? 'bg-[#00F2FF]/10 border-[#00F2FF]/30 text-[#00F2FF]' : 'bg-white/5 border-white/10 text-white/40'}`}>
                 {isPro ? 'Pro Member' : 'Standard Tier'}
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Scout <br/>Analyzer</h3>
              <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.3em] mt-2">Node: 734-X9-Alpha</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5">
                <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Total Scans</p>
                <p className="text-3xl font-black text-white">{count}</p>
            </div>
            <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5">
                <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Trust Score</p>
                <p className="text-3xl font-black text-[#00F2FF]">99.8%</p>
            </div>
        </div>

        {!isPro && (
          <button 
            onClick={onUpgrade}
            className="w-full p-8 rounded-[2.5rem] bg-[#00F2FF] text-black relative overflow-hidden group mb-10 shadow-[0_0_50px_-10px_rgba(0,242,255,0.3)]"
          >
            <div className="relative z-10 text-left">
              <div className="flex items-center gap-2 mb-2">
                 <Zap className="w-4 h-4 fill-black" />
                 <h4 className="text-xl font-black uppercase tracking-tighter">Upgrade to Pro</h4>
              </div>
              <p className="text-black/60 text-[9px] font-bold uppercase tracking-wider mb-6 max-w-[200px]">Unlimited Certificates & Forensic Deep-Scans.</p>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-black/10 rounded-lg">Get License</span>
              </div>
            </div>
            <ShieldCheck className="absolute top-4 right-4 w-24 h-24 text-black/5 -rotate-12 group-hover:scale-110 transition-transform" />
          </button>
        )}

        <div className="space-y-3 pb-40">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 px-4 mb-4">Account Control</p>
           
           {[
             { icon: Settings, label: 'Preferences', value: 'System v3.1' },
             { icon: Lock, label: 'Privacy & Security', value: 'Encrypted' },
             { icon: Globe, label: 'Language', value: 'English (US)' },
             { icon: Bell, label: 'Notifications', value: 'Enabled' }
           ].map((item, i) => (
             <button key={i} className="w-full p-6 bg-[#111] border border-white/5 rounded-[2rem] flex items-center justify-between group active:scale-[0.99] transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#00F2FF]/10 group-hover:text-[#00F2FF] transition-colors">
                      <item.icon className="w-5 h-5" strokeWidth={1.5} />
                   </div>
                   <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-tight text-white">{item.label}</p>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{item.value}</p>
                   </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};
