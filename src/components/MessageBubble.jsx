import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MessageBubble({ message }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(message.content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [message.content]);

    const isUser = message.role === 'user';
    const provider = message.model?.includes('llama') ? 'groq' : 'gemini';

    // Find display name for the model
    const modelDisplayName = message.model
        ? message.model
            .replace('gemini-', 'Gemini ')
            .replace('llama-', 'Llama ')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())
        : '';

    return (
        <div className={`message-wrapper ${message.role}`}>
            <div className={`message-avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`}>
                {isUser ? 'U' : 'AJ'}
            </div>
            <div className="message-content">
                <div className={`message-bubble ${message.isStreaming ? 'streaming-cursor' : ''}`}>
                    {isUser ? (
                        message.content
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                pre({ children, ...props }) {
                                    return <CodeBlock {...props}>{children}</CodeBlock>;
                                },
                                code({ inline, children, ...props }) {
                                    if (inline) {
                                        return <code {...props}>{children}</code>;
                                    }
                                    return <code {...props}>{children}</code>;
                                },
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>

                {/* Footer with copy button + model badge for assistant messages */}
                {!isUser && message.content && !message.isStreaming && (
                    <div className="message-footer">
                        <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                            {copied ? '✓ Copied' : '📋 Copy'}
                        </button>
                        {message.model && (
                            <span className="model-badge">
                                <span className={`badge-dot ${provider}`} />
                                {modelDisplayName}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function CodeBlock({ children, ...props }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = extractText(children);
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="code-block-wrapper">
            <button className="code-copy-btn" onClick={handleCopy}>
                {copied ? '✓ Copied' : 'Copy'}
            </button>
            <pre {...props}>{children}</pre>
        </div>
    );
}

function extractText(node) {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node?.props?.children) return extractText(node.props.children);
    return '';
}
