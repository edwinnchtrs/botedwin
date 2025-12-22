// API Communication using Gemini (Better AI Quality)
interface ApiResponse {
    success: boolean;
    result?: string;
    error?: string;
}

export const sendMessageToBot = async (
    content: string,
    systemPrompt: string = ""
): Promise<string> => {
    try {
        // Combine system prompt and user message
        const fullMessage = systemPrompt
            ? `${systemPrompt}\n\nUser: ${content}`
            : content;

        // Use Gemini API (smarter responses)
        const params = new URLSearchParams({
            text: fullMessage,
            prompt: 'helpful AI assistant' // Optional: customize personality
        });

        const apiUrl = `https://api.ryzumi.vip/api/ai/gemini?${params.toString()}`;

        console.log('🤖 [API] Calling Gemini API...');

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success && data.result) {
            console.log('🤖 [API] Gemini response received');
            return data.result;
        } else {
            throw new Error(data.error || 'No result from API');
        }

    } catch (error: any) {
        console.error('🤖 [API] Gemini Error:', error);

        // Retry with basic endpoint if main fails
        try {
            const simpleUrl = `https://api.ryzumi.vip/api/ai/gemini?text=${encodeURIComponent(content)}`;
            const retryResponse = await fetch(simpleUrl);
            if (!retryResponse.ok) throw new Error("Retry failed");
            const data: ApiResponse = await retryResponse.json();
            if (data.success && data.result) return data.result;
        } catch (retryError) {
            console.error("Retry also failed:", retryError);
        }

        throw new Error(error.message || "Gagal terhubung ke AI.");
    }
};
