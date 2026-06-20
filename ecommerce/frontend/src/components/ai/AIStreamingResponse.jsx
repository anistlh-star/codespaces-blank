// ecommerce/frontend/src/components/ai/AIStreamingResponse.jsx
import React from 'react';
import { parseMarkdown } from '../../utils/markdownParser';
import './AIStreamingResponse.css';

const AIStreamingResponse = ({ content, isStreaming = false }) => {
  if (!content) {
    return (
      <div className="streaming-placeholder" role="status">
        Your AI-generated content will appear here...
      </div>
    );
  }

  const htmlContent = parseMarkdown(content);

  return (
    <div className="streaming-response">
      <div 
        className={`response-content ${isStreaming ? 'streaming' : ''}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        role="article"
      />
      
      {isStreaming && (
        <div className="streaming-indicator" aria-label="Generating response">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </div>
  );
};

export default AIStreamingResponse;