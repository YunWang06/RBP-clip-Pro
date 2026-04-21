
import React, { useEffect, useRef, useState } from 'react';
import { Stage } from 'ngl';
import { Maximize2, RotateCcw, Settings, Download } from 'lucide-react';

interface ProteinViewerProps {
  pdbId?: string;
  pdbData?: string;
  name: string;
}

export const ProteinViewer: React.FC<ProteinViewerProps> = ({ pdbId, pdbData, name }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stageRef = useRef<Stage | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize NGL stage
    const stage = new Stage(containerRef.current, { backgroundColor: 'white' });
    stageRef.current = stage;

    const loadStructure = async () => {
      try {
        setError(null);
        if (!pdbData && (!pdbId || pdbId.trim() === '')) {
          setLoading(false);
          return;
        }

        setLoading(true);
        
        // Clear previous components if any
        stage.removeAllComponents();

        let component;
        
        if (pdbData) {
          const blob = new Blob([pdbData], { type: 'text/plain' });
          component = await stage.loadFile(blob, { ext: 'pdb' });
        } else if (pdbId) {
          const trimmedId = pdbId.trim();
          if (trimmedId === '') throw new Error('Empty PDB ID');

          const isAlphaFold = trimmedId.startsWith('AF-') || 
                            (trimmedId.length === 6 && /^[OPQ][0-9][A-Z0-9]{3}[0-9]$|^[A-N,R-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}$/.test(trimmedId));

          if (isAlphaFold) {
            const actualId = trimmedId.startsWith('AF-') ? trimmedId : `AF-${trimmedId}-F1-model_v4`;
            component = await stage.loadFile(`https://alphafold.ebi.ac.uk/files/${actualId}.pdb`);
          } else {
            component = await stage.loadFile(`rcsb://${trimmedId}`);
          }
        }

        if (component) {
          component.addRepresentation('cartoon', { color: 'royalblue' });
          component.addRepresentation('ball+stick', { 
            sele: 'hetero', 
            aspectRatio: 3 
          });
          stage.autoView();
        } else {
          throw new Error('Could not load structure component');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading structure:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    loadStructure();

    const handleResize = () => {
      stage.handleResize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      stage.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [pdbId, pdbData]);

  const handleResetView = () => {
    if (stageRef.current) {
        stageRef.current.autoView();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Maximize2 size={18} />
            </div>
            <div>
                <h3 className="font-bold text-slate-800">3D Protein Structure</h3>
                <p className="text-xs text-slate-500">{name} - {pdbId ? `PDB: ${pdbId}` : 'Custom Model'}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={handleResetView}
                className="p-2 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
                title="Reset View"
            >
                <RotateCcw size={16} />
            </button>
            <button className="p-2 hover:bg-slate-200 rounded-md text-slate-600 transition-colors">
                <Settings size={16} />
            </button>
            <button className="p-2 hover:bg-slate-200 rounded-md text-slate-600 transition-colors">
                <Download size={16} />
            </button>
        </div>
      </div>

      <div className="relative flex-1 bg-white">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
             <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
             <p className="text-sm font-medium text-slate-600 font-mono">Loading 3D Model...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 p-6 text-center">
             <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <Settings size={24} />
             </div>
             <p className="text-sm font-bold text-slate-800 mb-1">Structure Loading Error</p>
             <p className="text-xs text-slate-500 max-w-[200px]">{error}</p>
          </div>
        )}

        {!loading && !error && !pdbData && (!pdbId || pdbId.trim() === '') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 p-6 text-center">
             <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 mb-4 opacity-50">
                <Maximize2 size={24} />
             </div>
             <p className="text-sm font-medium text-slate-400">No 3D structure available for this RBP</p>
             <p className="text-xs text-slate-300 mt-1 italic">UniProt or PDB ID required</p>
          </div>
        )}
        
        <div ref={containerRef} className="w-full h-full" />
        
        {/* Interaction hint */}
        <div className="absolute bottom-4 left-4 pointer-events-none">
            <div className="bg-slate-900/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Left-click to rotate • Right-click to pan • Scroll to zoom
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
