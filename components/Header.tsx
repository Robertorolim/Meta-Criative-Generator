
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
          Meta Creative Generator
        </h1>
        <div className="text-xs text-slate-400 border border-sky-500/30 bg-sky-500/10 rounded-full px-3 py-1">
          Andromeda Compliant
        </div>
      </div>
    </header>
  );
};
