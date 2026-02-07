
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const getSpiritualInsight = async (duaTitle: string, duaText: string) => {
  if (!API_KEY) return "Insight unavailable without configuration.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a short, 2-sentence spiritual reflection or historical context for this Dua: "${duaTitle}". Arabic: "${duaText}". Keep it concise and inspiring for a pilgrim.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });

    return response.text || "May Allah accept your supplications.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Reflect on the mercy of Allah during this blessed journey.";
  }
};
