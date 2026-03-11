import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

// Initialize clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// All supported models
export const MODELS = [
    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (Preview)', provider: 'gemini' },
    { id: 'gemini-3.1-flash-lite-preview', name: 'Gemini 3.1 Flash Lite (Preview)', provider: 'gemini' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Preview)', provider: 'gemini' },
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Preview)', provider: 'gemini' },
    { id: 'gemini-2.5-flash-lite-preview', name: 'Gemini 2.5 Flash Lite Preview', provider: 'gemini' },
    { id: 'gemini-2.5-pro-preview-05-06', name: 'Gemini 2.5 Pro', provider: 'gemini' },
    { id: 'gemini-2.5-flash-preview-04-17', name: 'Gemini 2.5 Flash', provider: 'gemini' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'gemini' },
    { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', provider: 'gemini' },
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', provider: 'groq' },
];

/**
 * Send a chat message and stream the response
 * @param {string} modelId - The model to use
 * @param {Array} history - Chat history [{role, content}]
 * @param {string} userMessage - The new user message
 * @param {function} onChunk - Callback for each streamed chunk
 * @returns {Promise<string>} Full response text
 */
export async function streamChat(modelId, history, userMessage, onChunk) {
    const modelInfo = MODELS.find(m => m.id === modelId);
    if (!modelInfo) throw new Error(`Unknown model: ${modelId}`);

    if (modelInfo.provider === 'gemini') {
        return streamGemini(modelId, history, userMessage, onChunk);
    } else {
        return streamGroq(modelId, history, userMessage, onChunk);
    }
}

async function streamGemini(modelId, history, userMessage, onChunk) {
    const model = genAI.getGenerativeModel({ model: modelId });

    // Convert history to Gemini format
    const geminiHistory = history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessageStream(userMessage);

    let fullText = '';
    for await (const chunk of result.stream) {
        const text = chunk.text();
        fullText += text;
        onChunk(text);
    }
    return fullText;
}

async function streamGroq(modelId, history, userMessage, onChunk) {
    const messages = [
        ...history.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: userMessage },
    ];

    const stream = await groq.chat.completions.create({
        model: modelId,
        messages,
        stream: true,
    });

    let fullText = '';
    for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        fullText += text;
        if (text) onChunk(text);
    }
    return fullText;
}
