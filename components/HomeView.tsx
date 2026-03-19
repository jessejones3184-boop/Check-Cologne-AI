
import React, { useState, useRef } from 'react';
import { Search, FlaskConical, Sparkles, Plus, Trash2, ShieldAlert, Zap, User as UserIcon, Info, Fingerprint } from 'lucide-react';
import { PermissionModal } from './PermissionModal';
import { User } from '../types';

interface SelectionState {
  itemName: string;
  batchCode: string;
  sellerInfo: string;
  notes: string;
}

interface HomeViewProps {
  onStart: (data: SelectionState, files: File[]) => void;
  isProcessing: boolean;
  user: User | null;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStart, isProcessing, user }) => {
  const [selection, setSelection] = useState<SelectionState>({
    itemName: '',
    batchCode: '',
    sellerInfo: '',
    notes: ''
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<'itemName' | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFilesArray = Array.from(e.target.files) as File[];
      const validFiles = newFilesArray.slice(0, 12 - files.length);
      const newPreviews = validFiles.map(f => URL.createObjectURL(f));
      setFiles([...files, ...validFiles]);
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const f = [...files]; f.splice(index, 1);
    const p = [...previews]; p.splice(index, 1);
    setFiles(f); setPreviews(p);
  };

  // Updated validation logic: minimum 1 photo required
  const isFormValid = selection.itemName.trim() !== '' && 
                      files.length >= 1;

  return (
    <div className="h-full bg-white safe-top flex flex-col overflow-y-auto no-scrollbar pb-40">
      {showPermissionModal && <PermissionModal onConfirm={() => { localStorage.setItem('camera_permission_explained', 'true'); setShowPermissionModal(false); setTimeout(() => fileInputRef.current?.click(), 100); }} onClose={() => setShowPermissionModal(false)} />}

      <div className="px-8 py-12 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase leading-tight mb-2 text-slate-900">Genify</h1>
        </div>
        {user && (
          <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
            <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {user.isSubscribed ? 'Unlimited' : `${user.scansRemaining} Scans`}
            </span>
          </div>
        )}
      </div>

      <div className="px-8 space-y-6">
        <div className="relative">
          <div className={`bg-slate-50 p-6 rounded-[2rem] border transition-all ${activeField === 'itemName' ? 'border-accent bg-white shadow-lg' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3 mb-3">
                  <Search className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Item Name</span>
              </div>
              <input type="text" value={selection.itemName} onFocus={() => setActiveField('itemName')} onChange={(e) => setSelection({...selection, itemName: e.target.value})} className="w-full bg-transparent text-xl font-bold uppercase outline-none placeholder:text-slate-200 text-slate-900" />
          </div>
          {/* Suggestions removed */}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                    <Fingerprint className="w-3 h-3 text-slate-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Batch / Serial</span>
                </div>
                <input type="text" placeholder="Optional" value={selection.batchCode} onChange={(e) => setSelection({...selection, batchCode: e.target.value})} className="w-full bg-transparent text-xs font-bold uppercase outline-none text-accent placeholder:text-slate-200" />
            </div>
            <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="w-3 h-3 text-slate-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Extra Info</span>
                </div>
                <input type="text" placeholder="Optional" value={selection.sellerInfo} onChange={(e) => setSelection({...selection, sellerInfo: e.target.value})} className="w-full bg-transparent text-xs font-bold uppercase outline-none text-accent placeholder:text-slate-200" />
            </div>
        </div>

        <div className="pt-6 space-y-4">
            <div className="px-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Photos ({files.length}/12)</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {previews.map((src, i) => (
                    <div key={i} className="aspect-square rounded-[1.5rem] bg-slate-100 border border-slate-200 relative overflow-hidden">
                        <img src={src} className="w-full h-full object-cover" alt="" />
                        <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-xl text-rose-500 shadow-sm transition-transform active:scale-90"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                ))}
                {files.length < 12 && (
                    <button onClick={() => { if (!localStorage.getItem('camera_permission_explained')) setShowPermissionModal(true); else fileInputRef.current?.click(); }} className="aspect-square rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                        <Plus className="w-6 h-6 text-slate-300" />
                    </button>
                )}
            </div>
            <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={handleFileAdd} />
        </div>

        <div className="pt-8">
            <button onClick={() => onStart(selection, files)} disabled={!isFormValid || isProcessing} className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all ${isFormValid && !isProcessing ? 'bg-slate-900 text-white shadow-xl active:scale-95' : 'bg-slate-100 text-slate-200'}`}>
                {isProcessing ? 'Verifying...' : 'Verify Now'}
            </button>
        </div>
      </div>
    </div>
  );
};
