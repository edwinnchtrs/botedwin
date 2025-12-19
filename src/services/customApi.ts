const SYSTEM_PROMPT = "Kamu adalah AI bernama Aiko, asisten virtual yang cerdas, ramah, dan bergaya futuristik/anime. Kamu suka menggunakan emoji ✨🌌. Kamu selalu membantu pengguna dengan sopan namun santai.";

interface ApiResponse {
    status: boolean;
    data: string;
}

export const sendMessageToBot = async (content: string, systemPrompt: string = SYSTEM_PROMPT): Promise<string> => {
    try {
        const encodedPrompt = encodeURIComponent(systemPrompt);
        const encodedContent = encodeURIComponent(content);

        const url = `https://api.siputzx.my.id/api/ai/gpt3?prompt=${encodedPrompt}&content=${encodedContent}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        // The API seems to return { status: true, data: "response text" } based on typical patterns, 
        // but we should handle if it returns raw text or a different structure.
        // Let's assume the user's example implies it returns a standard JSON.
        return data.data || "Maaf, aku tidak bisa memproses itu.";

    } catch (error: any) {
        console.error("Error calling Custom API:", error);
        throw new Error(error.message || "Gagal terhubung ke Aiko.");
    }
};
