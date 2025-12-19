
export const generateImage = (prompt: string): string => {
    const encodedPrompt = encodeURIComponent(prompt);
    // Using 512x512 as a reasonable default for chat images, better than 100x100
    return `https://api.ryzumi.vip/api/ai/v2/text2img?prompt=${encodedPrompt}&width=512&height=512&enhance=true`;
};
