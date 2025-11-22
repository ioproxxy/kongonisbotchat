import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let chatSession: Chat | null = null;

export const initializeChat = () => {
  try {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // A bit creative for the "casual" vibe
        maxOutputTokens: 500, // Allow enough space for the bill calculation
      },
    });

    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return null;
  }
};

export const resetChat = () => {
  chatSession = null;
  return initializeChat();
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
    if (!chatSession) {
        return "Sorry pal, the register is broken. (API Error)";
    }
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "Sorry, didn't catch that. It's loud in here.";
  } catch (error) {
    console.error("Error sending message:", error);
    return "Whoops, dropped a glass. Can you say that again?";
  }
};