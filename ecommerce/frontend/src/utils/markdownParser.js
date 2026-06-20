// Simple markdown to HTML parser for AI responses
export const parseMarkdown = (text) => {
  if (!text) return '';

  let html = text
    // Code blocks (```...```)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold (**text** or __text__)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    // Italic (*text* or _text_)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    // Bullet points (* , - , +)
    .replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>')
    // Numbered lists
    .replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li>$2</li>')
    // Line breaks
    .replace(/\n/g, '<br/>');

  // Wrap consecutive list items in <ul>
  html = html.replace(/(<li>.*?<\/li>)/gs, (match) => {
    return `<ul>${match}</ul>`;
  });

  return html;
};

// Sanitize HTML to prevent XSS
export const sanitizeHtml = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};
