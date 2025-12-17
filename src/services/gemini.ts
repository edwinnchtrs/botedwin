import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Message } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY || "");

export const sendMessageToGemini = async (
    message: string,
    history: Message[]
): Promise<string> => {
    if (!API_KEY) {
        throw new Error("Gemini API Key is missing. Please check your .env file.");
    }

    try {
        // Convert internal message format to Gemini's format
        // Note: Gemini expects 'user' or 'model' roles
        const historyForGemini = history
            .filter((msg) => msg.text) // Filter empty messages just in case
            .map((msg) => ({
                role: msg.sender === "user" ? "user" : "model",
                parts: [{ text: msg.text }],
            }));

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: historyForGemini,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get response from AI.");
    }
};
