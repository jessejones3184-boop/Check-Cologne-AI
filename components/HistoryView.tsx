
import React from 'react';
import { VerificationSession } from '../types';
import { ShieldCheck, ArrowRight, Database } from 'lucide-react';

export const HistoryView: React.FC<{ sessions: VerificationSession[]; onSelect: (s: VerificationSession) => void; onBack: () => void }> = ({ sessions, onSelect }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-black safe-top flex flex-col">
      <div className="px-6 py-12 flex flex-col gap-2">
        <div className="flex items-center gap-3 text-[#00F2FF]">
           <Database className="w-5 h-5" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Encrypted Logs</span>
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight">Authentic <br/>History</h2>
      </div>

      <div className="flex-1 px-6 pb-40">
        {sessions.length === 0 ? (
          <div className="py-20 text-center">
             <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-[2rem] flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-white/10" strokeWidth={1} />
             </div>
             <p className="font-black uppercase tracking-[0.3em] text-[10px] text-white/20">Secure Vault Empty</p>
             <p className="text-[9px] font-bold text-white/10 uppercase mt-2">Finish a scan to see records here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => (
              <button 
                key={s.id} 
                onClick={() => onSelect(s)}
                className="w-full p-5 bg-[#111] border border-white/5 rounded-[2rem] flex items-center gap-5 active:scale-[0.98] transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 p-2 shrink-0 relative overflow-hidden">
                  <img src={s.reportImage} className="w-full h-full object-contain relative z-10" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{s.brand}</span>
                     <div className={`w-1 h-1 rounded-full ${s.details.verdict === 'AUTHENTIC' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  </div>
                  <h4 className="font-black text-sm uppercase tracking-tight truncate text-white">{s.collection}</h4>
                  <p className="text-[9px] font-bold text-white/20 uppercase mt-1 tracking-widest truncate">{s.specificType} • {new Date(s.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00F2FF]/20 transition-colors">
                    <ArrowRight className={`w-4 h-4 transition-colors ${s.details.verdict === 'AUTHENTIC' ? 'text-emerald-500/50 group-hover:text-emerald-500' : 'text-rose-500/50 group-hover:text-rose-500'}`} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
