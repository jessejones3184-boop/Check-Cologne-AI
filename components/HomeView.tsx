
import React, { useState, useEffect, useRef } from 'react';
import { Search, FlaskConical, ShieldCheck, Box, MessageSquare, Sparkles, User, Loader2, CheckCircle2, ChevronDown, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { getSuggestions } from '../services/geminiService';

interface SelectionState {
  collection: string;
  specificType: string;
  batchCode: string;
  sellerInfo: string;
  notes: string;
}

interface HomeViewProps {
  onStart: (data: SelectionState, files: File[]) => void;
  isProcessing: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStart, isProcessing }) => {
  const [selection, setSelection] = useState<SelectionState>({
    collection: '',
    specificType: '',
    batchCode: '',
    sellerInfo: '',
    notes: ''
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<'collection' | 'specificType' | null>(null);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!activeField) {
      setSuggestions([]);
      return;
    }
    
    const query = activeField === 'collection' ? selection.collection : selection.specificType;

    if (activeField === 'collection') {
      const runLocalSearch = async () => {
        const res = await getSuggestions('collection', { query });
        setSuggestions(res);
      };
      runLocalSearch();
      return;
    }

    if (activeField === 'specificType' && selection.collection) {
      setIsFetchingSuggestions(true);
      const timer = setTimeout(async () => {
        try {
          const res = await getSuggestions('specificType', {
            collection: selection.collection,
            query
          });
          setSuggestions(res);
        } catch (err) {
          setSuggestions([]);
        } finally {
          setIsFetchingSuggestions(false);
        }
      }, 100); // Shorter debounce for faster local catalog feel
      return () => clearTimeout(timer);
    }
  }, [selection.collection, selection.specificType, activeField]);

  const selectSuggestion = (val: string) => {
    if (activeField === 'collection') {
      setSelection({ ...selection, collection: val, specificType: '' });
    } else if (activeField === 'specificType') {
      setSelection({ ...selection, specificType: val });
    }
    setSuggestions([]);
    setActiveField(null);
  };

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFilesArray = Array.from(e.target.files) as File[];
      const allowedCount = Math.min(newFilesArray.length, 12 - files.length);
      const validFiles = newFilesArray.slice(0, allowedCount);
      
      const newFiles = [...files, ...validFiles];
      const newPreviews = [...previews, ...validFiles.map(f => URL.createObjectURL(f))];
      
      setFiles(newFiles);
      setPreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const isFormValid = selection.collection.trim() !== '' && 
                      selection.specificType.trim() !== '' &&
                      files.length >= 3;

  return (
    <div className="h-full bg-black safe-top flex flex-col overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <div className="px-6 py-8 flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00F2FF]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00F2FF]">Forensic Lab Node</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Neural DB Active</span>
            </div>
        </div>

        <div>
            <h1 className="text-4xl font-black tracking-tighter leading-none uppercase mb-1">Check Cologne AI</h1>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">Unified Authentication Entry</p>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Row 1: Collection / Line */}
        <div className="relative">
          <div className={`bg-[#111] p-6 rounded-[2rem] border transition-all ${activeField === 'collection' ? 'border-[#00F2FF] shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'border-white/5'}`}>
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-[#00F2FF]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Select Collection / Line</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selection.collection && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    <ChevronDown className="w-3.5 h-3.5 text-white/20" />
                  </div>
              </div>
              <input 
                  type="text"
                  value={selection.collection}
                  onFocus={() => setActiveField('collection')}
                  onChange={(e) => setSelection({...selection, collection: e.target.value})}
                  placeholder="e.g. Dior Sauvage..."
                  className="w-full bg-transparent text-xl font-black uppercase tracking-tight outline-none placeholder:text-white/5"
              />
          </div>
          {activeField === 'collection' && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl z-50 max-h-60 overflow-y-auto shadow-2xl animate-fade-in p-2">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onMouseDown={() => selectSuggestion(s)}
                    className="w-full p-4 text-left text-sm font-bold uppercase tracking-widest text-white/60 hover:text-[#00F2FF] hover:bg-white/5 rounded-xl transition-all border-b border-white/5 last:border-0"
                  >
                    {s}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Row 2: Specific Type */}
        <div className="relative">
          <div className={`bg-[#111] p-6 rounded-[2rem] border transition-all ${!selection.collection ? 'opacity-20 pointer-events-none' : ''} ${activeField === 'specificType' ? 'border-[#00F2FF] shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'border-white/5'}`}>
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-[#00F2FF]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Specific Version</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selection.specificType && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    <ChevronDown className="w-3.5 h-3.5 text-white/20" />
                  </div>
              </div>
              <input 
                  type="text"
                  value={selection.specificType}
                  onFocus={() => setActiveField('specificType')}
                  onChange={(e) => setSelection({...selection, specificType: e.target.value})}
                  placeholder={selection.collection ? `Version for ${selection.collection}...` : "Select collection first"}
                  className="w-full bg-transparent text-xl font-black uppercase tracking-tight outline-none placeholder:text-white/5"
              />
          </div>
          {activeField === 'specificType' && (suggestions.length > 0 || isFetchingSuggestions) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl z-50 max-h-60 overflow-y-auto shadow-2xl animate-fade-in p-2">
              {isFetchingSuggestions && suggestions.length === 0 ? (
                 <div className="p-8 flex flex-col items-center justify-center gap-3 text-white/20">
                    <Loader2 className="w-6 h-6 animate-spin text-[#00F2FF]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Identifying...</span>
                 </div>
              ) : (
                suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onMouseDown={() => selectSuggestion(s)}
                    className="w-full p-4 text-left text-sm font-bold uppercase tracking-widest text-white/60 hover:text-[#00F2FF] hover:bg-white/5 rounded-xl transition-all border-b border-white/5 last:border-0"
                  >
                    {s}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="py-2">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10 px-2">Analysis Context (Optional)</p>
        </div>

        <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-3 mb-4">
                <User className="w-4 h-4 text-white/20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Batch Code</span>
            </div>
            <input 
                type="text"
                value={selection.batchCode}
                onChange={(e) => setSelection({...selection, batchCode: e.target.value})}
                placeholder="Check base or box..."
                className="w-full bg-transparent text-sm font-black uppercase outline-none placeholder:text-white/5"
            />
        </div>

        <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-3 mb-4">
                <Box className="w-4 h-4 text-white/20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Listing Source</span>
            </div>
            <input 
                type="text"
                value={selection.sellerInfo}
                onChange={(e) => setSelection({...selection, sellerInfo: e.target.value})}
                placeholder="e.g. eBay, Mercari..."
                className="w-full bg-transparent text-sm font-black uppercase outline-none placeholder:text-white/5"
            />
        </div>

        <div className="bg-[#111] p-6 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-4 h-4 text-white/20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Observations</span>
            </div>
            <textarea 
                value={selection.notes}
                onChange={(e) => setSelection({...selection, notes: e.target.value})}
                placeholder="Performance, scent notes, spray quality..."
                className="w-full bg-transparent text-sm font-medium h-24 outline-none resize-none placeholder:text-white/5"
            />
        </div>

        {/* Evidence Intake Section - Located below Observations as requested */}
        <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="w-4 h-4 text-[#00F2FF]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Evidence Intake ({files.length}/12)</span>
                </div>
                <span className="text-[10px] font-bold text-[#00F2FF] uppercase tracking-widest">
                    {files.length < 3 ? `Min ${3 - files.length} more` : 'Verified Set'}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {previews.map((src, i) => (
                    <div key={i} className="aspect-[4/5] rounded-2xl bg-[#111] border border-white/5 relative overflow-hidden group">
                        <img src={src} className="w-full h-full object-cover" alt="" />
                        <button 
                            onClick={() => removeImage(i)} 
                            className="absolute top-2 right-2 p-1.5 bg-black/80 rounded-lg text-rose-500 shadow-xl backdrop-blur-md"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {files.length < 12 && (
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[4/5] rounded-2xl border-2 border-dashed border-white/10 bg-[#111] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all hover:bg-white/5"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white/40" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/30 text-center px-2">Add <br/>Evidence</span>
                    </button>
                )}
            </div>
            <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileAdd} 
            />
            
            <p className="px-2 text-[9px] font-bold text-white/20 uppercase leading-relaxed text-center italic">
                Pro Tip: Clear shots of the atomizer and batch code yield 99% accuracy.
            </p>
        </div>

        {/* Final Submission */}
        <div className="pt-6">
            <button 
                onClick={() => onStart(selection, files)}
                disabled={!isFormValid || isProcessing}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${
                    isFormValid && !isProcessing
                    ? 'bg-[#00F2FF] text-black shadow-[0_0_50px_-10px_rgba(0,242,255,0.4)] active:scale-95' 
                    : 'bg-white/5 text-white/10'
                }`}
            >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <FlaskConical className="w-5 h-5" />}
                {isProcessing ? 'Processing Forensic Data...' : 'Begin AI Authentication'}
            </button>
        </div>
      </div>
    </div>
  );
};
