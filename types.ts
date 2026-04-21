
export interface ExpressionData {
  tissue: string;
  value: number; // TPM or FPKM
}

export interface BindingSiteDistribution {
  region: string; // e.g., "3'UTR", "CDS", "Intron"
  percentage: number;
}

export interface TargetGene {
  geneName: string;
  geneId: string;
  geneType: string;
  protocol: string;
  peakCount: number;
}

export interface PeakData {
  chr: string;
  start: number;
  end: number;
  strand: string;
  region?: string; // Added to support genomic context from screenshot
  enrichment: number;
  pvalue: number;
}

export interface Motif {
  rank: number;
  sequence: string;
  length: number;
  targetPercent: string;
  targetCount: number;
  pValue: string;
}

export interface RbpRecord {
  id: string;
  name: string;
  geneId: string;
  geneType: string; 
  targets: string[]; 
  cellLines: string[];
  methods: string[];
  protocol: string; 
  bindingSitesCount: number; 
  description: string;
  domains: string[]; // New: Protein domains
  geneFunction: string; // New: Main function
  expressionProfile: ExpressionData[]; 
  bindingDistribution: BindingSiteDistribution[]; 
  motifs?: Motif[]; // New: Motif data
}

export interface FilterState {
  targets: string[];
  cellLines: string[];
  methods: string[];
}

export type FilterCategory = 'targets' | 'cellLines' | 'methods';
