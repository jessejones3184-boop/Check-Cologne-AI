
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  scansRemaining: number;
  isSubscribed: boolean;
}

export type Verdict = 'AUTHENTIC' | 'REPLICA' | 'INCONCLUSIVE';

export interface AuthDetails {
  itemName: string;
  verdict: Verdict;
  confidence: number;
  reasoning: string;
  analysisPoints: {
    branding: 'PASS' | 'FAIL' | 'FLAGGED';
    buildQuality: 'PASS' | 'FAIL' | 'FLAGGED';
    packaging: 'PASS' | 'FAIL' | 'FLAGGED';
  };
  batchCodeValue?: string;
  sellerInfo?: string;
  performanceNotes?: string;
  sources: Array<{ title: string; uri: string }>;
}

export interface VerificationSession {
  id: string;
  timestamp: number;
  name: string;
  itemName: string;
  userImages: string[];
  reportImage: string;
  details: AuthDetails;
}
