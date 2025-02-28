export interface ThoughtData {
  thought: string;
  thoughtNumber: number;
  totalThoughts: number;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
  nextThoughtNeeded: boolean;
  phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification';
  dependencies?: number[];
  toolsUsed?: string[];
  complexity?: 'simple' | 'medium' | 'complex';
  status?: 'complete' | 'in-progress' | 'needs-revision';
  quality?: {
    coherence: number;
    depth: number;
    relevance: number;
    qualityScore: number;
    feedback: string[];
  };
  keywords?: string[];
  insightValue?: number;

  // New analytical properties
  classification?: 'hypothesis' | 'observation' | 'conclusion' | 'question' | 'solution';
  confidenceScore?: number;
  evidenceStrength?: number;
  assumptions?: string[];
  vector?: number[];  // For semantic analysis
  conceptsExtracted?: string[];
  contradictions?: Array<{ thoughtNumber: number; explanation: string }>;
  reflectionPrompts?: string[];
  
  // Prompt alignment properties
  promptAlignment?: number; // 0-10 score of how well a thought aligns with prompt
  promptRelevance?: Record<string, number>; // Relevance to different prompt aspects
  driftWarning?: string; // Warning if thought drifts from prompt
  suggestedCorrections?: string[]; // Suggestions to realign with prompt
} 