
import React from 'react';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { PeakData } from '../types';

interface PeakViewProps {
  targetGene: string;
  peaks: PeakData[];
  onBack: () => void;
}

export const PeakView: React.FC<PeakViewProps> = ({ targetGene, peaks, onBack }) => {
  return (
    <div className="bg-slate-50 min-h-full">
      {/* Navigation */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30 shadow-sm flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          返回 RBP 详情
        </button>
        <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">
                Raw Peaks: <span className="text-blue-600">{targetGene}</span>
            </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                    <h3 className="font-bold text-slate-700 flex items-center">
                        <FileText size={18} className="mr-2 text-slate-500" />
                        Original Peak File (BED Format)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">High confidence binding sites derived from CLIP-seq analysis</p>
                </div>
                <button className="flex items-center text-xs font-medium bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 text-slate-700">
                    <Download size={14} className="mr-1.5" />
                    Download .bed
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Chromosome</th>
                            <th className="px-6 py-3 font-medium">Start</th>
                            <th className="px-6 py-3 font-medium">End</th>
                            <th className="px-6 py-3 font-medium text-center">Strand</th>
                            <th className="px-6 py-3 font-medium text-center">Region</th>
                            <th className="px-6 py-3 font-medium text-right">Enrichment</th>
                            <th className="px-6 py-3 font-medium text-right">P-Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {peaks.map((peak, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3 font-mono text-slate-700">{peak.chr}</td>
                                <td className="px-6 py-3 font-mono text-slate-600">{peak.start.toLocaleString()}</td>
                                <td className="px-6 py-3 font-mono text-slate-600">{peak.end.toLocaleString()}</td>
                                <td className="px-6 py-3 text-center">
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${peak.strand === '+' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {peak.strand}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-center">
                                   {peak.region ? (
                                     <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                                        {peak.region}
                                     </span>
                                   ) : <span className="text-slate-400">-</span>}
                                </td>
                                <td className="px-6 py-3 text-right font-medium text-slate-700">{peak.enrichment.toFixed(2)}x</td>
                                <td className="px-6 py-3 text-right text-slate-500">{peak.pvalue.toExponential(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-center text-slate-400">
                Displaying {peaks.length} top significant peaks
            </div>
        </div>

      </div>
    </div>
  );
};