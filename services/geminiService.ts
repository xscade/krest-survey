import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
// Note: In a production app, ensure the API key is set in your environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateWelcomeMessage = async (
  name: string, 
  reason: string
): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "Thank you! Our team will assist you shortly.";
    }

    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a warm and professional dental receptionist at "Krest Dental".
      A patient named "${name}" has just checked in for "${reason}".
      Write a single, short, reassuring sentence (max 20 words) to display on the screen welcoming them.
      If they are in pain, be empathetic. If it's cosmetic, be encouraging.
      Do not include quotation marks.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text?.trim() || "Thank you! Our team will assist you shortly.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Thank you! Our team will assist you shortly.";
  }
};