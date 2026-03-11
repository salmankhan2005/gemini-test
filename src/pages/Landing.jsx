import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Landing({ onEnterChat }) {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);
    const orbRef = useRef(null);
    const statsRef = useRef(null);
    const featuresRef = useRef(null);
    const worksRef = useRef(null);
    const useCasesRef = useRef(null);
    const showcaseRef = useRef(null);
    const compareRef = useRef(null);
    const testimonialsRef = useRef(null);
    const faqRef = useRef(null);
    const finalCtaRef = useRef(null);
    const navRef = useRef(null);

    const [activeFaq, setActiveFaq] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ── Nav entrance ──
            gsap.from(navRef.current, {
                y: -60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.2,
            });

            // ── Hero timeline ──
            const heroTl = gsap.timeline({ delay: 0.5 });

            heroTl
                .fromTo(titleRef.current.children,
                    { y: 80, opacity: 0, filter: 'blur(12px)', scale: 0.95 },
                    { y: 0, opacity: 1, filter: 'blur(0px)', scale: 1, stagger: 0.15, duration: 1.4, ease: 'power3.out' }
                )
                .fromTo(subtitleRef.current,
                    { y: 40, opacity: 0, filter: 'blur(8px)' },
                    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
                    '-=0.8'
                )
                .fromTo(ctaRef.current.children,
                    { y: 30, opacity: 0, scale: 0.9 },
                    { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
                    '-=0.6'
                )
                .fromTo(orbRef.current,
                    { x: 150, y: 50, opacity: 0, rotationY: -30, rotationX: 20 },
                    { x: 0, y: 0, opacity: 1, rotationY: -15, rotationX: 10, duration: 1.8, ease: 'expo.out' },
                    '-=1.2'
                );

            // ── Particles continuous animation ──
            document.querySelectorAll('.landing-particle').forEach((p, i) => {
                gsap.to(p, {
                    y: `random(-60, 60)`,
                    x: `random(-40, 40)`,
                    duration: `random(3, 6)`,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: i * 0.2,
                });
            });

            // ── Stats Reveal ──
            gsap.fromTo('.stat-item',
                { y: 40, opacity: 0 },
                { scrollTrigger: { trigger: statsRef.current, start: 'top 85%' }, y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
            );

            // ── Regular Sections fade/slide in ──
            const sections = [
                { ref: featuresRef, target: '.feature-card-landing', y: 80 },
                { ref: worksRef, target: '.work-step', y: 60 },
                { ref: useCasesRef, target: '.use-case-card', y: 50 },
                { ref: testimonialsRef, target: '.testimonial-card', y: 60 },
                { ref: faqRef, target: '.faq-item', y: 40 }
            ];

            sections.forEach(({ ref, target, y }) => {
                // Animate Section Title
                gsap.fromTo(ref.current.querySelector('.landing-section-title'),
                    { y: 40, opacity: 0 },
                    { scrollTrigger: { trigger: ref.current, start: 'top 85%' }, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
                );

                // Animate Section Grid Items
                gsap.fromTo(ref.current.querySelectorAll(target),
                    { y: y, opacity: 0 },
                    { scrollTrigger: { trigger: ref.current, start: 'top 80%' }, y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
                );
            });

            // ── Comparison Table ──
            gsap.fromTo(compareRef.current.querySelector('.compare-table-wrapper'),
                { y: 60, opacity: 0 },
                { scrollTrigger: { trigger: compareRef.current, start: 'top 80%' }, y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
            );

            // ── Showcase section parallax ──
            gsap.fromTo('.showcase-visual',
                { x: 100, opacity: 0 },
                { scrollTrigger: { trigger: showcaseRef.current, start: 'top 80%', end: 'center center', scrub: 1 }, x: 0, opacity: 1 }
            );

            gsap.fromTo('.showcase-text',
                { x: -100, opacity: 0 },
                { scrollTrigger: { trigger: showcaseRef.current, start: 'top 80%', end: 'center center', scrub: 1 }, x: 0, opacity: 1 }
            );

            // ── Final CTA cinematic reveal ──
            gsap.fromTo(finalCtaRef.current.querySelector('.final-cta-inner'),
                { scale: 0.8, opacity: 0 },
                { scrollTrigger: { trigger: finalCtaRef.current, start: 'top 85%' }, scale: 1, opacity: 1, duration: 1.2, ease: 'power4.out' }
            );

            // ── Parallax on hero scrolling ──
            gsap.to(heroRef.current, {
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
                y: 150, opacity: 0.3, filter: 'blur(10px)'
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    return (
        <div className="landing-page" ref={containerRef}>
            {/* ── Navbar ── */}
            <nav className="landing-nav" ref={navRef}>
                <div className="landing-nav-inner">
                    <div className="landing-brand">
                        <div className="landing-logo-icon">AJ</div>
                        <span className="landing-logo-text">AJ11</span>
                    </div>
                    <div className="landing-nav-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How It Works</a>
                        <a href="#compare">Compare</a>
                        <a href="#faq">FAQ</a>
                        <button className="landing-nav-cta" onClick={onEnterChat}>
                            <span className="cta-dot" />
                            Start Chatting
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <section className="landing-hero" ref={heroRef}>
                <div className="landing-particles">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="landing-particle" style={{
                            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`,
                            animationDelay: `${Math.random() * 5}s`, opacity: Math.random() * 0.5 + 0.2,
                        }} />
                    ))}
                </div>
                <div className="landing-grid-overlay" />

                <div className="landing-hero-content">
                    <div className="landing-hero-text">
                        <h1 ref={titleRef}>
                            <span className="title-line">The Smartest</span>
                            <span className="title-line gradient-text">AI Assistant</span>
                            <span className="title-line">Ready to Chat.</span>
                        </h1>
                        <p className="landing-subtitle" ref={subtitleRef}>
                            Experience next-gen AI conversations powered by Gemini & Groq.
                            Switch between 11 cutting-edge models in real-time with zero latency.
                        </p>
                        <div className="landing-cta-group" ref={ctaRef}>
                            <button className="landing-btn-primary" onClick={onEnterChat}>
                                <span className="btn-glow" />
                                Launch AJ11
                                <span className="btn-arrow">→</span>
                            </button>
                            <a href="#features" className="landing-btn-secondary">
                                Explore Features
                                <span className="btn-chevron">↓</span>
                            </a>
                        </div>
                    </div>

                    <div className="landing-orb-container" ref={orbRef}>
                        <div className="hero-mockup-card">
                            <div className="hmc-header">
                                <span className="hmc-dot r" />
                                <span className="hmc-dot y" />
                                <span className="hmc-dot g" />
                            </div>
                            <div className="hmc-body">
                                <div className="hmc-line w-60" />
                                <div className="hmc-line w-80" />
                                <div className="hmc-message">
                                    <div className="hmc-avatar" />
                                    <div className="hmc-text">
                                        <div className="hmc-line w-100" />
                                        <div className="hmc-line w-40" />
                                    </div>
                                </div>
                                <div className="hmc-badge">
                                    <span className="hmc-icon">✧</span>
                                    <span>AI Generating...</span>
                                </div>
                            </div>
                            <div className="hmc-float-element f1">Llama 3.3</div>
                            <div className="hmc-float-element f2">Gemini 2.0</div>
                            <div className="hmc-float-element f3">Groq Fast</div>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <div className="scroll-mouse"><div className="scroll-wheel" /></div>
                    <span>Scroll to explore</span>
                </div>
            </section>

            {/* ── Stats Band ── */}
            <section className="landing-stats" ref={statsRef}>
                <div className="landing-section-inner stats-inner">
                    <div className="stat-item">
                        <h3 className="gradient-text">11</h3>
                        <p>World-Class Models</p>
                    </div>
                    <div className="stat-item">
                        <h3 className="gradient-text">&lt;1s</h3>
                        <p>Time to First Token</p>
                    </div>
                    <div className="stat-item">
                        <h3 className="gradient-text">100%</h3>
                        <p>Privacy Focused</p>
                    </div>
                    <div className="stat-item">
                        <h3 className="gradient-text">∞</h3>
                        <p>Chat History</p>
                    </div>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section className="landing-section dark" id="features" ref={featuresRef}>
                <div className="landing-section-inner">
                    <div className="landing-section-title">
                        <span className="section-label">Features</span>
                        <h2>Why AJ11 is <span className="gradient-text">Different</span></h2>
                        <p>We built this from the ground up to be the ultimate AI interface.</p>
                    </div>
                    <div className="features-grid-landing">
                        {[
                            { icon: '🔄', title: 'Multi-Model Switching', desc: 'Seamlessly switch between 11 state-of-the-art AI models instantly. Choose from Gemini 3.1 Pro, Llama 3.3 70B, and more without reloading the interface.' },
                            { icon: '⚡', title: 'Real-Time Streaming', desc: 'Experience lightning-fast token generation. Responses stream in real-time using Server-Sent Events for a zero-latency conversational feel.' },
                            { icon: '📋', title: 'One-Click Copy & Export', desc: 'Easily grab code snippets or entire responses with a single click. Model badges ensure you always know which AI generated the content you are copying.' },
                            { icon: '💾', title: 'Persistent DB History', desc: 'Never lose a conversation. Your chat history is securely and durably saved in the cloud via Neon Serverless Postgres and Drizzle ORM.' },
                            { icon: '🎨', title: 'Rich Markdown Rendering', desc: 'Code blocks feature full syntax highlighting and copy buttons. Tables, lists, and text formatting are beautifully rendered for maximum readability.' },
                            { icon: '📱', title: 'Desktop & Mobile Sync', desc: 'A fluid, fully responsive layout. Whether you are on a 4K monitor or a smartphone, the interface adapts perfectly to your screen constraints.' },
                            { icon: '�', title: 'Full API Key Control', desc: 'Your prompts and API keys remain strictly under your control. Supply your own Gemini and Groq tokens and never worry about centralized limits.' },
                            { icon: '🧠', title: 'Context-Aware Memory', desc: 'The chat engine automatically tracks conversation history and handles payload construction so the LLM always understands your follow-up context.' },
                            { icon: '🚀', title: 'Instant Cold Starts', desc: 'Architected for edge deployments. The lightweight React and Express stack guarantees nearly instantaneous load times, so you can start working faster.' }
                        ].map((f, i) => (
                            <div key={i} className="feature-card-landing">
                                <div className="feature-icon-landing">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="landing-section highlight" id="how-it-works" ref={worksRef}>
                <div className="landing-section-inner">
                    <div className="landing-section-title">
                        <span className="section-label">Architecture</span>
                        <h2>How It <span className="gradient-text">Works</span></h2>
                        <p>A lightning fast modern stack built for scale.</p>
                    </div>
                    <div className="works-grid">
                        <div className="work-step">
                            <div className="work-step-icon">⚛️</div>
                            <div className="work-number">1</div>
                            <h3>React + Vite UI</h3>
                            <p>Experience a buttery smooth React frontend, styled with modern CSS for maximum performance. GSAP animations bring the interface to life, while Vite ensures lightning-fast HMR and optimized production builds for an unparalleled user experience.</p>
                        </div>
                        <div className="work-step">
                            <div className="work-step-icon">⚙️</div>
                            <div className="work-number">2</div>
                            <h3>Express Backend</h3>
                            <p>A robust, scalable Node.js/Express API layer manages secure routing, rate-limiting, and payload sanitization. It acts as the intelligent middleware orchestrating complex multi-model requests seamlessly.</p>
                        </div>
                        <div className="work-step">
                            <div className="work-step-icon">🧠</div>
                            <div className="work-number">3</div>
                            <h3>Dual API Engine</h3>
                            <p>AJ11 natively integrates with both the Google Gemini SDK (for deep reasoning tasks via Gemini 3.1 Pro/Flash) and Groq Cloud SDK (delivering Llama 3.3 70B inferences at speeds exceeding 800 tokens per second).</p>
                        </div>
                        <div className="work-step">
                            <div className="work-step-icon">🗄️</div>
                            <div className="work-number">4</div>
                            <h3>Postgres + Drizzle</h3>
                            <p>Every token and conversation state is durably, securely, and instantly saved to the cloud using Neon Serverless Postgres. Drizzle ORM ensures type-safe database mutations and high-performance querying.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Use Cases ── */}
            <section className="landing-section dark" ref={useCasesRef}>
                <div className="landing-section-inner">
                    <div className="landing-section-title">
                        <span className="section-label">Tailored For You</span>
                        <h2>Built for <span className="gradient-text">Professionals</span></h2>
                    </div>
                    <div className="use-cases-grid">
                        <div className="use-case-card">
                            <div className="uc-img devs">
                                <div className="uc-mock-ui code">
                                    <div className="mock-dot-group"><span /><span /><span /></div>
                                    <div className="mock-code-line w-80" />
                                    <div className="mock-code-line w-60 ind-1" />
                                    <div className="mock-code-line w-40 ind-1" />
                                    <div className="mock-code-line w-20 ind-2" />
                                    <div className="mock-code-line w-40 ind-1" />
                                    <div className="mock-code-line w-60" />
                                </div>
                            </div>
                            <div className="uc-content">
                                <h3>For Developers 💻</h3>
                                <p>Tackle complex architectural problems with Gemini 3.1 Pro's deep reasoning capabilities, or switch to Llama 3.3 70B via Groq for lightning-fast boilerplate generation and syntax checking. Copy exact code blocks instantly and seamlessly transition between workflows.</p>
                            </div>
                        </div>
                        <div className="use-case-card">
                            <div className="uc-img writers">
                                <div className="uc-mock-ui text">
                                    <div className="mock-text-title w-60" />
                                    <div className="mock-text-line w-100" />
                                    <div className="mock-text-line w-100" />
                                    <div className="mock-text-line w-80" />
                                    <div className="mock-text-br" />
                                    <div className="mock-text-line w-100" />
                                    <div className="mock-text-line w-60" />
                                </div>
                            </div>
                            <div className="uc-content">
                                <h3>For Writers ✍️</h3>
                                <p>Iterate on copy, blog posts, and marketing materials quickly. If one model's tone isn't quite right, you can instantaneously swap to another model and retry the exact same prompt to find the perfect voice, all while keeping your generated history intact.</p>
                            </div>
                        </div>
                        <div className="use-case-card">
                            <div className="uc-img students">
                                <div className="uc-mock-ui data">
                                    <div className="mock-graph">
                                        <div className="bar h-40" />
                                        <div className="bar h-80" />
                                        <div className="bar h-60" />
                                        <div className="bar h-100" />
                                        <div className="bar h-30" />
                                    </div>
                                    <div className="mock-data-lines">
                                        <div className="mock-text-line w-100" />
                                        <div className="mock-text-line w-40" />
                                    </div>
                                </div>
                            </div>
                            <div className="uc-content">
                                <h3>For Researchers 📚</h3>
                                <p>Use the persistent history as your personal second brain. Effortlessly reference past deep-dives into complex topics like quantum entanglement, organize chats by subject, and cross-reference answers from different AI models to ensure factual accuracy.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Showcase / Demo Section ── */}
            <section className="landing-showcase" id="showcase" ref={showcaseRef}>
                <div className="landing-section-inner showcase-inner">
                    <div className="showcase-text">
                        <span className="section-label">Preview</span>
                        <h2>Meet Your <span className="gradient-text">New UI</span></h2>
                        <p>We analyzed the best chat interfaces on the market and combined their best pieces into one beautiful dashboard.</p>
                        <ul className="showcase-list">
                            <li>✓ Dark Teal Cinematic Theme</li>
                            <li>✓ Auto-titled Conversations</li>
                            <li>✓ Model Indicator Badges</li>
                        </ul>
                    </div>
                    <div className="showcase-visual">
                        <div className="showcase-mockup">
                            <div className="mockup-header">
                                <div className="mockup-dots"><span /><span /><span /></div>
                                <span className="mockup-title">AJ11 Chat</span>
                            </div>
                            <div className="mockup-body">
                                <div className="mockup-msg user"><p>Write a React Hook</p></div>
                                <div className="mockup-msg ai">
                                    <p>Here is a custom `useFetch` hook in React...</p>
                                    <div className="mockup-badge"><span className="badge-dot-mock gem" /> Gemini 2.0</div>
                                </div>
                                <div className="mockup-typing"><span /><span /><span /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Comparison Table ── */}
            <section className="landing-section dark" id="compare" ref={compareRef}>
                <div className="landing-section-inner">
                    <div className="landing-section-title">
                        <span className="section-label">Compare</span>
                        <h2>AJ11 vs <span className="gradient-text">The Rest</span></h2>
                    </div>
                    <div className="compare-table-wrapper">
                        <table className="compare-table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>AJ11 Chatbot</th>
                                    <th>Standard ChatGPT</th>
                                    <th>Standard Gemini</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Models Available</td>
                                    <td className="highlight-cell">11 (Gemini + Groq)</td>
                                    <td>OpenAI Only</td>
                                    <td>Google Only</td>
                                </tr>
                                <tr>
                                    <td>In-Chat Model Switching</td>
                                    <td className="highlight-cell">✅ Instant</td>
                                    <td>✅ Yes</td>
                                    <td>❌ Hard API Limit</td>
                                </tr>
                                <tr>
                                    <td>Model Indicator Badges</td>
                                    <td className="highlight-cell">✅ Per Message</td>
                                    <td>❌ Global Only</td>
                                    <td>❌ Global Only</td>
                                </tr>
                                <tr>
                                    <td>Llama 3.3 70B Access</td>
                                    <td className="highlight-cell">✅ Included</td>
                                    <td>❌ No</td>
                                    <td>❌ No</td>
                                </tr>
                                <tr>
                                    <td>Cost</td>
                                    <td className="highlight-cell">Open Source Free</td>
                                    <td>$20/mo</td>
                                    <td>$20/mo</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="landing-section highlight" ref={testimonialsRef}>
                <div className="landing-section-inner">
                    <div className="landing-section-title">
                        <span className="section-label">Wall of Love</span>
                        <h2>What <span className="gradient-text">Developers Say</span></h2>
                    </div>
                    <div className="testimonials-grid">
                        {[
                            { name: "Sarah J.", role: "Frontend Dev", text: "The ability to switch from Gemini to Llama instantly without losing chat context is a game changer for my workflow." },
                            { name: "Mike T.", role: "Data Scientist", text: "AJ11's dark teal UI is gorgeous. Actually better looking than the official wrappers. And the SSE streaming is incredibly fast." },
                            { name: "Elena R.", role: "Tech Lead", text: "We dumped our pricey subscriptions. Hosting this open source wrapper with Groq API keys saves us thousands." }
                        ].map((t, i) => (
                            <div key={i} className="testimonial-card">
                                <div className="test-stars">★★★★★</div>
                                <p>"{t.text}"</p>
                                <div className="test-author">
                                    <div className="test-avatar" />
                                    <div>
                                        <h4>{t.name}</h4>
                                        <span>{t.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ Section ── */}
            <section className="landing-section dark" id="faq" ref={faqRef}>
                <div className="landing-section-inner faq-inner">
                    <div className="landing-section-title">
                        <span className="section-label">FAQ</span>
                        <h2>Common <span className="gradient-text">Questions</span></h2>
                    </div>
                    <div className="faq-list">
                        {[
                            { q: "Is AJ11 free to use?", a: "Yes, AJ11 is an entirely open-source wrapper. You just need to supply your own API keys for Gemini and Groq." },
                            { q: "How are my chats saved?", a: "Chats are persistently stored using Neon Serverless Postgres and Drizzle ORM. They are tied to your local instance." },
                            { q: "Why use Groq?", a: "Groq's LPUs (Language Processing Units) serve Llama models at incredible speeds, often exceeding 800 tokens per second." },
                            { q: "Can I deploy this to Vercel?", a: "Yes, the React frontend and Express backend can be containerized or adapted for serverless Vercel deployment easily." },
                        ].map((faq, i) => (
                            <div key={i} className={`faq-item ${activeFaq === i ? 'active' : ''}`} onClick={() => toggleFaq(i)}>
                                <div className="faq-question">
                                    <h3>{faq.q}</h3>
                                    <span className="chevron">↓</span>
                                </div>
                                <div className="faq-answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="landing-final-cta" ref={finalCtaRef}>
                <div className="final-cta-bg" />
                <div className="landing-section-inner final-cta-inner">
                    <h2>Ready to experience<br /><span className="gradient-text">the future of AI?</span></h2>
                    <p>Start chatting with 11 AI models right now. No signup required.</p>
                    <button className="landing-btn-primary large" onClick={onEnterChat}>
                        <span className="btn-glow" />
                        Launch AJ11 Now
                        <span className="btn-arrow">→</span>
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <div className="landing-section-inner footer-inner">
                    <div className="footer-brand">
                        <div className="landing-logo-icon">AJ</div>
                        <span className="landing-logo-text">AJ11 — Full Stack LLM Wrapper</span>
                    </div>
                    <div className="footer-links">
                        <a href="#">Github</a>
                        <a href="#">Twitter</a>
                        <a href="#">Documentation</a>
                    </div>
                    <p>© 2026 AJ11 Built by AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
