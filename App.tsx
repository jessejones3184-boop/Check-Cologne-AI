
import React, { useState, useEffect } from 'react';
import { HomeView } from './components/HomeView';
import { ResultsView } from './components/ResultsView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { BottomMenu } from './components/BottomMenu';
import { performAuthentication } from './services/geminiService';
import { VerificationSession, User } from './types';
import { FlaskConical, AlertCircle, RefreshCw, Key, ShieldX } from 'lucide-react';
import { SubscriptionOverlay } from './components/SubscriptionOverlay';

type MainView = 'home' | 'history' | 'profile';

interface SelectionState {
  itemName: string;
  batchCode: string;
  sellerInfo: string;
  notes: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<MainView | 'results'>('home');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorState, setErrorState] = useState<{ title: string; message: string; type: 'api' | 'data' | 'system' } | null>(null);
  const [isKeyValidating, setIsKeyValidating] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  const [pendingAnalysis, setPendingAnalysis] = useState<{ selection: SelectionState, files: File[] } | null>(null);
  const [currentSession, setCurrentSession] = useState<VerificationSession | null>(null);
  const [sessions, setSessions] = useState<VerificationSession[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (e) {
        console.error("User check failed", e);
      }
    };
    checkUser();

    const checkApiKey = async () => {
      try {
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } else {
          setHasApiKey(!!process.env.API_KEY);
        }
      } catch (e) {
        console.error("API Key check failed", e);
      } finally {
        setIsKeyValidating(false);
      }
    };
    checkApiKey();

    // Check for payment status in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      const sessionId = urlParams.get('session_id');
      
      const verifyPayment = async () => {
        if (sessionId) {
          try {
            await fetch('/api/stripe/verify-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId })
            });
          } catch (err) {
            console.error("Payment verification failed:", err);
          }
        }
        // Refresh user data from server
        checkUser();
        // Remove the param from URL without refreshing
        window.history.replaceState({}, document.title, window.location.pathname);
      };

      verifyPayment();
    }

    const savedSessions = localStorage.getItem('genify_history');
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const handleOpenKeyPicker = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
      setErrorState(null);
    }
  };

  const handleStartAnalysis = (selection: SelectionState, files: File[]) => {
    setPendingAnalysis({ selection, files });
    
    if (!user || (!user.isSubscribed && user.scansRemaining <= 0)) {
      setShowSubscription(true);
      return;
    }
    
    executeAnalysis(selection, files);
  };

  const executeAnalysis = async (selection: SelectionState, files: File[]) => {
    setIsProcessing(true);
    setErrorState(null);
    try {
      // Decrement scan count if not subscribed
      if (!user?.isSubscribed) {
        const scanRes = await fetch('/api/user/use-scan', { method: 'POST' });
        if (!scanRes.ok) {
          const errorData = await scanRes.json();
          if (errorData.error === "No scans remaining") {
            setShowSubscription(true);
            setIsProcessing(false);
            return;
          }
          throw new Error(errorData.error || "Failed to use scan");
        }
        const scanData = await scanRes.json();
        setUser(prev => prev ? { ...prev, scansRemaining: scanData.remaining } : null);
      }

      const fullContext = `
        AUTHENTICATING: ${selection.itemName}
        BATCH: ${selection.batchCode || 'None'}
        SOURCE: ${selection.sellerInfo || 'None'}
        NOTES: ${selection.notes || 'None'}
      `;

      const result = await performAuthentication(files, fullContext);
      const userImages = files.map(f => URL.createObjectURL(f));

      const session: VerificationSession = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        name: result.name,
        itemName: selection.itemName,
        userImages,
        reportImage: `https://tse2.mm.bing.net/th?q=${encodeURIComponent(selection.itemName)}&w=400&h=400&c=7&rs=1&p=0`,
        details: {
          ...result.details,
          itemName: selection.itemName,
          batchCodeValue: selection.batchCode || result.details.batchCodeValue,
          sellerInfo: selection.sellerInfo,
          performanceNotes: selection.notes
        }
      };

      const updatedSessions = [session, ...sessions];
      setSessions(updatedSessions);
      localStorage.setItem('genify_history', JSON.stringify(updatedSessions));
      
      setCurrentSession(session);
      setCurrentView('results');
    } catch (error: any) {
      console.error("Analysis Error:", error);
      const msg = error.message || "";
      
      if (msg.includes("API_KEY_INVALID") || msg.includes("entity was not found") || msg.includes("not valid")) {
        setErrorState({
          title: "Setup Required",
          message: "Please select a valid API key to continue with the analysis.",
          type: 'api'
        });
      } else {
        setErrorState({
          title: "Analysis Failed",
          message: "The AI encountered an issue. Please try again with fewer or clearer images.",
          type: 'system'
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all saved history? This cannot be undone.")) {
      setSessions([]);
      localStorage.removeItem('genify_history');
    }
  };

  const handleRetry = () => {
    if (errorState?.type === 'api') {
      handleOpenKeyPicker();
    } else if (pendingAnalysis) {
      executeAnalysis(pendingAnalysis.selection, pendingAnalysis.files);
    }
  };

  const handleSubscribe = async (priceType: 'single' | 'monthly') => {
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (data.error?.includes("Stripe Secret Key is missing")) {
          throw new Error("Stripe Secret Key is missing. Please set STRIPE_SECRET_KEY in the Settings menu.");
        }
        throw new Error(data.error || "Failed to create checkout session");
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from server");
      }
    } catch (e: any) {
      console.error("Payment failed", e);
      setErrorState({
        title: "Payment Error",
        message: e.message || "Could not initiate payment. Please check your configuration.",
        type: 'system'
      });
    }
  };

  if (isKeyValidating) {
    return (
      <div className="h-full w-full bg-white flex items-center justify-center">
        <FlaskConical className="w-10 h-10 text-accent animate-pulse" />
      </div>
    );
  }

  if (!hasApiKey && window.aistudio) {
    return (
      <div className="h-full w-full bg-white p-8 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
          <Key className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4 text-slate-900 leading-tight">Genify <br/> <span className="text-accent">AI Studio</span></h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-12 max-w-xs leading-relaxed">
          Please connect your API key to enable AI authentication services.
        </p>
        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={handleOpenKeyPicker}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
          >
            Connect Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white text-slate-900 font-sans flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {currentView === 'home' && <HomeView onStart={handleStartAnalysis} isProcessing={isProcessing} user={user} />}
        {currentView === 'history' && <HistoryView sessions={sessions} onClear={handleClearHistory} onSelect={(s) => { setCurrentSession(s); setCurrentView('results'); }} onBack={() => setCurrentView('home')} />}
        {currentView === 'profile' && <ProfileView user={user} onSubscribe={handleSubscribe} />}
        {currentView === 'results' && currentSession && <ResultsView session={currentSession} ownerName="User" onBack={() => setCurrentView('home')} />}

        {isProcessing && (
          <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12 animate-fade-in">
            <div className="relative w-32 h-32 mb-10">
              <div className="absolute inset-0 border-t-2 border-accent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FlaskConical className="w-10 h-10 text-slate-900 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
                <h2 className="text-xl font-black uppercase tracking-widest mb-2 text-slate-900 italic">Analyzing...</h2>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest animate-pulse">Running AI Verification</p>
            </div>
          </div>
        )}

        {errorState && (
          <div className="fixed inset-0 z-[120] bg-white/90 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-in">
             <div className="w-full max-w-sm bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl animate-slide-up flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-8 border border-rose-100">
                  {errorState.type === 'api' ? <Key className="w-8 h-8 text-rose-500" /> : <AlertCircle className="w-8 h-8 text-rose-500" />}
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-3 leading-tight">{errorState.title}</h2>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-10 leading-relaxed">{errorState.message}</p>
                <div className="w-full space-y-3">
                  <button onClick={handleRetry} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all">
                    {errorState.type === 'api' ? "Connect Key" : "Try Again"}
                  </button>
                  <button onClick={() => setErrorState(null)} className="w-full py-3 text-slate-300 font-black uppercase tracking-widest text-[9px]">Dismiss</button>
                </div>
             </div>
          </div>
        )}

        {showSubscription && (
          <SubscriptionOverlay 
            onSubscribe={handleSubscribe} 
            onClose={() => setShowSubscription(false)} 
          />
        )}
      </div>

      {['home', 'history', 'profile'].includes(currentView) && !isProcessing && (
        <BottomMenu activeTab={currentView as MainView} onTabChange={(tab) => setCurrentView(tab)} />
      )}
    </div>
  );
}
