
import { GoogleGenAI, Type } from "@google/genai";
import { CarbonData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeCarbonReport = async (fileBase64: string, mimeType: string): Promise<CarbonData> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze the attached environmental/carbon report. Extract the specific carbon accounting data.
    The output must strictly follow the provided JSON schema.
    If exact numbers for specific scopes are missing, provide the best estimate based on the text.
    Ensure totalEmissions equals the sum of scope1, scope2, and scope3.
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
          unit: { type: Type.STRING, description: "e.g., tCO2e" },
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
        required: ["companyName", "totalEmissions", "breakdown", "sources"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text.trim()) as CarbonData;
};
