
import React, { useState } from 'react';
import { ArrowLeft, BarChart3, Layers, ExternalLink, Database, Fingerprint } from 'lucide-react';
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
        
        {/* Entity Header */}
        <div className="flex items-end justify-between border-b pb-6 border-slate-200">
           <div>
              <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-4">
                {rbp.name}
                <span className="text-lg font-mono font-medium text-slate-400">({rbp.geneId})</span>
              </h1>
              <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">{rbp.description}</p>
           </div>
           <div className="flex items-center gap-2 text-sm font-medium text-slate-400 italic">
               <Fingerprint size={16} />
               RNA Binding Protein
           </div>
        </div>

        {/* --- SECTION 1: Basic Information (Refined Style) --- */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Block with Scientific Vibe */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-4 bg-white">
            <div className="w-10 h-10 rounded-full bg-[#1b4168] flex items-center justify-center text-white font-bold text-lg">
              BI
            </div>
            <h2 className="text-xl font-medium text-slate-800">RBP 基本信息</h2>
          </div>
          
          <div className="p-6">
            <table className="w-full text-sm border-separate border-spacing-0">
                <tbody>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="w-1/4 py-3 pr-8 text-right font-bold text-slate-700 whitespace-nowrap bg-slate-50/50">RBP 名称</td>
                        <td className="py-3 pl-6 text-slate-800 font-bold text-lg">{rbp.name}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="w-1/4 py-3 pr-8 text-right font-bold text-slate-700 whitespace-nowrap bg-slate-50/50">Ensembl Gene ID</td>
                        <td className="py-3 pl-6 text-slate-600 font-mono">{rbp.geneId}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="w-1/4 py-3 pr-8 text-right font-bold text-slate-700 whitespace-nowrap bg-slate-50/50">物种</td>
                        <td className="py-3 pl-6 text-slate-600 italic">Homo sapiens (人类)</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="w-1/4 py-3 pr-8 text-right font-bold text-slate-700 whitespace-nowrap bg-slate-50/50">基因分类 (Gene Type)</td>
                        <td className="py-3 pl-6 text-slate-600">{rbp.geneType}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="w-1/4 py-3 pr-8 text-right font-bold text-slate-700 whitespace-nowrap bg-slate-50/50">实验策略</td>
                        <td className="py-3 pl-6">
                            <div className="flex flex-wrap gap-2">
                                {rbp.methods.map((m, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-semibold">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="w-1/4 py-3 pr-8 text-right font-bold text-slate-700 whitespace-nowrap bg-slate-50/50">关联细胞系/组织</td>
                        <td className="py-3 pl-6 text-slate-600 leading-relaxed">{rbp.cellLines.join(', ')}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="w-1/4 py-3 pr-8 text-right font-bold text-slate-700 whitespace-nowrap bg-slate-50/50">结合位点总数</td>
                        <td className="py-3 pl-6 text-slate-700 font-mono font-bold text-base">{rbp.bindingSitesCount.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="w-1/4 py-3 pr-8 text-right font-bold text-slate-700 whitespace-nowrap bg-slate-50/50">主要生物学功能</td>
                        <td className="py-3 pl-6 text-slate-600 leading-relaxed italic">{rbp.geneFunction}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="w-1/4 py-3 pr-8 text-right font-bold text-slate-700 whitespace-nowrap bg-slate-50/50">蛋白特征域 (Domains)</td>
                        <td className="py-3 pl-6">
                            <div className="flex flex-wrap gap-2">
                                {rbp.domains.map((dom, i) => (
                                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                        {dom}
                                    </span>
                                ))}
                            </div>
                        </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                        <td className="w-1/4 py-3 pr-8 text-right font-bold text-slate-700 whitespace-nowrap bg-slate-50/50">数据库状态</td>
                        <td className="py-3 pl-6">
                            <div className="inline-flex rounded overflow-hidden border border-[#4d864d]">
                                <div className="bg-[#4d864d] text-white text-[10px] font-bold px-1.5 py-0.5 uppercase">Status</div>
                                <div className="bg-white text-[#4d864d] text-[10px] font-medium px-2 py-0.5">Released</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>

        {/* --- SECTION 2: Visualization Charts --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Binding Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-4 bg-white">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                BR
              </div>
              <h3 className="text-xl font-medium text-slate-800">Binding Region Distribution</h3>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center space-y-6">
                {rbp.bindingDistribution.map((item, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold text-slate-700">{item.region}</span>
                            <span className="text-slate-500 font-mono">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/50">
                            <div 
                                className="bg-indigo-500 h-3 rounded-full relative shadow-[0_0_8px_rgba(99,102,241,0.3)]" 
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Tissue Expression */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-4 bg-white">
              <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                TE
              </div>
              <h3 className="text-xl font-medium text-slate-800">Tissue Expression (TPM)</h3>
            </div>
            <div className="p-8 flex-1 flex items-end justify-between space-x-4 pt-8 px-6 min-h-[250px]">
                {rbp.expressionProfile.map((exp, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group mt-4">
                        <div 
                            className="w-full bg-rose-400 rounded-t-sm relative group-hover:bg-rose-500 transition-all shadow-[0_-2px_10px_rgba(251,113,133,0.2)]"
                            style={{ height: `${Math.min(exp.value, 100)}%` }}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1.5 px-2.5 rounded font-bold pointer-events-none transition-opacity z-20 whitespace-nowrap">
                                {exp.value} TPM
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-wider">{exp.tissue}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* --- SECTION 3: Binding Sites Records --- */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        BS
                    </div>
                    <div>
                        <h3 className="text-xl font-medium text-slate-800">Binding Sites Records</h3>
                        <p className="text-xs text-slate-400 mt-0.5 tracking-tight">Top identified target genes bound by {rbp.name}</p>
                    </div>
                </div>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded border border-slate-200 hover:bg-slate-200 transition-all shadow-sm flex items-center gap-2">
                    <Database size={14} />
                    Download CSV
                </button>
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
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-4 bg-white">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    EM
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-slate-800">Top Enriched Motifs</h3>
                    <p className="text-xs text-slate-400 mt-0.5 tracking-tight">Sequence motifs identified from {rbp.name} CLIP-seq clusters</p>
                  </div>
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
