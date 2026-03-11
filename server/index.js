import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db } from '../db/index.js';
import { conversations, messages } from '../db/schema.js';
import { eq, desc, asc } from 'drizzle-orm';
import { MODELS, streamChat } from './ai.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ─── Get all available models ────────────────────────────
app.get('/api/models', (req, res) => {
    res.json(MODELS);
});

// ─── Get all conversations ───────────────────────────────
app.get('/api/conversations', async (req, res) => {
    try {
        const allConversations = await db
            .select()
            .from(conversations)
            .orderBy(desc(conversations.updatedAt));
        res.json(allConversations);
    } catch (err) {
        console.error('Error fetching conversations:', err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// ─── Create a new conversation ───────────────────────────
app.post('/api/conversations', async (req, res) => {
    try {
        const { title } = req.body;
        const [conv] = await db
            .insert(conversations)
            .values({ title: title || 'New Chat' })
            .returning();
        res.json(conv);
    } catch (err) {
        console.error('Error creating conversation:', err);
        res.status(500).json({ error: 'Failed to create conversation' });
    }
});

// ─── Rename a conversation ───────────────────────────────
app.patch('/api/conversations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const [conv] = await db
            .update(conversations)
            .set({ title, updatedAt: new Date() })
            .where(eq(conversations.id, parseInt(id)))
            .returning();
        res.json(conv);
    } catch (err) {
        console.error('Error renaming conversation:', err);
        res.status(500).json({ error: 'Failed to rename conversation' });
    }
});

// ─── Delete a conversation ───────────────────────────────
app.delete('/api/conversations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(conversations).where(eq(conversations.id, parseInt(id)));
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting conversation:', err);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
});

// ─── Get messages for a conversation ─────────────────────
app.get('/api/conversations/:id/messages', async (req, res) => {
    try {
        const { id } = req.params;
        const allMessages = await db
            .select()
            .from(messages)
            .where(eq(messages.conversationId, parseInt(id)))
            .orderBy(asc(messages.createdAt));
        res.json(allMessages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// ─── Chat with streaming ─────────────────────────────────
app.post('/api/chat', async (req, res) => {
    try {
        const { conversationId, message, model } = req.body;

        if (!conversationId || !message || !model) {
            return res.status(400).json({ error: 'conversationId, message, and model are required' });
        }

        // Save user message
        await db.insert(messages).values({
            conversationId,
            role: 'user',
            content: message,
            model: null,
        });

        // Get conversation history
        const history = await db
            .select()
            .from(messages)
            .where(eq(messages.conversationId, conversationId))
            .orderBy(asc(messages.createdAt));

        // Remove the last user message from history (we'll send it separately)
        const chatHistory = history.slice(0, -1).map(m => ({
            role: m.role,
            content: m.content,
        }));

        // Set up SSE for streaming
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        });

        let fullResponse = '';

        try {
            fullResponse = await streamChat(model, chatHistory, message, (chunk) => {
                res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
            });
        } catch (aiErr) {
            console.error('AI Error:', aiErr);
            fullResponse = `Error: ${aiErr.message || 'Failed to get response from AI model.'}`;
            res.write(`data: ${JSON.stringify({ type: 'chunk', content: fullResponse })}\n\n`);
        }

        // Save assistant message
        await db.insert(messages).values({
            conversationId,
            role: 'assistant',
            content: fullResponse,
            model,
        });

        // Auto-title the conversation if it's the first exchange
        if (history.length <= 1) {
            const title = message.length > 50 ? message.substring(0, 50) + '...' : message;
            await db
                .update(conversations)
                .set({ title, updatedAt: new Date() })
                .where(eq(conversations.id, conversationId));
            res.write(`data: ${JSON.stringify({ type: 'title', content: title })}\n\n`);
        } else {
            await db
                .update(conversations)
                .set({ updatedAt: new Date() })
                .where(eq(conversations.id, conversationId));
        }

        res.write(`data: ${JSON.stringify({ type: 'done', model })}\n\n`);
        res.end();
    } catch (err) {
        console.error('Chat error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process chat' });
        } else {
            res.write(`data: ${JSON.stringify({ type: 'error', content: err.message })}\n\n`);
            res.end();
        }
    }
});

// Only listen if not running on Vercel (serverless)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🤖 AJ11 server running on http://localhost:${PORT}`);
    });
}

export default app;
