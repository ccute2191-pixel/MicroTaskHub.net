
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getJobAssistance = async (jobTitle: string): Promise<string> => {
  if (!process.env.API_KEY) return "API Key is missing. Please configure the environment.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain in 3 simple, short steps how to complete a micro-job with the title: "${jobTitle}". Keep it safe and professional.`,
    });
    return response.text || "No advice available.";
  } catch (error) {
    console.error("GenAI Error:", error);
    return "Sorry, I couldn't fetch assistance right now.";
  }
};

export const generateJobDescription = async (title: string): Promise<string> => {
  if (!process.env.API_KEY) return "API Key is missing.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, engaging description for a micro-job titled "${title}". Include a safety warning.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("GenAI Error:", error);
    return "Error generating description.";
  }
};
