
import React, { useState } from 'react';
import { X, Zap, Star, ShieldCheck, Loader2, CreditCard, ArrowRight, RefreshCw } from 'lucide-react';

interface SubscriptionOverlayProps {
    onSubscribe: (priceType: 'single' | 'monthly') => void;
    onClose: () => void;
}

export const SubscriptionOverlay: React.FC<SubscriptionOverlayProps> = ({ onSubscribe, onClose }) => {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleSubscribeClick = (type: 'single' | 'monthly') => {
        setIsLoading(type);
        onSubscribe(type);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity animate-in fade-in duration-300" 
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="bg-white w-full max-w-md m-4 rounded-[2rem] p-8 relative pointer-events-auto shadow-2xl transform transition-all animate-in slide-in-from-bottom duration-500 overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full text-neutral-500 hover:bg-neutral-200 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8 text-center relative z-10">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-black/20">
                         <Star className="w-8 h-8 text-cyan-400 fill-cyan-400" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Get More Scans</h2>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-[250px] mx-auto">
                        Choose the plan that fits your needs. AI Authentication requires high computing power.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-8 relative z-10">
                    {/* Single Scan */}
                    <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col items-center text-center">
                        <h3 className="font-black text-sm uppercase tracking-wide mb-1">Single Scan</h3>
                        <div className="text-2xl font-black tracking-tight mb-4">$2.99</div>
                        <button 
                            onClick={() => handleSubscribeClick('single')}
                            disabled={!!isLoading}
                            className="w-full py-3 bg-white border-2 border-neutral-200 text-black rounded-xl font-bold uppercase tracking-widest text-[10px] hover:border-black transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading === 'single' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CreditCard className="w-3 h-3" />}
                            {isLoading === 'single' ? 'Processing...' : 'Buy 1 Scan'}
                        </button>
                    </div>

                    {/* Unlimited Monthly */}
                    <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg">Best Value</div>
                        <h3 className="font-black text-sm uppercase tracking-wide mb-1">Unlimited Pro</h3>
                        <div className="text-2xl font-black tracking-tight mb-4">$7.99<span className="text-[10px] text-slate-400">/mo</span></div>
                        <button 
                            onClick={() => handleSubscribeClick('monthly')}
                            disabled={!!isLoading}
                            className="w-full py-3 bg-cyan-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                        >
                            {isLoading === 'monthly' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                            {isLoading === 'monthly' ? 'Processing...' : 'Go Unlimited'}
                        </button>
                    </div>
                </div>

                <p className="text-center text-[10px] text-neutral-400 font-medium px-4 relative z-10">
                    Secure payments processed by Stripe. Cancel monthly anytime.
                </p>
            </div>
        </div>
    );
};
