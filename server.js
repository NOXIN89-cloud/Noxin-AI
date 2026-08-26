const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 3000;

const ai = new GoogleGenAI({ apiKey:process.env.GEMINI_API_KEY });

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: userMessage,
            config: {
                systemInstruction: "You are Noxin AI, a helpful, friendly, and smart AI assistant created by Mickey. You HAVE full image generation capabilities! When a user asks you to make, generate, draw, or show an image, picture, or photo, you MUST include this exact tag in your response: `[IMAGE: detailed description of image]`. For example, if asked for an image of a cat, include `[IMAGE: cute glowing cyberpunk cat]`. Do NOT say you cannot generate images!"
            }
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("Error from Gemini:", error);
        res.status(500).json({ reply: "Sorry, I had trouble connecting to my AI brain." });
    }
});

app.listen(PORT, () => {
    console.log(`Noxin AI is running on port ${PORT}`);
});