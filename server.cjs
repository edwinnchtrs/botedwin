const express = require('express');
const cors = require('cors');
const CharacterAI = require('node_characterai');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const characterAI = new CharacterAI();

// Store active chats in memory (simple implementation)
// Map<string, any>
const chats = new Map();

// Configuration - REPLACE THESE WITH YOUR VALUES
// You can also use specific environment variables
const CHARACTER_ID = process.env.CHARACTER_ID || "UvmcFYHfT11SuZvgxiY2sxktiDozY2rh4wsMS10TPGI"; // Default: Programmer Psychologist
const SESSION_TOKEN = process.env.SESSION_TOKEN || ""; // Put your CAI session token here

// Initialize AI
async function initAI() {
    try {
        if (SESSION_TOKEN) {
            console.log("Authenticating with session token...");
            await characterAI.authenticateWithToken(SESSION_TOKEN);
        } else {
            console.log("Authenticating as guest...");
            await characterAI.authenticateAsGuest();
        }
        console.log("Character.AI authenticated successfully");
    } catch (error) {
        console.error("Failed to authenticate Character.AI:", error);
    }
}

initAI();

const voiceCache = new Map(); // Cache voice IDs

app.post('/api/tts', async (req, res) => {
    try {
        const { text, characterId = CHARACTER_ID } = req.body;
        console.log(`TTS Request for: ${characterId}`);

        if (!characterAI.isAuthenticated()) {
            await initAI();
        }

        // 1. Get Voice ID (Cache it to avoid repeated fetches)
        let voiceId = voiceCache.get(characterId);

        if (!voiceId) {
            console.log("Fetching character info for voice ID...");
            const charInfo = await characterAI.fetchCharacterInfo(characterId);
            // Try different possible properties for voice ID
            voiceId = charInfo.voiceId || charInfo.voice_uuid || "";

            if (!voiceId) {
                console.warn("No voice ID found for this character. Trying default search...");
                // Fallback or error? For now, let's error if no voice.
                // Or maybe the library handles null voiceId as default?
            } else {
                voiceCache.set(characterId, voiceId);
                console.log(`Found Voice ID: ${voiceId}`);
            }
        }

        // 2. Fetch TTS
        // The library returns a ReadableStream or buffer? 
        // Based on docs/common usage, fetchTTS returns a URL or buffer.
        // Let's assume the library's fetchTTS returns the audio buffer directly or a path.
        // Actually, node_characterai fetchTTS returns: Promise<Buffer> usually.

        if (!voiceId) {
            return res.status(400).json({ error: "Character has no voice assigned." });
        }

        const audioPathOrBuffer = await characterAI.fetchTTS(voiceId, text);

        // If it returns a buffer, send it.
        // If it returns a path (some versions save file), we need to read it.
        // Let's assume buffer for now as it's cleaner.

        res.set('Content-Type', 'audio/mpeg');
        res.send(audioPathOrBuffer);

    } catch (error) {
        console.error("TTS Error:", error);
        res.status(500).json({ error: "TTS Failed", details: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, characterId = CHARACTER_ID } = req.body;

        if (!characterAI.isAuthenticated()) {
            await initAI();
        }

        let chat = chats.get(characterId);

        if (!chat) {
            chat = await characterAI.createOrContinueChat(characterId);
            chats.set(characterId, chat);
        }

        const response = await chat.sendAndAwaitResponse(message, true);

        res.json({
            text: response.text,
        });

    } catch (error) {
        console.error("Error in chat endpoint:", error);
        res.status(500).json({ error: "Failed to communicate with AI", details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Environment: Node ${process.version}`);
});
