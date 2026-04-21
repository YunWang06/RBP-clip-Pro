
import { RbpRecord, TargetGene, PeakData, Motif } from './types';

export const TARGET_TYPES = [
  "mRNA",
  "lncRNA",
  "miRNA",
  "circRNA",
  "snoRNA/snRNA",
  "tRNA",
  "rRNA"
];

export const CELL_LINES = [
  "HEK293T",
  "HeLa",
  "K562",
  "HepG2",
  "MCF-7",
  "A549",
  "Jurkat",
  "SH-SY5Y",
  "U2OS",
  "HCT116",
  "LoVo",
  "GM12878",
  "PC-3",
  "MDA-MB-231"
];

export const METHODS = [
  "eCLIP",
  "iCLIP",
  "PAR-CLIP",
  "HITS-CLIP",
  "CLIP-seq",
  "RIP-seq",
  "uvCLAP",
  "CRAC"
];

const DOMAINS = ["RRM", "Zinc Finger", "KH domain", "Helicase", "ATPase", "Double-stranded RNA binding", "DEAD box"];
const FUNCTIONS = ["Splicing regulation", "mRNA stability", "Translation control", "miRNA processing", "RNA transport", "Ribosome biogenesis", "Transcription regulation"];

// Helper to generate consistent pseudo-random numbers for mock charts
const pseudoRandom = (seed: string) => {
  let value = 0;
  for (let i = 0; i < seed.length; i++) {
    value += seed.charCodeAt(i);
  }
  return value;
};

const getMockExpression = (id: string) => {
  const seed = pseudoRandom(id);
  return [
    { tissue: 'Brain', value: (seed % 50) + 10 },
    { tissue: 'Liver', value: ((seed * 2) % 60) + 5 },
    { tissue: 'Lung', value: ((seed * 3) % 40) + 15 },
    { tissue: 'Heart', value: ((seed * 4) % 30) + 5 },
    { tissue: 'Kidney', value: ((seed * 5) % 45) + 10 },
  ];
};

const getMockDistribution = (id: string) => {
  const seed = pseudoRandom(id);
  const v1 = (seed % 40) + 10; // 3'UTR
  const v2 = ((seed * 2) % 30) + 10; // CDS
  const v3 = ((seed * 3) % 20) + 5; // 5'UTR
  const v4 = 100 - v1 - v2 - v3; // Intron
  return [
    { region: "3' UTR", percentage: v1 },
    { region: "CDS", percentage: v2 },
    { region: "5' UTR", percentage: v3 },
    { region: "Intron", percentage: v4 > 0 ? v4 : 0 },
  ];
};

export const getMockTargets = (rbpId: string): TargetGene[] => {
  // Data matching the screenshot provided for TAF15 and others
  const targets: TargetGene[] = [
    { geneName: 'PPP2R2A', geneId: 'ENSG00000022375', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 913 },
    { geneName: 'ERC1', geneId: 'ENSG00000027823', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 855 },
    { geneName: 'GPI', geneId: 'ENSG00000105220', geneType: 'protein_coding', protocol: 'eCLIP', peakCount: 736 },
    { geneName: 'SLIT2', geneId: 'ENSG00000187642', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 664 },
    { geneName: 'EEF1D', geneId: 'ENSG00000104529', geneType: 'protein_coding', protocol: 'eCLIP', peakCount: 640 },
    { geneName: 'ERC1', geneId: 'ENSG00000027823', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 531 },
    { geneName: 'PPP2R2A', geneId: 'ENSG00000022375', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 484 },
    { geneName: 'ANKRD11', geneId: 'ENSG00000167522', geneType: 'protein_coding', protocol: 'eCLIP', peakCount: 479 },
    { geneName: 'MAPK10', geneId: 'ENSG00000109339', geneType: 'protein_coding', protocol: 'HITS-CLIP', peakCount: 460 },
    { geneName: 'MATR3', geneId: 'ENSG00000280987', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 451 },
    { geneName: 'DLEU2', geneId: 'ENSG00000231607', geneType: 'antisense_RNA', protocol: 'PAR-CLIP', peakCount: 436 },
    { geneName: 'SEPT9', geneId: 'ENSG00000184640', geneType: 'protein_coding', protocol: 'eCLIP', peakCount: 428 },
    { geneName: 'RBM39', geneId: 'ENSG00000131051', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 425 },
    { geneName: 'CTBP2', geneId: 'ENSG00000175029', geneType: 'protein_coding', protocol: 'eCLIP', peakCount: 410 },
    { geneName: 'CNOT2', geneId: 'ENSG00000111596', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 401 },
    { geneName: 'PLCB1', geneId: 'ENSG00000182621', geneType: 'protein_coding', protocol: 'eCLIP', peakCount: 397 },
    { geneName: 'XIST', geneId: 'ENSG00000229807', geneType: 'lincRNA', protocol: 'PAR-CLIP', peakCount: 378 },
    { geneName: 'AGAP1', geneId: 'ENSG00000157985', geneType: 'protein_coding', protocol: 'eCLIP', peakCount: 374 },
    { geneName: 'CADM1', geneId: 'ENSG00000182985', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 365 },
    { geneName: 'SLIT2', geneId: 'ENSG00000187642', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 354 },
    { geneName: 'UBE2D3', geneId: 'ENSG00000109332', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 352 },
    { geneName: 'MIR99AHG', geneId: 'ENSG00000215417', geneType: 'lincRNA', protocol: 'PAR-CLIP', peakCount: 348 },
    { geneName: 'HNRNPC', geneId: 'ENSG00000092199', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 334 },
    { geneName: 'NFIA', geneId: 'ENSG00000162599', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 308 },
    { geneName: 'C22orf34', geneId: 'ENSG00000188511', geneType: 'lincRNA', protocol: 'eCLIP', peakCount: 305 },
    { geneName: 'CACNB4', geneId: 'ENSG00000188257', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 293 },
    { geneName: 'DMTF1', geneId: 'ENSG00000135164', geneType: 'protein_coding', protocol: 'PAR-CLIP', peakCount: 281 },
  ];
  return targets;
};

export const getMockPeaks = (targetGene: string): PeakData[] => {
  // Updated data for PPP2R2A based on the second screenshot
  if (targetGene === 'PPP2R2A') {
    return [
        { chr: 'chr8', start: 26361200, end: 26361350, strand: '+', region: 'CDS', enrichment: 0.64, pvalue: 1.2e-5 },
        { chr: 'chr8', start: 26361400, end: 26361550, strand: '+', region: 'CDS', enrichment: 0.64, pvalue: 1.2e-5 },
        { chr: 'chr8', start: 26361600, end: 26361750, strand: '+', region: 'CDS', enrichment: 0.729, pvalue: 1.5e-6 },
        { chr: 'chr8', start: 26361800, end: 26361950, strand: '+', region: 'CDS', enrichment: 0.729, pvalue: 1.5e-6 },
        { chr: 'chr8', start: 26370050, end: 26370200, strand: '+', region: 'CDS', enrichment: 0.662, pvalue: 1.8e-5 },
        { chr: 'chr8', start: 26370300, end: 26370450, strand: '+', region: 'CDS', enrichment: 0.662, pvalue: 1.8e-5 },
        { chr: 'chr8', start: 26370500, end: 26370650, strand: '+', region: 'CDS', enrichment: 0.662, pvalue: 1.8e-5 },
        { chr: 'chr8', start: 26371000, end: 26371150, strand: '+', region: 'UTR3', enrichment: 0.864, pvalue: 1.0e-6 },
        { chr: 'chr8', start: 26371200, end: 26371350, strand: '+', region: 'UTR3', enrichment: 0.593, pvalue: 2.1e-5 },
        { chr: 'chr8', start: 26371400, end: 26371550, strand: '+', region: 'UTR3', enrichment: 0.609, pvalue: 1.9e-5 },
        { chr: 'chr8', start: 26372000, end: 26372150, strand: '+', region: 'UTR3', enrichment: 0.627, pvalue: 1.7e-5 },
        { chr: 'chr8', start: 26372200, end: 26372350, strand: '+', region: 'UTR3', enrichment: 0.732, pvalue: 1.4e-5 },
        { chr: 'chr8', start: 26294000, end: 26294150, strand: '+', region: 'Intron', enrichment: 0.739, pvalue: 1.3e-5 },
        { chr: 'chr8', start: 26294200, end: 26294350, strand: '+', region: 'Intron', enrichment: 0.739, pvalue: 1.3e-5 },
        { chr: 'chr8', start: 26294400, end: 26294550, strand: '+', region: 'Intron', enrichment: 0.739, pvalue: 1.3e-5 },
        { chr: 'chr8', start: 26294600, end: 26294750, strand: '+', region: 'Intron', enrichment: 0.739, pvalue: 1.3e-5 },
        { chr: 'chr8', start: 26294800, end: 26294950, strand: '+', region: 'Intron', enrichment: 0.739, pvalue: 1.3e-5 },
        { chr: 'chr8', start: 26295000, end: 26295150, strand: '+', region: 'Intron', enrichment: 0.739, pvalue: 1.3e-5 },
    ];
  }

  // Mock BED-like data
  const seed = pseudoRandom(targetGene);
  const peaks: PeakData[] = [];
  const chr = `chr${(seed % 22) + 1}`;
  const regions = ['CDS', 'UTR3', 'Intron', 'UTR5'];
  
  for(let i=0; i<15; i++) {
    const start = 1000000 + (i * 5000) + (seed * 10);
    peaks.push({
      chr: chr,
      start: start,
      end: start + 150 + (seed % 50),
      strand: seed % 2 === 0 ? '+' : '-',
      region: regions[i % 4],
      enrichment: 4.5 + (i * 0.2),
      pvalue: 0.001 / (i + 1)
    });
  }
  return peaks;
};

// Specific Motif Data for TAF15
const TAF15_MOTIFS: Motif[] = [
  { rank: 1, sequence: "DGCAGC", length: 6, targetPercent: "30.00%", targetCount: 979, pValue: "1e-16" },
  { rank: 2, sequence: "AGRGC", length: 5, targetPercent: "58.90%", targetCount: 1922, pValue: "1e-13" },
  { rank: 3, sequence: "CTTACC", length: 6, targetPercent: "6.10%", targetCount: 199, pValue: "1e-11" },
  { rank: 4, sequence: "GGACCG", length: 6, targetPercent: "45.27%", targetCount: 1477, pValue: "1e-9" },
  { rank: 5, sequence: "TASGGA", length: 6, targetPercent: "8.55%", targetCount: 279, pValue: "1e-9" },
  { rank: 6, sequence: "GTGYT", length: 5, targetPercent: "40.15%", targetCount: 1310, pValue: "1e-9" },
  { rank: 7, sequence: "TAGGWA", length: 6, targetPercent: "37.85%", targetCount: 1235, pValue: "1e-9" },
  { rank: 8, sequence: "CGTA", length: 4, targetPercent: "60.37%", targetCount: 1970, pValue: "1e-9" },
  { rank: 9, sequence: "GGATCT", length: 6, targetPercent: "14.59%", targetCount: 476, pValue: "1e-8" },
  { rank: 10, sequence: "ATATC", length: 5, targetPercent: "23.51%", targetCount: 767, pValue: "1e-7" },
];

// Data parsed from provided CSV
const rawCsvData = [
  { name: "AAGAB", id: "ENSG00000103591", type: "protein_coding", protocol: "eCLIP", num: 6 },
  { name: "AAMDC", id: "ENSG00000087884", type: "protein_coding", protocol: "eCLIP", num: 6 },
  { name: "AAMP", id: "ENSG00000127837", type: "protein_coding", protocol: "eCLIP", num: 4 },
  { name: "AARS", id: "ENSG00000090861", type: "protein_coding", protocol: "eCLIP", num: 6 },
  { name: "ABCA2", id: "ENSG00000107331", type: "protein_coding", protocol: "eCLIP", num: 31 },
  { name: "ABCA7", id: "ENSG00000064687", type: "protein_coding", protocol: "eCLIP", num: 28 },
  { name: "ABCB8", id: "ENSG00000197150", type: "protein_coding", protocol: "eCLIP", num: 17 },
  { name: "ABCC1", id: "ENSG00000103222", type: "protein_coding", protocol: "eCLIP", num: 20 },
  { name: "ABCC4", id: "ENSG00000125257", type: "protein_coding", protocol: "eCLIP", num: 24 },
  { name: "ABHD16A", id: "ENSG00000204427", type: "protein_coding", protocol: "eCLIP", num: 16 },
  { name: "ABI1", id: "ENSG00000136754", type: "protein_coding", protocol: "eCLIP", num: 25 },
  { name: "ABL1", id: "ENSG00000097007", type: "protein_coding", protocol: "eCLIP", num: 22 },
  { name: "AC002066.1", id: "ENSG00000237813", type: "antisense_RNA", protocol: "eCLIP", num: 2 },
  { name: "AC002480.4", id: "ENSG00000238033", type: "lincRNA", protocol: "eCLIP", num: 1 },
  { name: "AC005154.1", id: "ENSG00000196295", type: "processed_transcript", protocol: "eCLIP", num: 24 },
  { name: "AC008764.4", id: "ENSG00000268790", type: "protein_coding", protocol: "eCLIP", num: 35 },
  { name: "ACACA", id: "ENSG00000278540", type: "protein_coding", protocol: "eCLIP", num: 27 },
  { name: "ACADVL", id: "ENSG00000072778", type: "protein_coding", protocol: "eCLIP", num: 26 },
  { name: "ACAP3", id: "ENSG00000131584", type: "protein_coding", protocol: "eCLIP", num: 17 },
  { name: "ACER3", id: "ENSG00000078124", type: "protein_coding", protocol: "eCLIP", num: 35 },
  { name: "ACIN1", id: "ENSG00000100813", type: "protein_coding", protocol: "eCLIP", num: 37 },
  { name: "ACSL4", id: "ENSG00000068366", type: "protein_coding", protocol: "eCLIP", num: 41 },
  { name: "ACSS2", id: "ENSG00000131069", type: "protein_coding", protocol: "eCLIP", num: 78 },
  { name: "ACTB", id: "ENSG00000075624", type: "protein_coding", protocol: "eCLIP", num: 10 },
  { name: "ACTN4", id: "ENSG00000130402", type: "protein_coding", protocol: "eCLIP", num: 23 },
  { name: "ADAM10", id: "ENSG00000137845", type: "protein_coding", protocol: "eCLIP", num: 49 },
  { name: "ADAMTS14", id: "ENSG00000138316", type: "protein_coding", protocol: "eCLIP", num: 48 },
  { name: "ADARB1", id: "ENSG00000197381", type: "protein_coding", protocol: "eCLIP", num: 80 },
  { name: "ADGRD1", id: "ENSG00000111452", type: "protein_coding", protocol: "eCLIP", num: 41 },
  { name: "ADGRV1", id: "ENSG00000164199", type: "protein_coding", protocol: "eCLIP", num: 39 },
  { name: "AGO2", id: "ENSG00000123908", type: "protein_coding", protocol: "eCLIP", num: 29 },
  { name: "AGPAT3", id: "ENSG00000160216", type: "protein_coding", protocol: "eCLIP", num: 39 },
  { name: "AHDC1", id: "ENSG00000126705", type: "protein_coding", protocol: "eCLIP", num: 52 },
  { name: "AKAP9", id: "ENSG00000127914", type: "protein_coding", protocol: "eCLIP", num: 36 },
  { name: "AKT1", id: "ENSG00000142208", type: "protein_coding", protocol: "eCLIP", num: 76 },
  { name: "AKT2", id: "ENSG00000105221", type: "protein_coding", protocol: "eCLIP", num: 41 },
  { name: "ALG13", id: "ENSG00000101901", type: "protein_coding", protocol: "eCLIP", num: 40 },
  { name: "ANK1", id: "ENSG00000029534", type: "protein_coding", protocol: "eCLIP", num: 41 },
  { name: "ANKMY1", id: "ENSG00000144504", type: "protein_coding", protocol: "eCLIP", num: 102 },
  { name: "ANKRD11", id: "ENSG00000167522", type: "protein_coding", protocol: "eCLIP", num: 225 },
  { name: "ANO10", id: "ENSG00000160746", type: "protein_coding", protocol: "eCLIP", num: 59 },
  { name: "ANXA2", id: "ENSG00000182718", type: "protein_coding", protocol: "eCLIP", num: 81 },
  { name: "APBA2", id: "ENSG00000034053", type: "protein_coding", protocol: "eCLIP", num: 43 },
  { name: "ARHGAP11B", id: "ENSG00000187951", type: "protein_coding", protocol: "eCLIP", num: 30 },
  { name: "ARHGAP22", id: "ENSG00000128805", type: "protein_coding", protocol: "eCLIP", num: 114 },
  { name: "ARID1B", id: "ENSG00000049618", type: "protein_coding", protocol: "eCLIP", num: 92 },
  { name: "ARID3A", id: "ENSG00000116017", type: "protein_coding", protocol: "eCLIP", num: 75 },
  { name: "ARVCF", id: "ENSG00000099889", type: "protein_coding", protocol: "eCLIP", num: 87 },
  { name: "ATF2", id: "ENSG00000115966", type: "protein_coding", protocol: "eCLIP", num: 56 },
  { name: "ATXN2", id: "ENSG00000204842", type: "protein_coding", protocol: "eCLIP", num: 76 },
  { name: "BCR", id: "ENSG00000186716", type: "protein_coding", protocol: "eCLIP", num: 83 },
  { name: "BID", id: "ENSG00000015475", type: "protein_coding", protocol: "eCLIP", num: 56 },
  { name: "BRD9", id: "ENSG00000028310", type: "protein_coding", protocol: "eCLIP", num: 44 },
  { name: "BSG", id: "ENSG00000172270", type: "protein_coding", protocol: "eCLIP", num: 64 },
  { name: "C11orf80", id: "ENSG00000173715", type: "protein_coding", protocol: "eCLIP", num: 51 },
  { name: "C22orf34", id: "ENSG00000188511", type: "lincRNA", protocol: "eCLIP", num: 359 },
  { name: "CBFA2T3", id: "ENSG00000129993", type: "protein_coding", protocol: "eCLIP", num: 329 },
  { name: "CCDC26", id: "ENSG00000229140", type: "lincRNA", protocol: "eCLIP", num: 60 },
  { name: "CD46", id: "ENSG00000117335", type: "protein_coding", protocol: "eCLIP", num: 52 },
  { name: "CDC45", id: "ENSG00000093009", type: "protein_coding", protocol: "eCLIP", num: 76 },
  { name: "CFLAR", id: "ENSG00000003402", type: "protein_coding", protocol: "eCLIP", num: 55 },
  { name: "CHD9", id: "ENSG00000177200", type: "protein_coding", protocol: "eCLIP", num: 50 },
  { name: "CMIP", id: "ENSG00000153815", type: "protein_coding", protocol: "eCLIP", num: 63 },
  { name: "CNOT1", id: "ENSG00000125107", type: "protein_coding", protocol: "eCLIP", num: 44 },
  { name: "COMT", id: "ENSG00000093010", type: "protein_coding", protocol: "eCLIP", num: 60 },
  { name: "CPED1", id: "ENSG00000106034", type: "protein_coding", protocol: "eCLIP", num: 54 },
  { name: "CTBP1", id: "ENSG00000159692", type: "protein_coding", protocol: "eCLIP", num: 174 },
  { name: "CTBP2", id: "ENSG00000175029", type: "protein_coding", protocol: "eCLIP", num: 196 },
  { name: "CTNND1", id: "ENSG00000198561", type: "protein_coding", protocol: "eCLIP", num: 89 },
  { name: "CTSB", id: "ENSG00000164733", type: "protein_coding", protocol: "eCLIP", num: 71 },
  { name: "CUX1", id: "ENSG00000257923", type: "protein_coding", protocol: "eCLIP", num: 295 },
  { name: "CXXC5", id: "ENSG00000171604", type: "protein_coding", protocol: "eCLIP", num: 142 },
  { name: "CYTOR", id: "ENSG00000222041", type: "lincRNA", protocol: "eCLIP", num: 48 },
  { name: "DAZAP1", id: "ENSG00000071626", type: "protein_coding", protocol: "eCLIP", num: 191 },
  { name: "DDX39A", id: "ENSG00000123136", type: "protein_coding", protocol: "eCLIP", num: 60 },
  { name: "DENND1A", id: "ENSG00000119522", type: "protein_coding", protocol: "eCLIP", num: 74 },
  { name: "DHRS3", id: "ENSG00000162496", type: "protein_coding", protocol: "eCLIP", num: 57 },
  { name: "DIAPH1", id: "ENSG00000131504", type: "protein_coding", protocol: "eCLIP", num: 50 },
  { name: "DLG1", id: "ENSG00000075711", type: "protein_coding", protocol: "eCLIP", num: 62 },
  { name: "DMD", id: "ENSG00000198947", type: "protein_coding", protocol: "eCLIP", num: 88 },
  { name: "DNM1", id: "ENSG00000106976", type: "protein_coding", protocol: "eCLIP", num: 58 },
  { name: "EHMT1", id: "ENSG00000181090", type: "protein_coding", protocol: "eCLIP", num: 95 },
  { name: "EIF4G1", id: "ENSG00000114867", type: "protein_coding", protocol: "eCLIP", num: 89 },
  { name: "EPB41", id: "ENSG00000159023", type: "protein_coding", protocol: "eCLIP", num: 89 },
  { name: "ETFA", id: "ENSG00000140374", type: "protein_coding", protocol: "eCLIP", num: 50 },
  { name: "EXOC4", id: "ENSG00000131558", type: "protein_coding", protocol: "eCLIP", num: 83 },
  { name: "FTO", id: "ENSG00000140718", type: "protein_coding", protocol: "eCLIP", num: 66 },
  { name: "GAS5", id: "ENSG00000234741", type: "processed_transcript", protocol: "eCLIP", num: 94 },
  { name: "GATA2-AS1", id: "ENSG00000244300", type: "antisense_RNA", protocol: "eCLIP", num: 74 },
  { name: "GATD1", id: "ENSG00000177225", type: "protein_coding", protocol: "eCLIP", num: 51 },
  { name: "GGA2", id: "ENSG00000103365", type: "protein_coding", protocol: "eCLIP", num: 56 },
  { name: "GIGYF2", id: "ENSG00000204120", type: "protein_coding", protocol: "eCLIP", num: 173 },
  { name: "GNB1L", id: "ENSG00000185838", type: "protein_coding", protocol: "eCLIP", num: 66 },
  { name: "GPI", id: "ENSG00000105220", type: "protein_coding", protocol: "eCLIP", num: 106 },
  { name: "GRB10", id: "ENSG00000106070", type: "protein_coding", protocol: "eCLIP", num: 81 },
  { name: "GSE1", id: "ENSG00000131149", type: "protein_coding", protocol: "eCLIP", num: 347 },
  { name: "GTF3C5", id: "ENSG00000148308", type: "protein_coding", protocol: "eCLIP", num: 51 },
  { name: "HCG27", id: "ENSG00000206344", type: "lincRNA", protocol: "eCLIP", num: 4 },
  { name: "HDAC4", id: "ENSG00000068024", type: "protein_coding", protocol: "eCLIP", num: 69 },
  { name: "HMBS", id: "ENSG00000256269", type: "protein_coding", protocol: "eCLIP", num: 23 },
  { name: "HSPA1B", id: "ENSG00000204388", type: "protein_coding", protocol: "eCLIP", num: 1 },
  { name: "IGF2BP2", id: "ENSG00000073792", type: "protein_coding", protocol: "eCLIP", num: 51 },
  { name: "IKZF1", id: "ENSG00000185811", type: "protein_coding", protocol: "eCLIP", num: 64 },
  { name: "IMMP2L", id: "ENSG00000184903", type: "protein_coding", protocol: "eCLIP", num: 91 },
  { name: "KANSL1", id: "ENSG00000120071", type: "protein_coding", protocol: "eCLIP", num: 107 },
  { name: "KAZN", id: "ENSG00000189337", type: "protein_coding", protocol: "eCLIP", num: 90 },
  { name: "KBTBD11-OT1", id: "ENSG00000283239", type: "protein_coding", protocol: "eCLIP", num: 82 },
  { name: "KCNIP2", id: "ENSG00000120049", type: "protein_coding", protocol: "eCLIP", num: 101 },
  { name: "KDM4B", id: "ENSG00000127663", type: "protein_coding", protocol: "eCLIP", num: 229 },
  { name: "KIF13A", id: "ENSG00000137177", type: "protein_coding", protocol: "eCLIP", num: 22 },
  { name: "LCORL", id: "ENSG00000178177", type: "protein_coding", protocol: "eCLIP", num: 59 },
  { name: "LINC00470", id: "ENSG00000132204", type: "lincRNA", protocol: "eCLIP", num: 36 },
  { name: "LINC00534", id: "ENSG00000253394", type: "lincRNA", protocol: "eCLIP", num: 27 },
  { name: "LINC00969", id: "ENSG00000242086", type: "lincRNA", protocol: "eCLIP", num: 77 },
  { name: "LMBR1", id: "ENSG00000105983", type: "protein_coding", protocol: "eCLIP", num: 64 },
  { name: "LMNA", id: "ENSG00000160789", type: "protein_coding", protocol: "eCLIP", num: 70 },
  { name: "LTBP4", id: "ENSG00000090006", type: "protein_coding", protocol: "eCLIP", num: 61 },
  { name: "MACF1", id: "ENSG00000127603", type: "protein_coding", protocol: "eCLIP", num: 229 },
  { name: "MAD1L1", id: "ENSG00000002822", type: "protein_coding", protocol: "eCLIP", num: 411 },
  { name: "MAEA", id: "ENSG00000090316", type: "protein_coding", protocol: "eCLIP", num: 84 },
  { name: "MAGI1", id: "ENSG00000151276", type: "protein_coding", protocol: "eCLIP", num: 53 },
  { name: "MAP4K4", id: "ENSG00000071054", type: "protein_coding", protocol: "eCLIP", num: 119 },
  { name: "MAPK8", id: "ENSG00000107643", type: "protein_coding", protocol: "eCLIP", num: 26 },
  { name: "MAPKAP1", id: "ENSG00000119487", type: "protein_coding", protocol: "eCLIP", num: 62 },
  { name: "MBD1", id: "ENSG00000141644", type: "protein_coding", protocol: "eCLIP", num: 57 },
  { name: "MBNL1", id: "ENSG00000152601", type: "protein_coding", protocol: "eCLIP", num: 190 },
  { name: "MED15", id: "ENSG00000099917", type: "protein_coding", protocol: "eCLIP", num: 62 },
  { name: "MED16", id: "ENSG00000175221", type: "protein_coding", protocol: "eCLIP", num: 79 },
  { name: "MED24", id: "ENSG00000008838", type: "protein_coding", protocol: "eCLIP", num: 55 },
  { name: "MICALL2", id: "ENSG00000164877", type: "protein_coding", protocol: "eCLIP", num: 50 },
  { name: "MIR4435-2HG", id: "ENSG00000172965", type: "lincRNA", protocol: "eCLIP", num: 50 },
  { name: "MSI2", id: "ENSG00000153944", type: "protein_coding", protocol: "eCLIP", num: 145 },
  { name: "MYBBP1A", id: "ENSG00000132382", type: "protein_coding", protocol: "eCLIP", num: 24 },
  { name: "MYBL2", id: "ENSG00000101057", type: "protein_coding", protocol: "eCLIP", num: 2 },
  { name: "NCOA4", id: "ENSG00000266412", type: "protein_coding", protocol: "eCLIP", num: 7 },
  { name: "NCOR2", id: "ENSG00000196498", type: "protein_coding", protocol: "eCLIP", num: 147 },
  { name: "NEDD4L", id: "ENSG00000049759", type: "protein_coding", protocol: "eCLIP", num: 103 },
  { name: "NFIC", id: "ENSG00000141905", type: "protein_coding", protocol: "eCLIP", num: 95 },
  { name: "NOL4L", id: "ENSG00000197183", type: "protein_coding", protocol: "eCLIP", num: 57 },
  { name: "NPM1", id: "ENSG00000181163", type: "protein_coding", protocol: "eCLIP", num: 13 },
  { name: "NUMA1", id: "ENSG00000137497", type: "protein_coding", protocol: "eCLIP", num: 91 },
  { name: "OSBPL9", id: "ENSG00000117859", type: "protein_coding", protocol: "eCLIP", num: 56 },
  { name: "PAK4", id: "ENSG00000130669", type: "protein_coding", protocol: "eCLIP", num: 51 },
  { name: "PCBP1-AS1", id: "ENSG00000179818", type: "processed_transcript", protocol: "eCLIP", num: 120 },
  { name: "PCGF3", id: "ENSG00000185619", type: "protein_coding", protocol: "eCLIP", num: 90 },
  { name: "PFKFB3", id: "ENSG00000170525", type: "protein_coding", protocol: "eCLIP", num: 49 },
  { name: "PHF21A", id: "ENSG00000135365", type: "protein_coding", protocol: "eCLIP", num: 55 },
  { name: "PHGDH", id: "ENSG00000092621", type: "protein_coding", protocol: "eCLIP", num: 51 },
  { name: "PHRF1", id: "ENSG00000070047", type: "protein_coding", protocol: "eCLIP", num: 54 },
  { name: "PIP5K1C", id: "ENSG00000186111", type: "protein_coding", protocol: "eCLIP", num: 95 },
  { name: "PISD", id: "ENSG00000241878", type: "protein_coding", protocol: "eCLIP", num: 120 },
  { name: "PKM", id: "ENSG00000067225", type: "protein_coding", protocol: "eCLIP", num: 89 },
  { name: "PLEC", id: "ENSG00000178209", type: "protein_coding", protocol: "eCLIP", num: 93 },
  { name: "PPP2R2A", id: "ENSG00000221914", type: "protein_coding", protocol: "eCLIP", num: 111 },
  { name: "PRKAR1B", id: "ENSG00000188191", type: "protein_coding", protocol: "eCLIP", num: 109 },
  { name: "PRKCB", id: "ENSG00000166501", type: "protein_coding", protocol: "eCLIP", num: 75 },
  { name: "PTBP1", id: "ENSG00000011304", type: "protein_coding", protocol: "eCLIP", num: 62 },
  { name: "PTP4A3", id: "ENSG00000184489", type: "protein_coding", protocol: "eCLIP", num: 74 },
  { name: "PTPRA", id: "ENSG00000132670", type: "protein_coding", protocol: "eCLIP", num: 60 },
  { name: "PTPRF", id: "ENSG00000142949", type: "protein_coding", protocol: "eCLIP", num: 59 },
  { name: "PUF60", id: "ENSG00000179950", type: "protein_coding", protocol: "eCLIP", num: 49 },
  { name: "RAP1GAP", id: "ENSG00000076864", type: "protein_coding", protocol: "eCLIP", num: 76 },
  { name: "RAPGEF6", id: "ENSG00000158987", type: "protein_coding", protocol: "eCLIP", num: 65 },
  { name: "RILPL1", id: "ENSG00000188026", type: "protein_coding", protocol: "eCLIP", num: 49 },
  { name: "RREB1", id: "ENSG00000124782", type: "protein_coding", protocol: "eCLIP", num: 54 },
  { name: "RTN4", id: "ENSG00000115310", type: "protein_coding", protocol: "eCLIP", num: 85 },
  { name: "SCARB1", id: "ENSG00000073060", type: "protein_coding", protocol: "eCLIP", num: 63 },
  { name: "SEPT9", id: "ENSG00000184640", type: "protein_coding", protocol: "eCLIP", num: 195 },
  { name: "SKI", id: "ENSG00000157933", type: "protein_coding", protocol: "eCLIP", num: 108 },
  { name: "SLC19A1", id: "ENSG00000173638", type: "protein_coding", protocol: "eCLIP", num: 35 },
  { name: "SLC22A18", id: "ENSG00000110628", type: "protein_coding", protocol: "eCLIP", num: 50 },
  { name: "SLC6A6", id: "ENSG00000131389", type: "protein_coding", protocol: "eCLIP", num: 69 },
  { name: "SMARCA4", id: "ENSG00000127616", type: "protein_coding", protocol: "eCLIP", num: 76 },
  { name: "SMYD3", id: "ENSG00000185420", type: "protein_coding", protocol: "eCLIP", num: 137 },
  { name: "SPIDR", id: "ENSG00000164808", type: "protein_coding", protocol: "eCLIP", num: 55 },
  { name: "SPTA1", id: "ENSG00000163554", type: "protein_coding", protocol: "eCLIP", num: 2 },
  { name: "SRPK2", id: "ENSG00000135250", type: "protein_coding", protocol: "eCLIP", num: 54 },
  { name: "SSBP3", id: "ENSG00000157216", type: "protein_coding", protocol: "eCLIP", num: 97 },
  { name: "SSBP4", id: "ENSG00000130511", type: "protein_coding", protocol: "eCLIP", num: 71 },
  { name: "ST7", id: "ENSG00000004866", type: "protein_coding", protocol: "eCLIP", num: 164 },
  { name: "STRBP", id: "ENSG00000165209", type: "protein_coding", protocol: "eCLIP", num: 73 },
  { name: "TBC1D5", id: "ENSG00000131374", type: "protein_coding", protocol: "eCLIP", num: 113 },
  { name: "TBC1D22A", id: "ENSG00000054611", type: "protein_coding", protocol: "eCLIP", num: 78 },
  { name: "TBCD", id: "ENSG00000141556", type: "protein_coding", protocol: "eCLIP", num: 113 },
  { name: "TCF3", id: "ENSG00000071564", type: "protein_coding", protocol: "eCLIP", num: 166 },
  { name: "TCF4", id: "ENSG00000196628", type: "protein_coding", protocol: "eCLIP", num: 58 },
  { name: "TMC6", id: "ENSG00000141524", type: "protein_coding", protocol: "eCLIP", num: 103 },
  { name: "TNIK", id: "ENSG00000154310", type: "protein_coding", protocol: "eCLIP", num: 65 },
  { name: "TOM1", id: "ENSG00000100284", type: "protein_coding", protocol: "eCLIP", num: 51 },
  { name: "TPD52L2", id: "ENSG00000101150", type: "protein_coding", protocol: "eCLIP", num: 54 },
  { name: "TRAPPC9", id: "ENSG00000167632", type: "protein_coding", protocol: "eCLIP", num: 94 },
  { name: "UBE2J2", id: "ENSG00000160087", type: "protein_coding", protocol: "eCLIP", num: 137 },
  { name: "UBE3A", id: "ENSG00000114062", type: "protein_coding", protocol: "eCLIP", num: 75 },
  { name: "UNKL", id: "ENSG00000059145", type: "protein_coding", protocol: "eCLIP", num: 169 },
  { name: "UQCC1", id: "ENSG00000101019", type: "protein_coding", protocol: "eCLIP", num: 74 },
  { name: "WARS", id: "ENSG00000140105", type: "protein_coding", protocol: "eCLIP", num: 78 },
  { name: "WDR1", id: "ENSG00000071127", type: "protein_coding", protocol: "eCLIP", num: 60 },
  { name: "ZFPM1", id: "ENSG00000179588", type: "protein_coding", protocol: "eCLIP", num: 364 },
  { name: "ZFYVE28", id: "ENSG00000159733", type: "protein_coding", protocol: "eCLIP", num: 76 },
  { name: "ZMYND8", id: "ENSG00000101040", type: "protein_coding", protocol: "eCLIP", num: 101 },
  { name: "ZNF692", id: "ENSG00000171163", type: "protein_coding", protocol: "eCLIP", num: 74 },
  { name: "TAF15", id: "ENSG00000270647", type: "protein_coding", protocol: "eCLIP", num: 13176, motifs: TAF15_MOTIFS }
];

export const MOCK_DATA: RbpRecord[] = rawCsvData.map(data => {
  const seed = pseudoRandom(data.name);
  
  // Create a deterministic random subset of TARGET_TYPES based on the seed
  const shuffledTargets = [...TARGET_TYPES].sort((a, b) => {
      const valA = pseudoRandom(a + data.name);
      const valB = pseudoRandom(b + data.name);
      return valA - valB;
  });
  
  // Assign 1 to 3 targets randomly
  const numTargets = (seed % 3) + 1;
  const targets = shuffledTargets.slice(0, numTargets);

  return {
    id: `RBP_${data.name}`,
    name: data.name,
    geneId: data.id,
    geneType: data.type,
    protocol: data.protocol,
    bindingSitesCount: data.num,
    targets: targets,
    cellLines: CELL_LINES.slice(0, (pseudoRandom(data.id) % 3) + 1), 
    methods: [data.protocol, METHODS[(pseudoRandom(data.name) % (METHODS.length - 1)) + 1]], 
    description: `${data.name} (${data.type}) is an RNA-binding protein identified with ID ${data.id}. It has been profiled using ${data.protocol} protocols showing ${data.num} significant binding clusters. Known to interact with diverse RNA species in cell lines like ${CELL_LINES[pseudoRandom(data.id) % CELL_LINES.length]}.`,
    domains: [DOMAINS[seed % DOMAINS.length], DOMAINS[(seed + 1) % DOMAINS.length]],
    geneFunction: FUNCTIONS[seed % FUNCTIONS.length],
    expressionProfile: getMockExpression(data.id),
    bindingDistribution: getMockDistribution(data.id),
    motifs: data.motifs // Attach specific motifs if available
  }
});
