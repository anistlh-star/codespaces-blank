import { useState } from "react";
import "./ChatBasic.css";

export default function ChatBasic() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const sendMessage = async () => {
    const controller = new AbortController();

    setLoading(true);

    const res = await fetch("/api/chat-stream", {
      method: "POST",
      body: JSON.stringify({ message: input }),
      signal: controller.signal,
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let aiMessage = "";

    // Add empty assistant message first
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunk = decoder.decode(value);

      aiMessage += chunk;

      // Update last message LIVE
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = aiMessage;
        return updated;
      });
    }

    setLoading(false);
  };
  return (
    <div className="chat-container">
      <div className="chat-panel">
        <div className="chat-header">AI Chat</div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`chat-message ${m.role === "user" ? "user" : "assistant"}`}
            >
              <strong>{m.role === "user" ? "You" : "Assistant"}</strong>
              <div>{m.content}</div>
            </div>
          ))}
          {loading && <div className="chat-status">Thinking...</div>}
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Type your message..."
          />
          <button
            className="chat-button"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
