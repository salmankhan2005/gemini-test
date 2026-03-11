import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './pages/Chat';
import Landing from './pages/Landing';
import './landing.css';

export default function App() {
    const [page, setPage] = useState('landing'); // 'landing' or 'chat'
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('gemini-3.1-pro-preview');

    // Fetch models
    useEffect(() => {
        fetch('/api/models')
            .then(r => r.json())
            .then(setModels)
            .catch(console.error);
    }, []);

    // Fetch conversations
    const fetchConversations = useCallback(() => {
        fetch('/api/conversations')
            .then(r => r.json())
            .then(setConversations)
            .catch(console.error);
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Create new conversation
    const createConversation = async () => {
        const res = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'New Chat' }),
        });
        const conv = await res.json();
        setConversations(prev => [conv, ...prev]);
        setActiveConversation(conv);
        return conv;
    };

    // Rename conversation
    const renameConversation = async (id, title) => {
        await fetch(`/api/conversations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, title } : c))
        );
        if (activeConversation?.id === id) {
            setActiveConversation(prev => ({ ...prev, title }));
        }
    };

    // Delete conversation
    const deleteConversation = async (id) => {
        await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConversation?.id === id) {
            setActiveConversation(null);
        }
    };

    // Enter chat mode from landing page
    const handleEnterChat = () => {
        setPage('chat');
    };

    if (page === 'landing') {
        return <Landing onEnterChat={handleEnterChat} />;
    }

    return (
        <div className="app-container">
            <Sidebar
                conversations={conversations}
                activeConversation={activeConversation}
                onSelect={setActiveConversation}
                onNew={createConversation}
                onRename={renameConversation}
                onDelete={deleteConversation}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                onLogout={() => setPage('landing')}
            />
            <main className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
                <Chat
                    conversation={activeConversation}
                    setActiveConversation={setActiveConversation}
                    createConversation={createConversation}
                    models={models}
                    selectedModel={selectedModel}
                    onModelChange={setSelectedModel}
                    onConversationUpdate={fetchConversations}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />
            </main>
        </div>
    );
}
