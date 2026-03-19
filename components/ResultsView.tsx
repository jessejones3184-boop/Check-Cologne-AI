
import React from 'react';
import { ChevronLeft, Share2, Award, Info, FileCheck, ArrowRight, ShieldCheck, Fingerprint, FlaskConical } from 'lucide-react';
import { VerificationSession } from '../types';

export const ResultsView: React.FC<{ session: VerificationSession; ownerName: string; onBack: () => void }> = ({ session, onBack }) => {
  const { details } = session;
  const isAuth = details.verdict === 'AUTHENTIC';
  
  return (
    <div className="h-full bg-white safe-top flex flex-col animate-fade-in overflow-y-auto no-scrollbar pb-32 text-slate-900">
      <div className="px-6 py-8 flex items-center justify-between">
        <button onClick={onBack} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 active:scale-95 transition-all"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
        <div className="flex flex-col items-center max-w-[150px]">
          <span className="text-[10px] font-black tracking-widest text-accent uppercase truncate w-full text-center">{session.itemName}</span>
          <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">ID-{session.id.slice(-6)}</span>
        </div>
        <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 active:scale-95 transition-all"><Share2 className="w-5 h-5 text-slate-400" /></button>
      </div>

      <div className="px-8 space-y-6">
        {/* Verdict Hero Card */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 relative overflow-hidden shadow-xl shadow-slate-100">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${isAuth ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <div className="flex flex-col items-center text-center mb-10">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 border ${isAuth ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className={`text-3xl font-black uppercase tracking-tight mb-2 ${isAuth ? 'text-emerald-500' : 'text-rose-500'}`}>{details.verdict}</h2>
                <div className="px-4 py-1 bg-slate-50 rounded-full inline-block mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{details.confidence}% Confidence</span>
                </div>
                
                {/* Confidence Meter */}
                <div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out ${isAuth ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${details.confidence}%` }}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">AI Analysis</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 font-medium italic">"{details.reasoning}"</p>
            </div>
        </div>

        {/* Technical Specs */}
        <div className="grid grid-cols-1 gap-3">
            {[
                { label: 'Branding', status: details.analysisPoints.branding },
                { label: 'Build Quality', status: details.analysisPoints.buildQuality },
                { label: 'Packaging', status: details.analysisPoints.packaging }
            ].map((p, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.label}</span>
                    <div className="flex items-center gap-3">
                         <span className={`text-[10px] font-black uppercase tracking-widest ${p.status === 'PASS' ? 'text-emerald-500' : 'text-accent'}`}>{p.status}</span>
                         <div className={`w-2 h-2 rounded-full ${p.status === 'PASS' ? 'bg-emerald-500' : 'bg-accent'}`} />
                    </div>
                </div>
            ))}
        </div>

        {/* Info Block */}
        <div className="bg-slate-50 rounded-[1.5rem] p-8 border border-slate-100 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200/50 pb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</span>
                <span className="text-xs font-bold text-accent uppercase">{details.batchCodeValue || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extra Info</span>
                <span className="text-xs font-bold text-slate-900 uppercase truncate max-w-[150px]">{details.sellerInfo || 'None'}</span>
            </div>
        </div>

        {/* Certificate CTA */}
        <button className="w-full p-6 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-between active:scale-95 transition-all shadow-lg shadow-slate-900/10">
            <div className="flex items-center gap-4">
                <FileCheck className="w-6 h-6 text-white" />
                <div className="text-left">
                    <h4 className="font-black uppercase tracking-tight text-sm">Download Report</h4>
                </div>
            </div>
            <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
