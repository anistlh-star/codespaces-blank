// ecommerce/frontend/src/components/ai/ProductDescriptionGenerator.jsx
import React, { useState, useRef } from 'react';
import AIStreamingResponse from './AIStreamingResponse';
import AIErrorMessage from './AIErrorMessage';
import './ProductDescriptionGenerator.css';

const ProductDescriptionGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    features: ''
  });

  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef(null);
  const backendUrl =import.meta.env.VITE_BACKEND_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name?.trim() || !formData.category?.trim()) {
      setError("Product Name and Category are required");
      return;
    }

    if (formData.name.trim().length > 200) {
      setError("Product name is too long (max 200 characters)");
      return;
    }

    setError('');
    setResponse('');
    setIsStreaming(true);
    setIsLoading(true);

    // Cancel previous request if user starts new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const res = await Promise.race([
        fetch(`${backendUrl}/ai/generate-description/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            brand: formData.brand.trim(),
            category: formData.category.trim(),
            features: formData.features
              ? formData.features.split(',').map(f => f.trim()).filter(f => f)
              : []
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
                setResponse(accumulatedText);
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                // Ignore incomplete JSON chunks
                continue;
              }
              throw err;
            }
          }
        }
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request cancelled');
      } else {
        setError(err.message || "Failed to generate description. Please try again.");
      }
    } finally {
      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response.replace(/<br>/g, '\n'));
      alert("Description copied to clipboard!");
    }
  };

  return (
    <div className="product-generator">
      <h2>AI Product Description Generator</h2>
      <p className="subtitle">Generate engaging, SEO-friendly product descriptions instantly</p>

      <div className="generator-container">
        {/* Input Form */}
        <div className="input-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Sony WH-1000XM6 Wireless Headphones"
                required
              />
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g. Sony"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g. Electronics, Audio, Headphones"
                required
              />
            </div>

            <div className="form-group">
              <label>Key Features (comma separated)</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="Noise cancellation, 30-hour battery, Touch controls, Hi-Res Audio"
                rows="3"
              />(
            <AIErrorMessage 
              message={error} 
              onDismiss={() => setError('')}
            />
          )
            </div>

            <button 
              type="submit" 
              className="generate-btn"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Description"}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="output-section">
          <div className="output-header">
            <h3>Generated Description</h3>
            {response && (
              <button onClick={handleCopy} className="copy-btn">
                Copy to Clipboard
              </button>
            )}
          </div>

          <AIStreamingResponse 
            content={response} 
            isStreaming={isStreaming} 
          />

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionGenerator;