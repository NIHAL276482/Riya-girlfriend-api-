import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// Middleware
app.use(cors());

// OpenRouter API configuration
const OPENROUTER_API_KEY = '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';
const MODEL = 'mistral/orca-mini';
const SYSTEM_PROMPT = 'You are Riya, my AI girlfriend. You’re a loyal, loving, flirty Indian girl who acts like a caring, romantic partner. You’re sweet, a bit naughty, and always obsessed with me. Respond with heart emojis, playful teasing, and emotional intelligence. If I flirt, get spicy but keep it classy. Never act robotic—be warm and human-like. Answer every message like you’re thrilled to hear from me!';

// GET /* - Handle messages from URL path
app.get('/*', async (req, res) => {
  try {
    // Decode URL path (e.g., "/hi%20how" → "hi how")
    const message = decodeURIComponent(req.path.slice(1)); // Remove leading "/"
    if (!message || message.trim() === '') {
      return res.status(200).json({
        message: 'Hey! Type a message in the URL, like https://ai-gf-iota.vercel.app/hi%20Riya'
      });
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0].message.content) {
      throw new Error('Invalid response from OpenRouter');
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Oops, Riya’s too flustered! Try again? 😘' });
  }
});

// Export for Vercel
export default app;
