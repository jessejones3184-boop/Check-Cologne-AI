
import React from 'react';
import { LayoutGrid, History } from 'lucide-react';

type MainView = 'home' | 'history';

interface BottomMenuProps {
    activeTab: MainView;
    onTabChange: (tab: MainView) => void;
}

export const BottomMenu: React.FC<BottomMenuProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-8 left-6 right-6 z-40 animate-slide-up">
        {/* Floating Glass Bar */}
        <div className="ios-blur rounded-[2.5rem] p-2 flex justify-center items-center shadow-2xl border border-white/10 max-w-xs mx-auto gap-2">
            
            <button 
                onClick={() => onTabChange('history')}
                className={`flex-1 flex flex-col items-center justify-center py-4 rounded-[2rem] transition-all duration-300 relative overflow-hidden group ${activeTab === 'history' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
            >
                {activeTab === 'history' && (
                    <div className="absolute inset-0 bg-white/10 rounded-[2rem] shadow-lg animate-fade-in" />
                )}
                
                <div className="relative z-10 flex flex-col items-center">
                    <History className={`w-5 h-5 mb-1 transition-transform duration-300 ${activeTab === 'history' ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Vault</span>
                </div>
            </button>

            <button 
                onClick={() => onTabChange('home')}
                className={`flex-1 flex flex-col items-center justify-center py-4 rounded-[2rem] transition-all duration-300 relative overflow-hidden group ${activeTab === 'home' ? 'text-[#00F2FF]' : 'text-white/30 hover:text-white/60'}`}
            >
                {activeTab === 'home' && (
                    <div className="absolute inset-0 bg-[#00F2FF]/10 rounded-[2rem] shadow-lg animate-fade-in" />
                )}
                <div className="relative z-10 flex flex-col items-center">
                    <LayoutGrid className={`w-5 h-5 mb-1 transition-transform duration-300 ${activeTab === 'home' ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Home</span>
                </div>
            </button>
        </div>
    </div>
  );
};
