
export interface EmissionSource {
  source: string;
  amount: number;
  unit: string;
  scope: 1 | 2 | 3;
}

export interface CarbonData {
  companyName: string;
  reportingPeriod: string;
  totalEmissions: number;
  unit: string;
  breakdown: {
    scope1: number;
    scope2: number;
    scope3: number;
  };
  sources: EmissionSource[];
  insights: string[];
  recommendations: string[];
}

export type ViewState = 'idle' | 'uploading' | 'analyzing' | 'result' | 'error';
