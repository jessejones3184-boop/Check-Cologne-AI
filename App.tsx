
import React, { useState, useEffect } from 'react';
import { HomeView } from './components/HomeView';
import { ResultsView } from './components/ResultsView';
import { AuthOverlay } from './components/AuthOverlay';
import { HistoryView } from './components/HistoryView';
import { BottomMenu } from './components/BottomMenu';
import { performAuthentication } from './services/geminiService';
import { VerificationSession } from './types';
import { FlaskConical } from 'lucide-react';

type MainView = 'home' | 'history';

interface SelectionState {
  collection: string;
  specificType: string;
  batchCode: string;
  sellerInfo: string;
  notes: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<MainView | 'results'>('home');
  const [userName, setUserName] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [pendingAnalysis, setPendingAnalysis] = useState<{ selection: SelectionState, files: File[] } | null>(null);
  const [currentSession, setCurrentSession] = useState<VerificationSession | null>(null);
  const [sessions, setSessions] = useState<VerificationSession[]>([]);
  
  useEffect(() => {
    const savedName = localStorage.getItem('checkcologne_user_name');
    if (savedName) setUserName(savedName);

    const savedSessions = localStorage.getItem('check_cologne_history');
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const handleStartAnalysis = (selection: SelectionState, files: File[]) => {
    if (!userName) {
      setPendingAnalysis({ selection, files });
      setShowNameInput(true);
      return;
    }
    executeAnalysis(selection, files);
  };

  const executeAnalysis = async (selection: SelectionState, files: File[]) => {
    setIsProcessing(true);
    try {
      const fullContext = `
        AUTHENTICATING: ${selection.collection} (${selection.specificType})
        USER PROVIDED BATCH: ${selection.batchCode || 'None'}
        LISTING INFO: ${selection.sellerInfo || 'None'}
        PERFORMANCE NOTES: ${selection.notes || 'None'}
      `;

      const result = await performAuthentication(files, fullContext);
      const userImages = files.map(f => URL.createObjectURL(f));
      
      const brandGuess = selection.collection.split(' ')[0] || result.details.brand;

      const session: VerificationSession = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        name: result.name,
        brand: brandGuess,
        collection: selection.collection,
        specificType: selection.specificType,
        userImages,
        reportImage: `https://tse2.mm.bing.net/th?q=${encodeURIComponent(selection.collection + " " + selection.specificType + " fragrance")}&w=400&h=400&c=7&rs=1&p=0`,
        details: {
          ...result.details,
          batchCodeValue: selection.batchCode || result.details.batchCodeValue,
          sellerInfo: selection.sellerInfo,
          performanceNotes: selection.notes
        }
      };

      const updatedSessions = [session, ...sessions];
      setSessions(updatedSessions);
      localStorage.setItem('check_cologne_history', JSON.stringify(updatedSessions));
      
      setCurrentSession(session);
      setCurrentView('results');
    } catch (error) {
      console.error(error);
      alert("Authentication failed. AI could not verify this unit. Please check photo quality.");
    } finally {
      setIsProcessing(false);
      setPendingAnalysis(null);
    }
  };

  const handleSetName = (name: string) => {
    setUserName(name);
    localStorage.setItem('checkcologne_user_name', name);
    setShowNameInput(false);
    if (pendingAnalysis) {
      executeAnalysis(pendingAnalysis.selection, pendingAnalysis.files);
    }
  };

  const isMainTab = ['home', 'history'].includes(currentView);

  return (
    <div className="h-full w-full bg-black text-white font-sans flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {currentView === 'home' && (
          <HomeView 
            onStart={handleStartAnalysis} 
            isProcessing={isProcessing}
          />
        )}
        
        {currentView === 'history' && (
          <HistoryView 
            sessions={sessions} 
            onSelect={(s) => {
              setCurrentSession(s);
              setCurrentView('results');
            }}
            onBack={() => setCurrentView('home')} 
          />
        )}
        
        {currentView === 'results' && currentSession && (
          <ResultsView 
            session={currentSession} 
            ownerName={userName || "Scout User"} 
            onBack={() => setCurrentView('home')} 
          />
        )}

        {/* High-Tech Analysis Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-12 overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-b from-[#00F2FF]/5 to-transparent pointer-events-none" />
            <div className="relative w-64 h-64 mb-16">
              <div className="absolute inset-0 border-[1px] border-white/5 rounded-full scale-110"></div>
              <div className="absolute inset-0 border-t-2 border-[#00F2FF] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FlaskConical className="w-20 h-20 text-white animate-pulse" strokeWidth={1} />
              </div>
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00F2FF]/40 blur-md animate-scan-line" />
            </div>
            <div className="text-center space-y-6 relative z-10">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Analyzing</h2>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl animate-fade-in [animation-delay:0.2s]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF] animate-pulse" />
                        <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">Batch Identification</p>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl animate-fade-in [animation-delay:0.4s]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF] animate-pulse" />
                        <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">Silhouette Matching</p>
                    </div>
                </div>
            </div>
          </div>
        )}

        {showNameInput && <AuthOverlay onLogin={(_, name) => handleSetName(name)} onClose={() => setShowNameInput(false)} />}
      </div>

      {isMainTab && !isProcessing && (
        <BottomMenu 
          activeTab={currentView as MainView} 
          onTabChange={(tab) => setCurrentView(tab)} 
        />
      )}
    </div>
  );
}
