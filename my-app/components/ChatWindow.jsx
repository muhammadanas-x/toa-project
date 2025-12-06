'use client'

import React, { useState, useRef, useEffect } from 'react';

// Helper function to format message content with basic LaTeX rendering
const formatMessage = (content) => {
  if (!content) return '';
  
  // Replace display math \[ ... \] with styled div
  content = content.replace(/\\\[(.*?)\\\]/gs, (match, math) => {
    return `<div style="text-align: center; margin: 16px 0; font-size: 1.1em; font-style: italic; color: #1a1a1a; padding: 12px; background: #f5f5f5; border-radius: 8px; border-left: 4px solid #10a37f;">${math}</div>`;
  });
  
  // Replace inline math \( ... \) with styled span
  content = content.replace(/\\\((.*?)\\\)/g, (match, math) => {
    return `<span style="font-style: italic; color: #1a1a1a; padding: 2px 6px; background: #f0f0f0; border-radius: 4px; font-family: 'Times New Roman', serif;">${math}</span>`;
  });
  
  // Handle **bold** text
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700; color: #1a1a1a;">$1</strong>');
  
  // Handle markdown headers
  content = content.replace(/^### (.+)$/gm, '<h3 style="font-size: 1.2em; font-weight: 700; margin: 16px 0 8px 0; color: #10a37f;">$1</h3>');
  content = content.replace(/^## (.+)$/gm, '<h2 style="font-size: 1.4em; font-weight: 700; margin: 20px 0 10px 0; color: #10a37f;">$1</h2>');
  
  // Handle code blocks
  content = content.replace(/```python\n([\s\S]*?)```/g, '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 12px 0;"><code>$1</code></pre>');
  content = content.replace(/```\n([\s\S]*?)```/g, '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 12px 0;"><code>$1</code></pre>');
  
  // Handle inline code
  content = content.replace(/`([^`]+)`/g, '<code style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>');
  
  // Handle lists
  content = content.replace(/^\d+\.\s+\*\*(.*?)\*\*$/gm, '<div style="margin: 8px 0;"><strong style="color: #10a37f;">$1</strong></div>');
  
  // Handle line breaks
  content = content.replace(/\n/g, '<br/>');
  
  return content;
};

export default function ChatWindow({ messages, onSendMessage, currentUserRequest, isTyping }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={styles.chatWindow}>
      {/* Messages Area */}
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🤖</div>
            <h2 style={styles.emptyTitle}>Start a Conversation</h2>
            <p style={styles.emptyDescription}>
              Ask anything about mathematics, visualizations, or animations
            </p>
            <div style={styles.suggestions}>
              <button style={styles.suggestionChip}>Explain calculus concepts</button>
              <button style={styles.suggestionChip}>Create 3D visualization</button>
              <button style={styles.suggestionChip}>Show me linear algebra</button>
              <button style={styles.suggestionChip}>Generate animation</button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {message.role === 'assistant' && (
                  <div style={styles.avatarAssistant}>🤖</div>
                )}
                <div
                  style={{
                    ...styles.message,
                    background: message.role === 'user'
                      ? '#f9f9f9'
                      : 'transparent',
                    maxWidth: '800px',
                  }}
                >
                  <div 
                    style={styles.messageContent}
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                  
                  {/* Video Player */}
                  {message.video_url && (
                    <div style={styles.videoContainer}>
                      <video
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={styles.video}
                        src={message.video_url}
                        onError={(e) => {
                          console.error('Video error:', e);
                          console.log('Video URL:', message.video_url);
                        }}
                        onLoadStart={() => console.log('Video loading started')}
                        onCanPlay={() => console.log('Video can play')}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                  
                  <div style={styles.messageTime}>{message.timestamp}</div>
                </div>
                {message.role === 'user' && (
                  <div style={styles.avatarUser}>👤</div>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={styles.messageWrapper}>
                <div style={styles.avatarAssistant}>🤖</div>
                <div style={styles.typingIndicator}>
                  <span style={styles.typingDot}></span>
                  <span style={styles.typingDot}></span>
                  <span style={styles.typingDot}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div style={styles.inputContainer}>
        <form onSubmit={handleSubmit} style={styles.inputForm}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            style={styles.input}
            rows={1}
          />
          <button
            type="submit"
            style={{
              ...styles.sendButton,
              opacity: input.trim() ? 1 : 0.5,
            }}
            disabled={!input.trim()}
          >
            ▲
          </button>
        </form>
        <div style={styles.inputFooter}>
          <span style={styles.footerText}>
            Press Enter to send • Shift+Enter for new line
          </span>
        </div>
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-10px); opacity: 1; }
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        textarea:focus {
          outline: none;
          border-color: #10a37f !important;
          box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 163, 127, 0.4) !important;
        }

        button:active:not(:disabled) {
          transform: translateY(0);
        }

        .suggestionChip:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          border-color: #10a37f !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  chatWindow: {
    flex: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
    position: 'relative',
  },

  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    padding: '40px',
  },

  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '16px',
  },

  emptyTitle: {
    fontSize: '1.75rem',
    background: 'linear-gradient(135deg, #10a37f 0%, #059669 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: '700',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },

  emptyDescription: {
    fontSize: '1.05rem',
    color: '#6b7280',
    marginBottom: '28px',
    fontWeight: '400',
  },

  suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    maxWidth: '600px',
  },

  suggestionChip: {
    padding: '10px 18px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
    color: '#202123',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },

  messageWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    maxWidth: '100%',
  },

  avatarAssistant: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10a37f 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(16, 163, 127, 0.25)',
  },

  avatarUser: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
  },

  message: {
    padding: '14px 18px',
    borderRadius: '14px',
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: '#202123',
    border: '1px solid transparent',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
  },

  messageContent: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontWeight: '400',
  },

  renderButton: {
    marginTop: '12px',
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #10a37f 0%, #059669 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(16, 163, 127, 0.3)',
  },

  videoContainer: {
    marginTop: '12px',
    width: '100%',
    maxWidth: '600px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '3px solid transparent',
    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #10a37f 0%, #059669 100%)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: '0 4px 16px rgba(16, 163, 127, 0.2)',
  },

  video: {
    width: '100%',
    height: 'auto',
    display: 'block',
    background: '#000',
  },

  messageTime: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '4px',
  },

  typingIndicator: {
    padding: '12px 16px',
    background: '#f9f9f9',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
  },

  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10a37f',
    display: 'inline-block',
    animation: 'typingDot 1.4s infinite ease-in-out',
  },

  inputContainer: {
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderTop: '1px solid #e5e5e5',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)',
  },

  inputForm: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
    maxWidth: '900px',
    margin: '0 auto',
  },

  input: {
    flex: 1,
    padding: '14px 18px',
    background: '#fff',
    border: '1.5px solid #d1d5db',
    borderRadius: '12px',
    color: '#202123',
    fontSize: '1rem',
    resize: 'none',
    minHeight: '50px',
    maxHeight: '150px',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },

  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #10a37f 0%, #059669 100%)',
    color: '#fff',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(16, 163, 127, 0.3)',
  },

  inputFooter: {
    marginTop: '8px',
    textAlign: 'center',
  },

  footerText: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
};
