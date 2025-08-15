import React, { useState } from 'react';

const AIAssistant = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isAI: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate API call - replace with actual API integration
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I'm a placeholder AI assistant. In a real implementation, this would connect to an AI API like OpenAI, Claude, or similar service to provide intelligent responses.",
        isAI: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-assistant">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-info">
          <div className="ai-avatar">
            🤖
          </div>
          <div className="ai-details">
            <h3>AI Assistant</h3>
            <p>Always here to help</p>
          </div>
        </div>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="ai-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`ai-message ${message.isAI ? '' : 'user'}`}
          >
            <div className="message-bubble">
              <p>{message.text}</p>
              <div className="timestamp">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="ai-input">
        <div className="input-container">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            rows="1"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="send-btn"
          >
            ➤
          </button>
        </div>
        <p className="input-hint">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
