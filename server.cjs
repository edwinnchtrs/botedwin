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

app.post('/api/chat', async (req, res) => {
    try {
        const { message, characterId = CHARACTER_ID } = req.body;

        if (!characterAI.isAuthenticated()) {
            // Try to re-authenticate or fail
            await initAI();
        }

        // Simple single-user persistence for demo purposes
        // In a real app, you'd track session IDs from the client
        let chat = chats.get(characterId);

        if (!chat) {
            console.log(`Creating new chat for character: ${characterId}`);
            chat = await characterAI.createOrContinueChat(characterId);
            chats.set(characterId, chat);
        }

        console.log(`Sending message to bot: ${message}`);
        const response = await chat.sendAndAwaitResponse(message, true);

        console.log(`Received response: ${response.text}`);
        res.json({
            text: response.text,
            // Include other metadata if available/needed
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
