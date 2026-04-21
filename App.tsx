
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RbpDetails } from './components/RbpDetails';
import { PeakView } from './components/PeakView';
import { FilterState, FilterCategory, RbpRecord, PeakData } from './types';
import { MOCK_DATA, getMockPeaks } from './constants';
import { Search, Database, Dna, Activity, FlaskConical, ArrowRight } from 'lucide-react';

type ViewState = 'search' | 'details' | 'peaks';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('search');
  const [selectedRbp, setSelectedRbp] = useState<RbpRecord | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [currentPeaks, setCurrentPeaks] = useState<PeakData[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    targets: [],
    cellLines: [],
    methods: []
  });

  const handleToggleFilter = (category: FilterCategory, value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const isSelected = current.includes(value);
      if (isSelected) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const handleClearCategory = (category: FilterCategory) => {
    setFilters(prev => ({ ...prev, [category]: [] }));
  };

  const clearAllFilters = () => {
      setFilters({
          targets: [],
          cellLines: [],
          methods: []
      });
      setSearchTerm('');
  };

  const handleViewDetails = (rbp: RbpRecord) => {
    setSelectedRbp(rbp);
    setCurrentView('details');
  };

  // Navigate to Peaks View
  const handleViewPeaks = (targetGene: string) => {
      setSelectedTarget(targetGene);
      setCurrentPeaks(getMockPeaks(targetGene));
      setCurrentView('peaks');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedRbp(null);
  };

  const handleBackToDetails = () => {
      setCurrentView('details');
      setSelectedTarget(null);
  };

  // Filtering Logic
  const filteredResults = useMemo(() => {
    return MOCK_DATA.filter((item: RbpRecord) => {
      // 1. Text Search (Name or GeneID)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        item.name.toLowerCase().includes(searchLower) || 
        item.geneId.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // 2. Sidebar Filters
      const matchesTarget = filters.targets.length === 0 || 
        filters.targets.some(f => item.targets.includes(f));

      const matchesCell = filters.cellLines.length === 0 || 
        filters.cellLines.some(f => item.cellLines.includes(f));

      const matchesMethod = filters.methods.length === 0 || 
        filters.methods.some(f => item.methods.includes(f));

      return matchesTarget && matchesCell && matchesMethod;
    });
  }, [searchTerm, filters]);

  // Handle Search Action (Button Click or Enter Key)
  const handleSearchAction = () => {
    if (filteredResults.length === 1) {
        handleViewDetails(filteredResults[0]);
    } else if (filteredResults.length > 0) {
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSearchAction();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Only show in search view */}
        {currentView === 'search' && (
          <Sidebar 
            filters={filters} 
            onToggleFilter={handleToggleFilter} 
            onClearCategory={handleClearCategory}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          
          {currentView === 'peaks' && selectedTarget ? (
             <PeakView 
                targetGene={selectedTarget} 
                peaks={currentPeaks} 
                onBack={handleBackToDetails} 
             />
          ) : currentView === 'details' && selectedRbp ? (
            <RbpDetails 
                rbp={selectedRbp} 
                onBack={handleBackToSearch} 
                onViewPeaks={handleViewPeaks}
            />
          ) : (
            <>
              {/* Hero / Search Section */}
              <div className="relative bg-slate-900 text-white py-24 px-8 flex flex-col items-center justify-center shrink-0 overflow-hidden">
                {/* Smoother Gradient Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.15),_transparent_70%)]"></div>
                    {/* Very subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                </div>

                <div className="relative z-10 w-full max-w-3xl text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                        Search for RNA Binding Proteins
                    </h2>
                    
                    <div className="relative flex items-center w-full shadow-2xl rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5 backdrop-blur-sm border border-white/10">
                        <div className="pl-6 pr-4 flex items-center justify-center">
                            <Search className="text-slate-400" size={24} />
                        </div>
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="输入 RBP 名称 或 GeneID (例如: AGO2, ENSG000...)" 
                            className="w-full py-5 px-2 text-lg text-white bg-transparent focus:outline-none placeholder:text-slate-500"
                        />
                        <button 
                            onClick={handleSearchAction}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-5 px-10 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                        >
                            搜索
                        </button>
                    </div>
                </div>
              </div>

              {/* Results Area */}
              <div id="results-container" className="p-8 max-w-6xl mx-auto w-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Database size={24} className="text-blue-500" />
                        检索结果 
                        <span className="text-sm font-normal text-slate-500 ml-2 bg-slate-200 px-2 py-1 rounded-full">
                            {filteredResults.length} 条记录
                        </span>
                    </h3>
                    
                    {(filters.targets.length > 0 || filters.cellLines.length > 0 || filters.methods.length > 0 || searchTerm) && (
                        <button 
                            onClick={clearAllFilters}
                            className="text-sm text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors border border-red-200"
                        >
                            清除所有筛选
                        </button>
                    )}
                </div>

                {filteredResults.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-500 text-lg">未找到匹配的 RBP 数据</p>
                        <p className="text-slate-400 text-sm mt-2">尝试更改搜索关键词或左侧筛选条件</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredResults.map(rbp => (
                            <div key={rbp.id} className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 group-hover:bg-blue-600"></div>
                                
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 
                                                className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors cursor-pointer"
                                                onClick={() => handleViewDetails(rbp)}
                                            >
                                                {rbp.name}
                                            </h4>
                                            <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                                {rbp.geneId}
                                            </span>
                                            <span className="text-xs bg-slate-50 text-slate-400 px-2 py-0.5 rounded border border-slate-100">
                                                {rbp.geneType}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 text-sm mb-4 leading-relaxed max-w-3xl line-clamp-2">
                                            {rbp.description}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0">
                                         <button 
                                            onClick={() => handleViewDetails(rbp)}
                                            className="text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors flex items-center"
                                         >
                                            查看详情
                                            <ArrowRight size={16} className="ml-1" />
                                         </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 mt-2 pt-4 border-t border-slate-100">
                                    {/* RNA Targets */}
                                    <div className="flex items-center gap-2">
                                        <Dna size={16} className="text-purple-500" />
                                        <div className="flex flex-wrap gap-1">
                                            {rbp.targets.map(t => (
                                                <span key={t} className="text-xs font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Cell Lines */}
                                    <div className="flex items-center gap-2">
                                        <Activity size={16} className="text-orange-500" />
                                        <div className="flex flex-wrap gap-1">
                                            {rbp.cellLines.map(c => (
                                                <span key={c} className="text-xs font-medium bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-100">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Methods */}
                                    <div className="flex items-center gap-2">
                                        <FlaskConical size={16} className="text-emerald-500" />
                                        <div className="flex flex-wrap gap-1">
                                            {rbp.methods.map(m => (
                                                <span key={m} className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
