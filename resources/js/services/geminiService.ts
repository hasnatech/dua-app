
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access env var from Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getSpiritualInsight = async (duaTitle: string, duaText: string) => {
  if (!API_KEY) return "Insight unavailable without configuration.";

  try {
    const ai = new GoogleGenerativeAI(API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Provide a short, 2-sentence spiritual reflection or historical context for this Dua: "${duaTitle}". Arabic: "${duaText}". Keep it concise and inspiring for a pilgrim.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text || "May Allah accept your supplications.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Reflect on the mercy of Allah during this blessed journey.";
  }
};
