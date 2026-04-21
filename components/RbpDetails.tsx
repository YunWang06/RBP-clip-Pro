
import React, { useState } from 'react';
import { ArrowLeft, Dna, Activity, BarChart3, Info, Layers, Microscope, ExternalLink, Database, Puzzle, Fingerprint } from 'lucide-react';
import { RbpRecord, TargetGene } from '../types';
import { getMockTargets } from '../constants';

interface RbpDetailsProps {
  rbp: RbpRecord;
  onBack: () => void;
  onViewPeaks: (target: string) => void;
}

// Helper to render colorful sequence text
const SequenceVisual: React.FC<{ sequence: string }> = ({ sequence }) => {
    return (
        <div className="flex items-center font-mono text-xl font-bold tracking-widest">
            {sequence.split('').map((char, idx) => {
                let colorClass = "text-gray-600";
                if (char === 'A') colorClass = "text-green-600";
                if (char === 'C') colorClass = "text-blue-600";
                if (char === 'G') colorClass = "text-yellow-600";
                if (char === 'T' || char === 'U') colorClass = "text-red-600";
                
                return <span key={idx} className={colorClass}>{char}</span>
            })}
        </div>
    );
};

export const RbpDetails: React.FC<RbpDetailsProps> = ({ rbp, onBack, onViewPeaks }) => {
  // In a real app, this would be fetched. For now we use the mock generator.
  const [targetList] = useState<TargetGene[]>(getMockTargets(rbp.id));

  return (
    <div className="bg-slate-50 min-h-full pb-12">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30 shadow-sm">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          返回检索结果
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        
        {/* --- SECTION 1: Basic Information --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-start">
             <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                    {rbp.name}
                    <span className="text-sm font-normal bg-white/20 text-white px-2 py-0.5 rounded border border-white/20 font-mono">
                        {rbp.geneId}
                    </span>
                </h1>
                <p className="text-slate-300 text-sm max-w-2xl">{rbp.description}</p>
             </div>
             <div className="text-right">
                 <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Gene Type</div>
                 <div className="font-semibold text-white">{rbp.geneType}</div>
             </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Function & Domains */}
             <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2">
                    Biological Function
                </h3>
                <div className="flex items-start gap-3 mb-6">
                    <div className="mt-1 p-1.5 bg-blue-100 text-blue-600 rounded">
                        <Activity size={18} />
                    </div>
                    <div>
                        <span className="font-medium text-slate-800 block">Primary Function</span>
                        <span className="text-slate-600 text-sm">{rbp.geneFunction}</span>
                    </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2">
                    Protein Domains
                </h3>
                <div className="flex flex-wrap gap-2">
                    {rbp.domains.map((dom, idx) => (
                        <div key={idx} className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5">
                            <Puzzle size={14} className="text-slate-400 mr-2" />
                            <span className="text-sm text-slate-700">{dom}</span>
                        </div>
                    ))}
                </div>
             </div>

             {/* Experiment Stats */}
             <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
                    Experimental Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs text-slate-500 mb-1">Primary Protocol</div>
                        <div className="font-semibold text-slate-800 flex items-center">
                            {rbp.protocol}
                            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 mb-1">Total Binding Sites</div>
                        <div className="font-semibold text-slate-800">{rbp.bindingSitesCount.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 mb-1">Cell Lines</div>
                        <div className="font-semibold text-slate-800">{rbp.cellLines.length} Tested</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 mb-1">Data Confidence</div>
                        <div className="font-semibold text-slate-800">High</div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- SECTION 2: Visualization (Binding & Expression) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Binding Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <Layers size={20} className="mr-2 text-indigo-500" />
                    Binding Region Distribution
                </h3>
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-5">
                {rbp.bindingDistribution.map((item, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium text-slate-700">{item.region}</span>
                            <span className="text-slate-500 font-mono">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div 
                                className="bg-indigo-500 h-3 rounded-full relative" 
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Tissue Expression */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <BarChart3 size={20} className="mr-2 text-rose-500" />
                    Tissue Expression (TPM)
                </h3>
            </div>
            <div className="flex-1 flex items-end justify-between space-x-4 pt-4 px-4 h-48">
                {rbp.expressionProfile.map((exp, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                        <div 
                            className="w-full bg-rose-400 rounded-t-sm relative group-hover:bg-rose-500 transition-all"
                            style={{ height: `${Math.min(exp.value, 100)}%` }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                                {exp.value}
                            </div>
                        </div>
                        <span className="text-xs font-medium text-slate-600 mt-3">{exp.tissue}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* --- SECTION 3: Binding Sites Records --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <Database size={20} className="mr-2 text-blue-500" />
                        Binding Sites Records
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        List of top identified target genes bound by {rbp.name}. Click a gene to view raw peaks.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition-colors">
                        Download All
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-8 py-3 font-semibold">Target Gene</th>
                            <th className="px-8 py-3 font-semibold">Gene ID</th>
                            <th className="px-8 py-3 font-semibold">Type</th>
                            <th className="px-8 py-3 font-semibold">Protocol</th>
                            <th className="px-8 py-3 font-semibold text-right">Binding Sites</th>
                            <th className="px-8 py-3 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {targetList.map((target, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                                <td className="px-8 py-4 font-bold text-slate-800">
                                    {target.geneName}
                                </td>
                                <td className="px-8 py-4 font-mono text-xs text-slate-500">
                                    {target.geneId}
                                </td>
                                <td className="px-8 py-4">
                                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                        {target.geneType}
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-slate-600">
                                    {target.protocol}
                                </td>
                                <td className="px-8 py-4 text-right font-mono text-slate-600 font-semibold">
                                    {target.peakCount}
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <button 
                                        onClick={() => onViewPeaks(target.geneName)}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center justify-center gap-1 mx-auto hover:underline"
                                    >
                                        View Peaks
                                        <ExternalLink size={12} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* --- SECTION 4: Top Enriched Motifs --- */}
        {rbp.motifs && rbp.motifs.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                      <Fingerprint size={20} className="mr-2 text-orange-500" />
                      Top Enriched Motifs
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                      Enriched sequence motifs identified from CLIP-seq binding clusters.
                  </p>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                          <tr>
                              <th className="px-8 py-3 font-semibold w-16">Rank</th>
                              <th className="px-8 py-3 font-semibold">Motif Sequence (Visual)</th>
                              <th className="px-8 py-3 font-semibold text-center">Length</th>
                              <th className="px-8 py-3 font-semibold text-right">Target (%)</th>
                              <th className="px-8 py-3 font-semibold text-right">No. Target</th>
                              <th className="px-8 py-3 font-semibold text-right">P-value</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {rbp.motifs.map((motif, idx) => (
                              <tr key={idx} className="hover:bg-orange-50/30 transition-colors">
                                  <td className="px-8 py-4 text-slate-600 font-medium">
                                      {motif.rank}
                                  </td>
                                  <td className="px-8 py-4">
                                      <SequenceVisual sequence={motif.sequence} />
                                      <div className="text-xs text-slate-400 mt-1 font-mono">{motif.sequence}</div>
                                  </td>
                                  <td className="px-8 py-4 text-center text-slate-600">
                                      {motif.length}
                                  </td>
                                  <td className="px-8 py-4 text-right font-mono text-slate-600">
                                      {motif.targetPercent}
                                  </td>
                                  <td className="px-8 py-4 text-right font-mono text-slate-600">
                                      {motif.targetCount}
                                  </td>
                                  <td className="px-8 py-4 text-right font-mono text-slate-500 text-xs">
                                      {motif.pValue}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
        )}

      </div>
    </div>
  );
};
