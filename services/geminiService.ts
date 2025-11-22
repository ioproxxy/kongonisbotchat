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
        temperature: 0.7, 
        maxOutputTokens: 1000, 
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
  }

  if (!chatSession) {
      return "Sorry pal, the register is broken. (Check API Key)";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "Sorry, didn't catch that. It's loud in here.";
  } catch (error) {
    console.error("Error sending message:", error);
    
    // Attempt to recover by resetting session
    console.log("Attempting to reset session and retry...");
    const newSession = resetChat();
    
    if (newSession) {
        try {
            // Retry the message with the new session
            const retryResponse = await newSession.sendMessage({ message });
            return retryResponse.text || "Sorry, still having trouble hearing you.";
        } catch (retryError) {
            console.error("Retry failed:", retryError);
        }
    }

    // Fallback if retry fails
    return "Sorry mate, having a bit of trouble with the till. Mind asking that one more time?";
  }
};