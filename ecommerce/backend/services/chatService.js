// ecommerce/backend/services/chatService.js
import { groq } from "../config/aiProvider.js";
import Chat from "../models/Chat.js";
import { SUPPORT_SYSTEM_PROMPT } from "../prompts/supportPrompt.js";

export const streamCustomerSupport = async (
  sessionId,
  message,
  userId,
  res,
) => {
  if (!sessionId) sessionId = `session-${Date.now()}`;

  try {
    let chat = await Chat.findOne({ sessionId });

    if (!chat) {
      chat = new Chat({
        sessionId,
        userId: userId || null,
        messages: [],
      });
    } else if (!chat.userId && userId) {
      chat.userId = userId;
    }

    chat.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });
    await chat.save();

    const recentMessages = chat.messages.slice(-10);

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SUPPORT_SYSTEM_PROMPT },
        ...recentMessages.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 800,
      stream: true,
    });

    let fullReply = "";

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || "";
      if (token) {
        fullReply += token;
        res.write(token);
      }
    }

    chat.messages.push({
      role: "assistant",
      content: fullReply,
      timestamp: new Date(),
    });
    if (chat.messages.length > 30) chat.messages = chat.messages.slice(-30);
    await chat.save();

    res.end();
  } catch (error) {
    console.error("Streaming error:", error);
    res.write("\nSorry, I couldn't process that.");
    res.end();
  }
};
