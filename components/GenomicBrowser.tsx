
import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { PeakData } from '../types';
import { Search, ZoomIn, ZoomOut, Download, Settings, ChevronDown, ChevronRight, X, Maximize2 } from 'lucide-react';

interface GenomicBrowserProps {
  peaks: PeakData[];
  targetGene: string;
}

export const GenomicBrowser: React.FC<GenomicBrowserProps> = ({ peaks, targetGene }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 600 });
  const [viewport, setViewport] = useState<[number, number]>([0, 1000]);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Layout constants
  const tracks = [
    { id: 'ip_pos', name: `IP (+) ${targetGene}`, type: 'coverage', color: '#1a567e', height: 60 },
    { id: 'ip_neg', name: `IP (-) ${targetGene}`, type: 'coverage', color: '#a62d2d', height: 60 },
    { id: 'annotation', name: 'Reference Gene (hg38)', type: 'gene', color: '#003399', height: 40 },
    { id: 'rna_seq', name: 'Expression [RNA-seq]', type: 'coverage', color: '#00a693', height: 60 },
    { id: 'conservation', name: 'Conservation (phastCons)', type: 'coverage', color: '#2d7a2d', height: 40 }
  ];

  // Initialize genomic range
  useEffect(() => {
    if (peaks.length === 0) return;
    const min = d3.min(peaks, d => d.start) || 0;
    const max = d3.max(peaks, d => d.end) || 1000;
    const padding = (max - min) * 0.1;
    setViewport([Math.max(0, min - padding), max + padding]);
  }, [peaks]);

  // Handle responsiveness
  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions(prev => ({ ...prev, width: entry.contentRect.width }));
      }
    });
    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, []);

  // Coverage generator simulation
  const getCoverageData = useMemo(() => {
    return (type: string) => {
        const data: {x: number, y: number}[] = [];
        const [start, end] = viewport;
        const resolution = 300; 
        const step = (end - start) / resolution; 
        
        for(let x = start; x <= end; x += step) {
            let y = 0;
            peaks.forEach(p => {
                if (type === 'pos' && p.strand === '-') return;
                if (type === 'neg' && p.strand === '+') return;
                
                const mid = (p.start + p.end) / 2;
                const dist = Math.abs(x - mid);
                const width = (p.end - p.start) * 1.2;
                if (dist < width * 3) {
                    y += p.enrichment * Math.exp(-(dist*dist)/(2*width*width));
                }
            });
            y += 0.05 + Math.random() * 0.05;
            data.push({x, y});
        }
        return data;
    };
  }, [peaks, viewport]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || peaks.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 10, right: 40, bottom: 20, left: 160 };
    const width = dimensions.width - margin.left - margin.right;
    
    const chartG = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const x = d3.scaleLinear()
      .domain(viewport)
      .range([0, width]);

    // Draw Top Ruler
    const xAxis = d3.axisTop(x)
      .ticks(8)
      .tickFormat(d => `${Math.round(d as number / 1000).toLocaleString()} kb`);

    const rulerG = chartG.append('g')
      .attr('class', 'axis axis--x text-slate-400 text-[9px]')
      .attr('transform', 'translate(0, 30)')
      .call(xAxis);
    
    rulerG.select('.domain').attr('stroke', '#cbd5e1');
    rulerG.selectAll('.tick line').attr('stroke', '#cbd5e1').attr('y2', 6);

    let currentY = 50;

    tracks.forEach((track) => {
        const trackG = chartG.append('g')
            .attr('transform', `translate(0, ${currentY})`);

        // Track Label Sidebar
        const labelG = svg.append('g')
            .attr('transform', `translate(10, ${currentY + margin.top})`);
        
        labelG.append('rect')
            .attr('width', 140)
            .attr('height', 20)
            .attr('fill', '#f1f5f9')
            .attr('rx', 2)
            .attr('stroke', '#e2e8f0');

        labelG.append('text')
            .attr('x', 5)
            .attr('y', 14)
            .attr('class', 'text-[9px] font-bold fill-slate-700')
            .text(track.name);

        // Sidebar Settings Icon
        svg.append('g')
            .attr('transform', `translate(${dimensions.width - 25}, ${currentY + margin.top + 5})`)
            .append('path')
            .attr('d', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z')
            .attr('fill', '#94a3b8')
            .attr('class', 'cursor-pointer hover:fill-slate-500');

        if (track.type === 'coverage') {
            // Draw coverage area
            const coverageData = track.id === 'ip_pos' ? getCoverageData('pos') : 
                               track.id === 'ip_neg' ? getCoverageData('neg') : 
                               getCoverageData('all');
            
            const y = d3.scaleLinear()
                .domain([0, d3.max(coverageData, d => d.y) || 5])
                .range([track.height, 0]);

            // Y Axis
            trackG.append('g')
                .attr('class', 'text-[8px] fill-slate-400')
                .call(d3.axisLeft(y).ticks(2))
                .attr('transform', 'translate(-5, 0)')
                .select('.domain').remove();

            const area = d3.area<{x: number, y: number}>()
                .x(d => x(d.x))
                .y0(track.height)
                .y1(d => y(d.y))
                .curve(d3.curveMonotoneX);

            trackG.append('path')
                .datum(coverageData)
                .attr('fill', track.color)
                .attr('fill-opacity', 0.8)
                .attr('d', area);

        } else if (track.type === 'gene') {
            // Draw Gene Model (MANE style)
            const geneY = 15;
            const geneHeight = 10;
            
            // Draw line (intron)
            trackG.append('line')
                .attr('x1', 0)
                .attr('x2', width)
                .attr('y1', geneY + geneHeight/2)
                .attr('y2', geneY + geneHeight/2)
                .attr('stroke', track.color)
                .attr('stroke-width', 1);

            // Draw directional arrows
            for(let i=0; i<width; i+=40) {
                trackG.append('path')
                    .attr('d', 'M0,0 L5,2.5 L0,5')
                    .attr('transform', `translate(${i}, ${geneY + geneHeight/2 - 2.5})`)
                    .attr('fill', 'none')
                    .attr('stroke', track.color)
                    .attr('stroke-width', 0.5);
            }

            // Draw exons (mock from peaks to align roughly)
            const exonPeaks = peaks.filter((_, i) => i % 3 === 0);
            trackG.selectAll('rect.exon')
                .data(exonPeaks)
                .enter()
                .append('rect')
                .attr('x', d => x(d.start - 200))
                .attr('y', geneY)
                .attr('width', d => x(d.end + 200) - x(d.start - 200))
                .attr('height', geneHeight)
                .attr('fill', track.color);
            
            trackG.append('text')
                .attr('x', width / 2)
                .attr('y', geneY + 25)
                .attr('text-anchor', 'middle')
                .attr('class', 'text-[10px] font-bold fill-blue-800')
                .text(`${targetGene} > ENST00000${Math.floor(Math.random() * 999999)}`);
        }

        // Horizontal Separator
        currentY += track.height + 20;
        chartG.append('line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', currentY - 10)
            .attr('y2', currentY - 10)
            .attr('stroke', '#f1f5f9');
    });

  }, [peaks, dimensions, viewport, targetGene, getCoverageData]);

  // Zoom controls
  const handleZoom = (factor: number) => {
      const [start, end] = viewport;
      const center = (start + end) / 2;
      const newWidth = (end - start) * factor;
      setViewport([center - newWidth/2, center + newWidth/2]);
  };

  const handlePan = (direction: 'left' | 'right') => {
      const [start, end] = viewport;
      const move = (end - start) * 0.2 * (direction === 'left' ? -1 : 1);
      setViewport([start + move, end + move]);
  };

  return (
    <div className="w-full bg-[#fcfcfc] rounded-lg border border-slate-300 shadow-sm overflow-hidden font-sans border-b-4 border-b-slate-200" ref={containerRef}>
      {/* IGV Top Header */}
      <div className="bg-[#efefef] border-b border-slate-300 px-3 py-1.5 flex items-center gap-4 text-[11px] text-slate-700 select-none">
        <div className="flex items-center gap-1 font-bold text-slate-900 border-r border-slate-300 pr-3">
            <span className="text-[#a62d2d] text-sm">IGV</span>
            <span className="font-normal opacity-60">hg38</span>
        </div>

        <div className="flex items-center bg-white border border-slate-300 rounded px-2 py-0.5 min-w-[200px] shadow-inner">
            <span className="font-mono text-blue-600 mr-2">chr{peaks[0]?.chr.replace('chr', '') || '1'}</span>
            <input 
                type="text" 
                readOnly
                value={`${Math.round(viewport[0]).toLocaleString()}-${Math.round(viewport[1]).toLocaleString()}`}
                className="w-full bg-transparent outline-none text-slate-600 font-mono"
            />
            <Search size={12} className="text-slate-400" />
        </div>
        
        <span className="opacity-60">{Math.round((viewport[1] - viewport[0])/1000)} kb</span>

        <div className="flex items-center gap-1 ml-auto">
            <button className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50">Select Tracks</button>
            <button className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50">Save Image</button>
            
            <div className="flex items-center gap-2 ml-4 px-2 border-l border-slate-300">
                <button onClick={() => handleZoom(1.2)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><ZoomOut size={16}/></button>
                <div className="w-24 h-1 bg-slate-300 rounded relative">
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full cursor-pointer shadow-sm"></div>
                </div>
                <button onClick={() => handleZoom(0.8)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><ZoomIn size={16}/></button>
            </div>
            
            <button className="ml-2 p-1 text-slate-400"><Maximize2 size={16}/></button>
        </div>
      </div>

      {/* Navigation Ruler */}
      <div className="px-3 py-1 bg-white border-b border-slate-200 flex flex-col items-center">
          <div className="w-[80%] h-3 bg-slate-100 border border-slate-200 rounded-full relative overflow-hidden">
              <div 
                className="absolute h-full bg-blue-100 border-x border-blue-300 z-10"
                style={{ left: '42%', width: '15%' }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-30 text-[8px] font-mono tracking-widest uppercase">
                  chr{peaks[0]?.chr.replace('chr', '') || '1'}
              </div>
          </div>
      </div>

      <div className="relative overflow-hidden bg-white">
        <svg 
            ref={svgRef} 
            width={dimensions.width} 
            height={dimensions.height}
            className="w-full h-auto block"
        />
        
        {/* Interaction Overlays */}
        <div className="absolute top-[50px] left-[160px] cursor-grab active:cursor-grabbing group" style={{width: dimensions.width - 200, height: dimensions.height}}>
            <div className="hidden group-hover:block absolute h-full w-[1px] bg-red-400/30 left-1/2"></div>
        </div>

        {/* Custom IGV Portal Tooltip */}
        <div 
          id="genomic-tooltip" 
          className="absolute pointer-events-none opacity-0 bg-white shadow-xl border border-slate-200 rounded p-1 text-[9px] z-[100] transition-opacity duration-200"
          style={{ top: 0, left: 0 }}
        />
      </div>

      {/* Track Manager Bottom section */}
      <div className="bg-[#f0f0f0] border-t border-slate-300 p-2 select-none">
          <div className="flex items-center gap-4 mb-2">
              <button className="text-[10px] bg-white border border-slate-300 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  Collapse all
              </button>
              <button className="text-[10px] bg-white border border-slate-300 px-2 py-0.5 rounded shadow-sm">
                  Expand all
              </button>
              <div className="text-[9px] font-bold text-slate-500 uppercase ml-auto">Available Tracks (10)</div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
              {tracks.map(t => (
                  <div key={t.id} className="bg-white border border-slate-200 p-1.5 rounded flex flex-col gap-1">
                      <div className="text-[9px] font-bold truncate text-blue-800 underline cursor-pointer">{t.name}</div>
                      <div className="flex items-center justify-between mt-1">
                          <div className="text-[9px] px-1 bg-slate-100 border border-slate-200 rounded flex items-center justify-between w-full">
                              <span>Pack</span>
                              <ChevronDown size={10} />
                          </div>
                      </div>
                  </div>
              ))}
              <div className="bg-white/50 border border-slate-200 border-dashed p-1.5 rounded flex items-center justify-center text-[9px] text-slate-400">
                  + Add more tracks
              </div>
          </div>
      </div>
    </div>
  );
};
