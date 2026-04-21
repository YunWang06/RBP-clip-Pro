import React from 'react';
import { Dna } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-8 shadow-md z-20 sticky top-0">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded-lg">
            <Dna size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">RBP-SearchPro</h1>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">首页</a>
        <a href="#" className="text-slate-300 hover:text-white transition-colors">文档</a>
        <a href="#" className="text-slate-300 hover:text-white transition-colors">数据集</a>
        <a href="#" className="text-slate-300 hover:text-white transition-colors">关于我们</a>
      </nav>
    </header>
  );
};
