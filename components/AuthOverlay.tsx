
import React, { useState } from 'react';
import { X, Check, Loader2, ArrowRight, User } from 'lucide-react';

interface AuthOverlayProps {
    onLogin: (email: string, name: string) => void;
    onClose: () => void;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ onLogin, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        setIsLoading(true);
        setTimeout(() => {
            onLogin('no-email@provided.com', name);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity animate-in fade-in duration-300" 
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="bg-white w-full max-w-md m-4 rounded-[2rem] p-8 relative pointer-events-auto shadow-2xl transform transition-all animate-in slide-in-from-bottom duration-500">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full text-neutral-500 hover:bg-neutral-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-black/20">
                         <User className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-black">Personalize Certificate</h2>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-[250px] mx-auto">
                        Enter your name as you'd like it to appear on your official Digital Certificate.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-right duration-300">
                     <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">Full Name</label>
                        <input 
                            type="text" 
                            required
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full p-4 bg-neutral-50 rounded-xl font-bold text-sm text-black border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:font-medium placeholder:text-neutral-300"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={isLoading || !name.trim()}
                        className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-2 transition-all shadow-lg ${
                            name.trim() ? 'bg-black text-white hover:scale-[1.02] active:scale-95' : 'bg-neutral-100 text-neutral-300'
                        }`}
                    >
                         {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        {isLoading ? 'Setting Name...' : 'Start Authentication'}
                    </button>
                </form>
                
                <p className="mt-8 text-center text-[10px] text-neutral-400 font-medium uppercase tracking-widest">
                    One-time setup for your vault.
                </p>
            </div>
        </div>
    );
};
