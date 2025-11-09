import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-transparent backdrop-blur-sm sticky top-0 z-10 border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl text-gray-100">
          <span className="font-bold">Meta Creative Generator</span>
          <span className="text-sky-400 font-normal ml-2">by Fran Costa</span>
        </h1>
        <div className="text-xs text-sky-300 border border-sky-300/30 bg-sky-500/10 rounded-full px-3 py-1 hidden sm:block">
          Andromeda Compliant
        </div>
      </div>
    </header>
  );
};