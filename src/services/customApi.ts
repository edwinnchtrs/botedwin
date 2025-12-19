const SYSTEM_PROMPT = "Kamu adalah AI bernama Edwin_Chtr's, asisten virtual yang cerdas, ramah, dan bergaya futuristik. Kamu suka menggunakan emoji ✨🌌. Kamu selalu membantu pengguna dengan sopan namun santai.";

interface ApiResponse {
    success: boolean;
    result: string;
    session?: string;
}

export const sendMessageToBot = async (content: string, systemPrompt: string = SYSTEM_PROMPT): Promise<string> => {
    try {
        // Combine system prompt with user content
        const fullText = systemPrompt + "\n\nUser: " + content;

        // Check if we need to use POST (for very long content like file attachments)
        const shouldUsePost = fullText.length > 1800;

        if (shouldUsePost) {
            // Try POST method for long content
            try {
                const response = await fetch('https://api.ryzumi.vip/api/ai/v2/chatgpt', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: fullText
                    })
                });

                if (response.ok) {
                    const data: ApiResponse = await response.json();
                    if (data.success && data.result) {
                        return data.result;
                    }
                }
                // If POST fails, fall back to GET with truncated content
            } catch (postError) {
                console.warn("POST failed, falling back to GET:", postError);
            }
        }

        // Use GET method (default or fallback)
        // Truncate if too long to avoid URL issues
        const truncatedText = fullText.length > 1800
            ? fullText.substring(0, 1800) + "...[truncated]"
            : fullText;

        const encodedText = encodeURIComponent(truncatedText);
        const url = `https://api.ryzumi.vip/api/ai/v2/chatgpt?text=${encodedText}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success && data.result) {
            return data.result;
        } else {
            return "Maaf, aku tidak bisa memproses itu.";
        }

    } catch (error: any) {
        console.error("Error calling Ryzumi API:", error);
        throw new Error(error.message || "Gagal terhubung ke AI.");
    }
};
