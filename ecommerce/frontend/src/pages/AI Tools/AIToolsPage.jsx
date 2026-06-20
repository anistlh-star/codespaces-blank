//ecommerce/frontend/src/pages/AI Tools/AIToolsPage.jsx
import React, { useState } from 'react';
import './AIToolsPage.css';   // We'll create this CSS file next
import CustomerSupportChatbot from '../../components/ai/CustomerSupportChatbot';
import ProductDescriptionGenerator from '../../components/ai/ProductDescriptionGenerator';

const AIToolsPage = () => {
  const [activeTab, setActiveTab] = useState('description'); // 'description' or 'chat'

  return (
    <div className="ai-tools-page">
      <div className="ai-tools-container">
        
        {/* Header */}
        <div className="ai-header">
          <h1>AI Tools</h1>
          <p>Powerful AI features to help grow your e-commerce business</p>
        </div>

        {/* Tabs */}
        <div className="ai-tabs">
          <button 
            className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Product Description Generator
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Customer Support Chatbot
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'description' && <ProductDescriptionGenerator />}
          {activeTab === 'chat' && <CustomerSupportChatbot />}
        </div>

      </div>
    </div>
  );
};

export default AIToolsPage;