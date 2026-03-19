
import React from 'react';
import { Camera, ShieldCheck, ArrowRight } from 'lucide-react';

interface PermissionModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({ onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/80 backdrop-blur-md" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-sm bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl animate-slide-up overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100 relative">
            <Camera className="w-10 h-10 text-accent" strokeWidth={1.5} />
            <div className="absolute -bottom-2 -right-2 bg-accent p-1.5 rounded-full shadow-lg">
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-4">
            Camera Access <br/> <span className="text-accent">Required</span>
          </h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
              To perform a forensic analysis, Genify requires access to your camera.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                "Our neural engine requires high-resolution imagery of branding, material quality, and serial codes to verify authenticity with 99.8% precision."
              </p>
            </div>
          </div>
          
          <div className="w-full space-y-3">
            <button 
              onClick={onConfirm}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
            >
              Grant Access <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 text-slate-300 hover:text-slate-500 font-black uppercase tracking-widest text-[9px] transition-colors"
            >
              Maybe Later
            </button>
          </div>
          
          <p className="mt-6 text-[8px] font-bold text-slate-200 uppercase tracking-[0.3em]">
            Privacy Protocol v3.1 Secured
          </p>
        </div>
      </div>
    </div>
  );
};
