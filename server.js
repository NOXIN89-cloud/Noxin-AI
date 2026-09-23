require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Endpoint that talks to Ollama's cloud API
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch('https://api.ollama.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gemma', // Update this if you are using a different cloud model name
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        const data = await response.json();
        
        // Send the AI's reply back to your frontend
        const aiReply = data.choices?.[0]?.message?.content || "No response received.";
        res.json({ reply: aiReply });

    } catch (error) {
        console.error("Error communicating with Ollama API:", error);
        res.status(500).json({ reply: "Error: Could not connect to AI service." });
    }
});
// Serve your frontend homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Noxin AI server running at http://localhost:${PORT}`);
});