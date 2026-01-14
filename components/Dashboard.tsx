
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { CarbonData } from '../types';

interface DashboardProps {
  data: CarbonData;
  onReset: () => void;
}

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
const SCOPE_COLORS = {
  scope1: '#059669',
  scope2: '#3b82f6',
  scope3: '#f59e0b',
};

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const pieData = [
    { name: 'Scope 1', value: data.breakdown.scope1 },
    { name: 'Scope 2', value: data.breakdown.scope2 },
    { name: 'Scope 3', value: data.breakdown.scope3 },
  ];

  const barData = data.sources.sort((a, b) => b.amount - a.amount).slice(0, 8);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{data.companyName}</h2>
          <p className="text-slate-500">Reporting Period: {data.reportingPeriod}</p>
        </div>
        <button 
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Analyze Another File
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Footprint</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-emerald-600">{data.totalEmissions.toLocaleString()}</span>
            <span className="text-lg font-medium text-slate-400">{data.unit}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Combined direct & indirect emissions</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-3">Scope Breakdown</p>
          <div className="space-y-3">
            {['scope1', 'scope2', 'scope3'].map((scope) => (
               <div key={scope} className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: (SCOPE_COLORS as any)[scope] }} />
                   <span className="text-sm font-medium capitalize">{scope.replace('scope', 'Scope ')}</span>
                 </div>
                 <span className="text-sm font-bold">{(data.breakdown as any)[scope].toLocaleString()} {data.unit}</span>
               </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={(SCOPE_COLORS as any)[`scope${index + 1}`]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6">Emissions by Source (Top 8)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="source" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6">AI Strategic Insights</h3>
          <div className="space-y-4">
            {data.insights.map((insight, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-500">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{insight}</p>
              </div>
            ))}
            <hr className="border-slate-100 my-4" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Recommendations</h4>
            <ul className="space-y-2">
              {data.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex gap-2">
                  <span className="text-emerald-500">•</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
