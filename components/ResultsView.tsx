
import React, { useState } from 'react';
import { ChevronLeft, X, Share2, ShieldCheck, User, Fingerprint, Award, FileCheck, ArrowRight } from 'lucide-react';
import { VerificationSession } from '../types';

interface CertificateProps {
    session: VerificationSession;
    ownerName: string;
    onClose: () => void;
}

const CertificateModal: React.FC<CertificateProps> = ({ session, ownerName, onClose }) => {
    const { details } = session;
    const isAuth = details.verdict === 'AUTHENTIC';
    const caseId = `CC-${session.id.slice(-6).toUpperCase()}`;
    const dateStr = new Date(session.timestamp).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-start p-0 animate-fade-in overflow-y-auto no-scrollbar">
            <div className="w-full p-6 flex justify-between items-center safe-top sticky top-0 bg-black/80 backdrop-blur-xl z-[110]">
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full">
                    <X className="w-6 h-6 text-white" />
                </button>
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Official Certificate</p>
                    <p className="text-[8px] font-bold text-[#00F2FF] uppercase tracking-widest">{caseId}</p>
                </div>
                <button className="p-2 bg-white/10 rounded-full text-white">
                    <Share2 className="w-6 h-6" />
                </button>
            </div>

            <div className="w-full max-w-md bg-white text-black min-h-screen flex flex-col relative overflow-hidden shadow-2xl animate-slide-up">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden rotate-12 scale-150 flex flex-wrap content-start gap-8 p-10 font-black text-[12px] uppercase">
                    {Array.from({ length: 100 }).map((_, i) => (
                        <span key={i} className="tracking-tighter">CHECK COLOGNE AI SECURE {caseId}</span>
                    ))}
                </div>

                <div className={`h-3 w-full ${isAuth ? 'bg-[#00F2FF]' : 'bg-rose-500'}`} />

                <div className="pt-12 px-10 flex flex-col items-center relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex flex-col text-black text-center">
                            <span className="text-[14px] font-black uppercase tracking-[0.3em]">Check Cologne AI</span>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">Authentication Labs</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-center leading-none tracking-tighter uppercase mb-2 text-black">
                        Certificate <br/> <span className="text-neutral-400">of</span> Authenticity
                    </h1>
                    <div className="w-16 h-1 bg-black/10 rounded-full mb-10" />
                </div>

                <div className="px-10 mb-12 relative z-10">
                    <div className={`w-full py-8 rounded-[2rem] border-4 flex flex-col items-center justify-center gap-2 shadow-xl ${
                        isAuth 
                        ? 'border-[#00F2FF] bg-[#00F2FF]/5' 
                        : 'border-rose-500 bg-rose-500/5'
                    }`}>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Authentication Result</p>
                        <h2 className={`text-5xl font-black uppercase tracking-tight ${isAuth ? 'text-black' : 'text-rose-600'}`}>
                            {details.verdict}
                        </h2>
                        <div className="mt-2 flex items-center gap-2 px-4 py-1.5 bg-neutral-100 rounded-full">
                            <Award className={`w-3 h-3 ${isAuth ? 'text-[#00F2FF]' : 'text-rose-500'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-black">Confidence: {details.confidence}%</span>
                        </div>
                    </div>
                </div>

                <div className="px-10 space-y-8 relative z-10">
                    <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                        <div className="flex items-center gap-3 mb-4">
                            <User className="w-4 h-4 text-black opacity-40" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-black opacity-40">Certificate Owner</span>
                        </div>
                        <p className="text-2xl font-black uppercase tracking-tight leading-none text-black">{ownerName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-8 pb-8 border-b border-neutral-100">
                        <div>
                            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-2">Brand</p>
                            <p className="text-sm font-black uppercase text-black">{session.brand}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-2">Collection</p>
                            <p className="text-sm font-black uppercase truncate text-black">{session.collection}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-2">Specific Type</p>
                            <p className="text-sm font-black uppercase text-black">{session.specificType}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-2">Batch Code</p>
                            <p className="text-sm font-black uppercase truncate text-black">{details.batchCodeValue || 'Not Provided'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-2">Report ID</p>
                            <p className="text-sm font-black uppercase text-[#0090FF]">{caseId}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-2">Date Verified</p>
                            <p className="text-sm font-black uppercase text-black">{dateStr}</p>
                        </div>
                    </div>

                    <div className="py-2">
                        <div className="flex items-center gap-3 mb-4">
                            <Fingerprint className="w-4 h-4 text-black opacity-40" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-black opacity-40">Expert Findings</span>
                        </div>
                        <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 italic">
                             <p className="text-[11px] leading-relaxed text-neutral-800 font-medium">
                                "{details.reasoning}"
                             </p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-16 pb-20 px-10 flex flex-col items-center bg-white relative z-10">
                    <div className="w-full flex justify-between items-center mb-10">
                        <div className="bg-white p-2 border border-neutral-100 rounded-xl shadow-sm">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://checkcologne.ai/verify/${caseId}&color=000000`} 
                                className="w-20 h-20" 
                                alt="Verification QR" 
                            />
                        </div>
                        <div className="text-right max-w-[150px]">
                            <p className="text-[8px] font-black uppercase tracking-widest text-neutral-300 mb-2 text-black">Security Seal</p>
                            <p className="text-[9px] font-bold text-neutral-400 leading-tight uppercase">
                                Verified via Check Cologne AI Neural Engine v3.1.5-Pro.
                            </p>
                        </div>
                    </div>
                    
                    <div className="w-full h-px bg-neutral-100 mb-6" />
                    
                    <div className="flex items-center gap-2">
                         <ShieldCheck className="w-3 h-3 text-neutral-300" />
                         <span className="text-[7px] font-black uppercase tracking-[0.4em] text-neutral-300">
                            OFFICIAL CERTIFICATE • CHECK COLOGNE AI
                         </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ResultsView: React.FC<{ session: VerificationSession; ownerName: string; onBack: () => void }> = ({ session, ownerName, onBack }) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const { details } = session;
  const isAuth = details.verdict === 'AUTHENTIC';
  
  return (
    <div className="h-full bg-black safe-top flex flex-col animate-fade-in overflow-y-auto no-scrollbar">
      {showCertificate && <CertificateModal session={session} ownerName={ownerName} onClose={() => setShowCertificate(false)} />}
      
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">REPORT-ID-{session.id.slice(-8)}</span>
        <div className="w-9" />
      </div>

      <div className="p-6 space-y-8 pb-32">
        <button 
            onClick={() => setShowCertificate(true)}
            className="w-full p-6 bg-gradient-to-br from-[#00F2FF]/20 to-[#7000FF]/20 border border-white/10 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    <FileCheck className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <h4 className="font-black uppercase tracking-tight text-sm">Official Certificate</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Digital Authentication Proof</p>
                </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
        </button>

        <div className="bg-[#1A1D29] rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="flex justify-end items-start mb-8">
                <div className="w-24 h-16">
                     <img src={session.reportImage} className="w-full h-full object-contain mix-blend-screen opacity-80" alt="" />
                </div>
            </div>

            <div className="text-center mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{session.brand}</p>
                <h2 className="text-2xl font-black mb-1 text-white">{session.collection}</h2>
                <h3 className="text-lg font-bold text-white/60">{session.specificType}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 text-center">
                <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Authenticated</p>
                    <p className="text-[10px] font-bold text-white/60">{new Date(session.timestamp).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Batch Code</p>
                    <p className="text-[10px] font-bold text-white/60 truncate px-2">{details.batchCodeValue || 'N/A'}</p>
                </div>
            </div>
        </div>

        <div className="bg-[#141721] rounded-3xl p-8 border border-white/5 text-center relative shadow-lg">
            <h2 className={`text-4xl font-black uppercase tracking-[0.1em] mb-2 ${isAuth ? 'text-[#00F2FF]' : 'text-rose-500'}`}>
                {details.verdict}
            </h2>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-8">
                Confidence: {details.confidence}% • AI Verified
            </p>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-left mb-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Analysis Results</p>
                <p className="text-xs leading-relaxed text-white/60 font-medium italic">"{details.reasoning}"</p>
            </div>
            
            {details.performanceNotes && (
              <div className="p-6 bg-[#00F2FF]/5 rounded-2xl border border-[#00F2FF]/10 text-left mb-6">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#00F2FF]/60 mb-2">Your Performance Notes</p>
                  <p className="text-xs leading-relaxed text-[#00F2FF]/80 font-medium italic">"{details.performanceNotes}"</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
                {Object.entries(details.analysisPoints).map(([key, val]) => (
                    <div key={key} className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[7px] font-black uppercase tracking-widest text-white/20 mb-1">{key}</p>
                        <span className={`text-[9px] font-black ${val === 'PASS' ? 'text-emerald-500' : 'text-rose-500'}`}>{val}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
