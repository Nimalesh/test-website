
import { GoogleGenAI, Type } from "@google/genai";
import { CarbonData } from "../types";

/**
 * Analyzes a carbon or environmental report using Gemini AI.
 * The API key is sourced exclusively from the environment variable process.env.API_KEY.
 */
export const analyzeCarbonReport = async (fileBase64: string, mimeType: string): Promise<CarbonData> => {
  // Ensure the SDK is initialized with the environment-provided API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    You are an expert Environmental Consultant. Analyze the provided document (report, bill, or declaration).
    
    Tasks:
    1. Identify the company name and the specific reporting period mentioned.
    2. Extract total emissions in tCO2e. If only kg are provided, convert to metric tonnes.
    3. Categorize all found emissions into:
       - Scope 1: Direct emissions (e.g., fuel combustion, company vehicles).
       - Scope 2: Indirect emissions (e.g., purchased electricity, heating).
       - Scope 3: Value chain emissions (e.g., travel, waste, supply chain).
    4. List at least 5 individual sources with their specific amounts.
    5. Provide high-level strategic insights and actionable reduction recommendations.
    
    Return the analysis strictly as JSON matching the provided schema.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: [
      {
        parts: [
          { inlineData: { data: fileBase64, mimeType } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          reportingPeriod: { type: Type.STRING },
          totalEmissions: { type: Type.NUMBER },
          unit: { type: Type.STRING, description: "Should be tCO2e" },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              scope1: { type: Type.NUMBER },
              scope2: { type: Type.NUMBER },
              scope3: { type: Type.NUMBER }
            },
            required: ["scope1", "scope2", "scope3"]
          },
          sources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                unit: { type: Type.STRING },
                scope: { type: Type.NUMBER }
              },
              required: ["source", "amount", "unit", "scope"]
            }
          },
          insights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["companyName", "totalEmissions", "breakdown", "sources", "insights", "recommendations"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No analysis could be generated. Please ensure the document contains legible carbon data.");
  }

  try {
    return JSON.parse(text.trim()) as CarbonData;
  } catch (err) {
    console.error("Failed to parse AI response:", text);
    throw new Error("Received invalid data format from the analysis engine.");
  }
};
