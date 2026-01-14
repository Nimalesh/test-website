
import React, { useState, useCallback } from 'react';
import { Header, Footer } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { analyzeCarbonReport } from './services/geminiService';
import { CarbonData, ViewState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('idle');
  const [data, setData] = useState<CarbonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setView('analyzing');
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          const result = await analyzeCarbonReport(base64String, file.type);
          setData(result);
          setView('result');
        } catch (err) {
          setError('Failed to analyze the document. Please ensure it contains carbon emission data.');
          setView('error');
        }
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setView('error');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('An unexpected error occurred.');
      setView('error');
    }
  };

  const reset = () => {
    setView('idle');
    setData(null);
    setError(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="container mx-auto flex-1 px-4 py-12 sm:px-6 lg:py-20">
        {view === 'idle' && (
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
              AI-Powered <span className="text-emerald-600">Carbon Accounting</span>
            </h1>
            <p className="text-lg leading-8 text-slate-600 mb-10">
              Upload your environmental reports, utility bills, or sustainability declarations. 
              Our Gemini-powered engine extracts emission data and visualizes your footprint in seconds.
            </p>
            
            <div className="relative group cursor-pointer">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,image/*,.csv"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 transition-all group-hover:border-emerald-400 group-hover:bg-emerald-50/50">
                <div className="mb-4 rounded-full bg-emerald-100 p-4 text-emerald-600 group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-slate-900">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-500">PDF, JPG, PNG or CSV (max. 10MB)</p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: 'Scope 1, 2, 3', desc: 'Full breakdown support' },
                { label: 'Strategic Insights', desc: 'AI-driven reduction tips' },
                { label: 'Audit Ready', desc: 'Compliant with GHG protocol' }
              ].map((feature, i) => (
                <div key={i} className="rounded-xl bg-slate-100/50 p-4">
                  <h3 className="text-sm font-bold text-slate-900">{feature.label}</h3>
                  <p className="text-xs text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="relative h-24 w-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Analyzing Environmental Data</h2>
            <p className="text-slate-500 mt-2">Gemini is processing scopes and calculating footprints...</p>
          </div>
        )}

        {view === 'error' && (
          <div className="mx-auto max-w-md text-center py-20">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Analysis Failed</h2>
            <p className="text-slate-500 mt-2 mb-8">{error}</p>
            <button 
              onClick={reset}
              className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {view === 'result' && data && (
          <Dashboard data={data} onReset={reset} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
