import { useState, useRef, useEffect } from 'react';

export default function ModelSelector({ models, selectedModel, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const selectedInfo = models.find(m => m.id === selectedModel);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Group models by provider
    const geminiModels = models.filter(m => m.provider === 'gemini');
    const groqModels = models.filter(m => m.provider === 'groq');

    return (
        <div className="model-selector" ref={ref}>
            <button className="model-selector-btn" onClick={() => setIsOpen(!isOpen)}>
                <span className="model-dot" />
                <span className="model-name-text">{selectedInfo?.name || 'Select Model'}</span>
                <span className={`chevron ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="model-dropdown">
                    <div className="model-dropdown-header">Gemini Models</div>
                    <div className="model-dropdown-list">
                        {geminiModels.map(m => (
                            <button
                                key={m.id}
                                className={`model-option ${selectedModel === m.id ? 'active' : ''}`}
                                onClick={() => { onChange(m.id); setIsOpen(false); }}
                            >
                                <span className="option-dot gemini" />
                                <span className="option-name">{m.name}</span>
                                {selectedModel === m.id && <span className="option-check">✓</span>}
                            </button>
                        ))}
                    </div>

                    <div className="model-dropdown-header">Groq Models</div>
                    <div className="model-dropdown-list">
                        {groqModels.map(m => (
                            <button
                                key={m.id}
                                className={`model-option ${selectedModel === m.id ? 'active' : ''}`}
                                onClick={() => { onChange(m.id); setIsOpen(false); }}
                            >
                                <span className="option-dot groq" />
                                <span className="option-name">{m.name}</span>
                                {selectedModel === m.id && <span className="option-check">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
