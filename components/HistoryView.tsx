
import React from 'react';
import { VerificationSession } from '../types';
import { ShieldCheck, ArrowRight, History, Trash2 } from 'lucide-react';

export const HistoryView: React.FC<{ 
  sessions: VerificationSession[]; 
  onSelect: (s: VerificationSession) => void; 
  onBack: () => void;
  onClear: () => void;
}> = ({ sessions, onSelect, onClear }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-white safe-top flex flex-col">
      <div className="px-6 py-12 flex flex-col gap-2 relative">
        {sessions.length > 0 && (
          <button 
            onClick={onClear}
            className="absolute top-12 right-6 p-3 bg-rose-50 text-rose-500 rounded-xl active:scale-95 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-3 text-accent">
           <History className="w-5 h-5" />
           <span className="text-[10px] font-black uppercase tracking-widest">Saved History</span>
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight leading-tight text-slate-900">Recent <br/>Verifications</h2>
      </div>

      <div className="flex-1 px-6 pb-40">
        {sessions.length === 0 ? (
          <div className="py-20 text-center">
             <div className="w-16 h-16 mx-auto mb-6 bg-slate-50 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-slate-200" strokeWidth={1} />
             </div>
             <p className="font-black uppercase tracking-widest text-[10px] text-slate-300">No records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => (
              <button 
                key={s.id} 
                onClick={() => onSelect(s)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-white p-2 shrink-0 overflow-hidden shadow-sm">
                  <img src={s.reportImage} className="w-full h-full object-contain" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm uppercase tracking-tight truncate text-slate-900">{s.itemName}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{new Date(s.timestamp).toLocaleDateString()}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${s.details.verdict === 'AUTHENTIC' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
