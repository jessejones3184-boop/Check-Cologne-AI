
import React, { useState } from 'react';
import { X, Zap, Star, ShieldCheck, Loader2, CreditCard, ArrowRight, RefreshCw } from 'lucide-react';

interface SubscriptionOverlayProps {
    onSubscribe: () => void;
    onClose: () => void;
}

export const SubscriptionOverlay: React.FC<SubscriptionOverlayProps> = ({ onSubscribe, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const handleSubscribeClick = () => {
        setIsLoading(true);
        // PayPal Payment Link
        const PAYMENT_LINK = "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-6HU036412F082824GNE7DYPY"; 
        
        window.open(PAYMENT_LINK, '_blank');
        
        // In a real app with a backend, we would listen for a webhook here.
        // For this demo, we reset the loading state after a few seconds.
        setTimeout(() => setIsLoading(false), 3000);
    };

    const handleRestorePurchase = () => {
        setIsRestoring(true);
        // Simulate checking a database/server for the user's subscription
        setTimeout(() => {
            setIsRestoring(false);
            onSubscribe();
            alert("Purchase Restored Successfully!");
        }, 2000);
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
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full text-neutral-500 hover:bg-neutral-200 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8 text-center relative z-10">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-black/20">
                         <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Limit Reached</h2>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-[250px] mx-auto">
                        You've used your 3 free scans. Upgrade to Pro to continue.
                    </p>
                </div>

                <div className="space-y-4 mb-8 relative z-10">
                    <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                        <div className="p-2 bg-black rounded-lg">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-sm uppercase tracking-wide">Unlimited Scans</h3>
                            <p className="text-xs text-neutral-400 font-medium">No daily or monthly limits</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                        <div className="p-2 bg-black rounded-lg">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-sm uppercase tracking-wide">Pro Analytics</h3>
                            <p className="text-xs text-neutral-400 font-medium">Detailed valuation & legit checks</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="text-center mb-6">
                        <span className="text-4xl font-black tracking-tighter">$10.00</span>
                        <span className="text-neutral-400 font-bold uppercase text-xs tracking-wider"> / Month</span>
                    </div>

                    <button 
                        onClick={handleSubscribeClick}
                        disabled={isLoading || isRestoring}
                        className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group"
                    >
                         {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                            </>
                         ) : (
                            <>
                                <CreditCard className="w-4 h-4" /> Subscribe via PayPal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                         )}
                    </button>

                    <button 
                        onClick={handleRestorePurchase}
                        disabled={isLoading || isRestoring}
                        className="w-full py-3 bg-neutral-100 text-neutral-500 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                    >
                         {isRestoring ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                         {isRestoring ? 'Checking...' : 'Already Subscribed? Check Status'}
                    </button>
                    
                    <p className="text-center text-[10px] text-neutral-400 font-medium px-4">
                        Secure payments processed by PayPal. You can cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
};
