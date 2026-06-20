import { useState, useRef, useEffect } from "react";
import "./SupportChat.css";
import ReactMarkdown from "react-markdown";
import { MdOutlineContentCopy } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false); // 🆕 Minimize state
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm Alex. How can I help you today?",
    },
  ]);
  const { refreshCart } = useCart();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const lastUserMessageRef = useRef("");
  const bottomRef = useRef(null);
  const abortRef = useRef(null);
  const sessionref = useRef(`session-${Date.now()}`);
  const inputRef = useRef(null);

  // ✅ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Focus input when chat opens and not minimized
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // 🆕 Handle minimize/maximize
  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  // 🆕 Open from minimized state
  const openChat = () => {
    setOpen(true);
    setMinimized(false);
  };

  // 🆕 Close chat
  const closeChat = () => {
    setOpen(false);
    setMinimized(false);
  };

  const resetChat = async () => {
    try {
      if (backendUrl) {
        await fetch(`${backendUrl}/ai/chat/reset`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: sessionref.current,
          }),
        });
      }
    } catch (error) {
      console.error("Reset chat error:", error);
    }
    
    setMessages([
      {
        sender: "bot",
        text: "Hi! I'm Alex. How can I help you today?",
      },
    ]);
    setInput("");
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Please login to use the chat! 🔐",
          isError: true,
        },
      ]);
      return;
    }

    const userMessage = input.trim();
    if (!userMessage || loading) return;

    // Store for retry
    lastUserMessageRef.current = userMessage;
    
    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
      { sender: "bot", text: "", id: Date.now() },
    ]);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let accumulated = "";

    try {
      const res = await fetch(`${backendUrl}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionref.current,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorData}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            sender: "bot",
            text: accumulated,
          };
          return updated;
        });
      }

      const finalMessage = accumulated.trim();
      if (
        finalMessage.includes("✅") &&
        (finalMessage.toLowerCase().includes("cart") ||
         finalMessage.toLowerCase().includes("added"))
      ) {
        console.log("🛒 AI added item to cart → Refreshing UI");
        setTimeout(() => {
          refreshCart();
        }, 500);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Chat error:", err);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            sender: "bot",
            text: "❌ Sorry, I couldn't process your request. Please try again.",
            isError: true,
          };
          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const retryLastMessage = () => {
    const lastMsg = lastUserMessageRef.current;
    if (!lastMsg) return;
    
    setInput(lastMsg);
    setTimeout(() => sendMessage(), 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="chat-wrapper">
      {/* 🆕 Floating chat bubble - shows when closed */}
      {!open && (
        <button 
          className="chat-bubble" 
          onClick={openChat}
          aria-label="Open chat"
        >
          💬
        </button>
      )}

      {/* 🆕 Minimized bar - shows when minimized */}
      {open && minimized && (
        <div className="chat-minimized" onClick={toggleMinimize}>
          <div className="minimized-content">
            <span className="minimized-icon">🤖</span>
            <span className="minimized-text">AI Support - Alex</span>
            {messages.length > 1 && (
              <span className="minimized-preview">
                {messages[messages.length - 1].text.substring(0, 40)}...
              </span>
            )}
          </div>
          <div className="minimized-actions">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeChat();
              }}
              className="minimized-close"
              aria-label="Close chat"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Full chat box - shows when open and not minimized */}
      {open && !minimized && (
        <div className="chat-box">
          <div className="chat-header">
            <span>🤖 AI Support - Alex</span>
            <div className="chat-header-actions">
              <button 
                onClick={toggleMinimize}
                title="Minimize"
                aria-label="Minimize chat"
              >
                ─
              </button>
              <button 
                onClick={resetChat} 
                title="Clear chat"
                aria-label="Clear chat"
              >
                🗑️
              </button>
              <button 
                onClick={closeChat}
                title="Close chat"
                aria-label="Close chat"
              >
                ✖
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`message ${msg.sender === "user" ? "user" : "bot"} ${
                  msg.isError ? "error" : ""
                }`}
              >
                <div className="message-content">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                
                {msg.sender === "bot" && msg.text && (
                  <div className="message-actions">
                    <button
                      onClick={() => handleCopy(msg.text)}
                      className="copy-btn"
                      title="Copy message"
                    >
                      <MdOutlineContentCopy />
                    </button>
                    {msg.isError && (
                      <button
                        onClick={retryLastMessage}
                        className="retry-btn"
                        title="Retry"
                      >
                        🔄
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="typing-indicator">
                <span>Alex is typing</span>
                <div className="typing-dots">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="chat-input">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about products or help..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoComplete="off"
            />

            {loading ? (
              <button 
                onClick={() => abortRef.current?.abort()}
                className="stop-btn"
                title="Stop generating"
              >
                ⏹
              </button>
            ) : (
              <button 
                onClick={sendMessage}
                disabled={!input.trim()}
                title="Send message"
              >
                ➤
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}