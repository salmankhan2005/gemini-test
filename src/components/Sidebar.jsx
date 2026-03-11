import { useState } from 'react';

export default function Sidebar({
    conversations,
    activeConversation,
    onSelect,
    onNew,
    onRename,
    onDelete,
    isOpen,
    onToggle,
    onLogout,
}) {
    const [renamingId, setRenamingId] = useState(null);
    const [renameValue, setRenameValue] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const handleRenameStart = (conv) => {
        setRenamingId(conv.id);
        setRenameValue(conv.title);
    };

    const handleRenameSubmit = (id) => {
        if (renameValue.trim()) {
            onRename(id, renameValue.trim());
        }
        setRenamingId(null);
    };

    const handleDeleteConfirm = (id) => {
        onDelete(id);
        setDeletingId(null);
    };

    // Group conversations by time
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = { today: [], yesterday: [], thisWeek: [], older: [] };
    conversations.forEach(conv => {
        const d = new Date(conv.updatedAt || conv.createdAt);
        if (d.toDateString() === today.toDateString()) groups.today.push(conv);
        else if (d.toDateString() === yesterday.toDateString()) groups.yesterday.push(conv);
        else if (d > weekAgo) groups.thisWeek.push(conv);
        else groups.older.push(conv);
    });

    const renderConv = (conv) => (
        <div
            key={conv.id}
            className={`conv-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
            onClick={() => { onSelect(conv); setDeletingId(null); setRenamingId(null); }}
        >
            <div className="conv-icon">💬</div>

            {renamingId === conv.id ? (
                <input
                    className="conv-rename-input"
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleRenameSubmit(conv.id);
                        if (e.key === 'Escape') setRenamingId(null);
                    }}
                    onBlur={() => handleRenameSubmit(conv.id)}
                    onClick={e => e.stopPropagation()}
                    autoFocus
                />
            ) : (
                <span className="conv-title">{conv.title}</span>
            )}

            {deletingId === conv.id ? (
                <div className="delete-confirm" onClick={e => e.stopPropagation()}>
                    <button className="delete-confirm-btn yes" onClick={() => handleDeleteConfirm(conv.id)}>
                        Delete
                    </button>
                    <button className="delete-confirm-btn no" onClick={() => setDeletingId(null)}>
                        Cancel
                    </button>
                </div>
            ) : renamingId !== conv.id ? (
                <div className="conv-actions">
                    <button
                        className="conv-action-btn"
                        onClick={e => { e.stopPropagation(); handleRenameStart(conv); }}
                        title="Rename"
                    >
                        ✏️
                    </button>
                    <button
                        className="conv-action-btn delete"
                        onClick={e => { e.stopPropagation(); setDeletingId(conv.id); }}
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>
            ) : null}
        </div>
    );

    const renderGroup = (label, items) => {
        if (items.length === 0) return null;
        return (
            <div key={label}>
                <div className="sidebar-history-label">{label}</div>
                {items.map(renderConv)}
            </div>
        );
    };

    return (
        <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon">AJ</div>
                    <span className="logo-text">AJ11</span>
                </div>
                <button className="sidebar-close-btn" onClick={onToggle}>✕</button>
            </div>

            <button className="new-chat-btn" onClick={onNew}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Chat
            </button>

            <div className="sidebar-conversations">
                {conversations.length === 0 ? (
                    <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                        No conversations yet.<br />Start a new chat!
                    </div>
                ) : (
                    <>
                        {renderGroup('Today', groups.today)}
                        {renderGroup('Yesterday', groups.yesterday)}
                        {renderGroup('This Week', groups.thisWeek)}
                        {renderGroup('Older', groups.older)}
                    </>
                )}
            </div>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={onLogout} title="Return to Landing Page">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
