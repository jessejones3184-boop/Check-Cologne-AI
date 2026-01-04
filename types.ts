
export type Verdict = 'AUTHENTIC' | 'REPLICA' | 'INCONCLUSIVE';

export interface AuthDetails {
  brand: string;
  model: string;
  collection: string;
  specificType: string;
  concentration: string;
  volume: string;
  verdict: Verdict;
  confidence: number;
  reasoning: string;
  analysisPoints: {
    atomizer: 'PASS' | 'FAIL' | 'FLAGGED';
    glassQuality: 'PASS' | 'FAIL' | 'FLAGGED';
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
  brand: string;
  collection: string;
  specificType: string;
  userImages: string[];
  reportImage: string;
  details: AuthDetails;
}
