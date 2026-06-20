// ecommerce/frontend/src/components/ai/CustomerSupportChatbot.jsx

import React, { useState, useRef, useEffect } from 'react';
import AIStreamingResponse from './AIStreamingResponse';
import AIErrorMessage from './AIErrorMessage';
import './CustomerSupportChatbot.css';

const CustomerSupportChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [error, setError] = useState('');

  const chatContainerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const backendUrl =import.meta.env.VITE_BACKEND_URL;

  // Load sessionId from localStorage (so chat persists on refresh)
  useEffect(() => {
    const savedSessionId = localStorage.getItem('chatSessionId');
    if (savedSessionId) {
      setCurrentSessionId(savedSessionId);
    } else {
      const newSessionId = `session-${Date.now()}`;
      setCurrentSessionId(newSessionId);
      localStorage.setItem('chatSessionId', newSessionId);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
const handleSendMessage = async () => {
  if (!inputMessage.trim() || isStreaming) return;

  const userMessage = inputMessage.trim();
  setInputMessage('');
  setIsStreaming(true);
  setError('');

  // Cancel previous request if user sends new message
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  abortControllerRef.current = new AbortController();

  try {
    if (!currentSessionId || !userMessage) {
      throw new Error('Invalid session or message');
    }

    const res = await Promise.race([
      fetch(`${backendUrl}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: currentSessionId
        }),
        signal: abortControllerRef.current.signal
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout - please try again')), 30000)
      )
    ]);

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = '';

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.content) {
              accumulatedText += parsed.content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { 
                  role: 'assistant', 
                  content: accumulatedText 
                };
                return updated;
              });
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e) {
            if (e instanceof SyntaxError) {
              // Ignore incomplete JSON chunks
              continue;
            }
            throw e;
          }
        }
      }
    }

  } catch (err) {
    if (err.name === 'AbortError') {
      setError('Request cancelled');
    } else {
      setError(err.message || 'Failed to send message. Please try again.');
    }
    // Remove empty assistant message on error
    setMessages(prev => prev.filter((_, idx) => idx !== prev.length - 1 || prev[prev.length - 1].content));
    setError(`Connection error: ${err.message}`);
    setMessages(prev => prev.slice(0, -1)); // remove empty assistant message
  } finally {
    setIsStreaming(false);
  }
};
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear this chat session?")) {
      setMessages([]);
      const newSessionId = `session-${Date.now()}`;
      setCurrentSessionId(newSessionId);
      localStorage.setItem('chatSessionId', newSessionId);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div>
          <h2>Customer Support Chatbot</h2>
          <p>Alex is here to help you 24/7</p>
        </div>
        <button onClick={clearChat} className="clear-btn">
          Clear Chat
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="chat-messages" ref={chatContainerRef}>
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>Hello! I'm Alex, your customer support assistant.</p>
            <p>How(
          <AIErrorMessage 
            message={error} 
            onDismiss={() => setError('')}
          />
        )t products, shipping, returns, or anything else.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className="message-bubble">
              {msg.role === 'assistant' ? (
                <AIStreamingResponse 
                  content={msg.content} 
                  isStreaming={isStreaming && index === messages.length - 1} 
                />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here... (Press Enter to send)"
          rows="2"
          disabled={isStreaming}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isStreaming}
          className="send-btn"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportChatbot;