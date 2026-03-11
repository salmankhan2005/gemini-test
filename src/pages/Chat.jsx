import { useState, useEffect, useRef, useCallback } from 'react';
import ModelSelector from '../components/ModelSelector';
import MessageBubble from '../components/MessageBubble';

const SUGGESTIONS = [
    'Explain quantum computing simply',
    'Write a Python factorial function',
    'What are the latest AI trends?',
    'Help me plan a road trip',
];

export default function Chat({
    conversation,
    setActiveConversation,
    createConversation,
    models,
    selectedModel,
    onModelChange,
    onConversationUpdate,
    onToggleSidebar,
    sidebarOpen,
}) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Load messages when conversation changes
    useEffect(() => {
        if (!conversation) {
            setMessages([]);
            return;
        }
        fetch(`/api/conversations/${conversation.id}/messages`)
            .then(r => r.json())
            .then(setMessages)
            .catch(console.error);
    }, [conversation?.id]);

    // Auto-resize textarea
    const handleInputChange = (e) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
    };

    // Send message
    const sendMessage = async (text) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        setInput('');
        if (inputRef.current) inputRef.current.style.height = 'auto';

        let conv = conversation;

        // Create conversation if none exists
        if (!conv) {
            conv = await createConversation();
        }

        // Add user message locally
        const userMsg = { role: 'user', content: messageText, id: Date.now() };
        setMessages(prev => [...prev, userMsg]);

        // Add placeholder for AI response
        const aiMsgId = Date.now() + 1;
        const aiMsg = { role: 'assistant', content: '', id: aiMsgId, model: selectedModel, isStreaming: true };
        setMessages(prev => [...prev, aiMsg]);

        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: conv.id,
                    message: messageText,
                    model: selectedModel,
                }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.type === 'chunk') {
                                setMessages(prev =>
                                    prev.map(m =>
                                        m.id === aiMsgId
                                            ? { ...m, content: m.content + data.content }
                                            : m
                                    )
                                );
                            } else if (data.type === 'title') {
                                setActiveConversation(prev => ({ ...prev, title: data.content }));
                                onConversationUpdate();
                            } else if (data.type === 'done') {
                                setMessages(prev =>
                                    prev.map(m =>
                                        m.id === aiMsgId
                                            ? { ...m, isStreaming: false, model: data.model }
                                            : m
                                    )
                                );
                            }
                        } catch (e) {
                            // Ignore parse errors
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev =>
                prev.map(m =>
                    m.id === aiMsgId
                        ? { ...m, content: 'Error: Failed to get response. Please try again.', isStreaming: false }
                        : m
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-page">
            {/* Header */}
            <header className="chat-header">
                <div className="chat-header-left">
                    <button className="hamburger-btn" onClick={onToggleSidebar}>
                        {sidebarOpen ? '☰' : '☰'}
                    </button>
                    <span className="chat-title">
                        {conversation?.title || 'AJ11'}
                    </span>
                </div>
                <ModelSelector
                    models={models}
                    selectedModel={selectedModel}
                    onChange={onModelChange}
                />
            </header>

            {/* Messages */}
            <div className="messages-area">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-logo">🤖</div>
                        <h2>Welcome to AJ11</h2>
                        <p>
                            Your AI-powered assistant. Choose a model and start chatting.
                            Powered by Gemini & Groq.
                        </p>
                        <div className="suggestion-chips">
                            {SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    className="suggestion-chip"
                                    onClick={() => sendMessage(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, i) => (
                            <MessageBubble key={msg.id || i} message={msg} />
                        ))}
                        {isLoading && messages[messages.length - 1]?.role === 'assistant' && messages[messages.length - 1]?.content === '' && (
                            <div className="message-wrapper assistant">
                                <div className="message-avatar ai-avatar">AJ</div>
                                <div className="message-content">
                                    <div className="message-bubble">
                                        <div className="loading-dots">
                                            <span /><span /><span />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
                <div className="chat-input-wrapper">
                    <div className="chat-input-container">
                        <textarea
                            ref={inputRef}
                            className="chat-input"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Message AJ11..."
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            className="send-btn"
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isLoading}
                        >
                            ↑
                        </button>
                    </div>
                    <div className="chat-disclaimer">
                        AJ11 can make mistakes. Verify important information.
                    </div>
                </div>
            </div>
        </div>
    );
}
