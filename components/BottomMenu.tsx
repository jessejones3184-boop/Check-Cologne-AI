
import React from 'react';
import { Home, History, User } from 'lucide-react';

type MainView = 'home' | 'history' | 'profile';

interface BottomMenuProps {
    activeTab: MainView;
    onTabChange: (tab: MainView) => void;
}

export const BottomMenu: React.FC<BottomMenuProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-8 left-8 right-8 z-40 animate-slide-up flex justify-center">
        <div className="glass rounded-full px-4 py-2 flex items-center gap-2 shadow-xl shadow-slate-200/50">
            <button 
                onClick={() => onTabChange('home')}
                className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${activeTab === 'home' ? 'text-accent bg-accent/5' : 'text-slate-300'}`}
            >
                <Home className="w-6 h-6" />
            </button>

            <button 
                onClick={() => onTabChange('history')}
                className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${activeTab === 'history' ? 'text-accent bg-accent/5' : 'text-slate-300'}`}
            >
                <History className="w-6 h-6" />
            </button>

            <button 
                onClick={() => onTabChange('profile')}
                className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${activeTab === 'profile' ? 'text-accent bg-accent/5' : 'text-slate-300'}`}
            >
                <User className="w-6 h-6" />
            </button>
        </div>
    </div>
  );
};
