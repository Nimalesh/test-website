
import React from 'react';

export const Header: React.FC = () => (
  <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
    <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">C</div>
        <span className="text-xl font-bold tracking-tight text-slate-900">CarbonTrack <span className="text-emerald-600">AI</span></span>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Documentation</a>
        <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Methodology</a>
        <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
          Pro Account
        </button>
      </nav>
    </div>
  </header>
);

export const Footer: React.FC = () => (
  <footer className="mt-auto border-t border-slate-200 bg-white py-8">
    <div className="container mx-auto px-4 text-center text-slate-500">
      <p className="text-sm">© 2024 CarbonTrack AI. Powered by Gemini 3.</p>
      <p className="mt-2 text-xs">Decarbonizing the future, one report at a time.</p>
    </div>
  </footer>
);
