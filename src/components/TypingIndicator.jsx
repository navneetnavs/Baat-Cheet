import React, { useContext } from 'react';
import { TypingContext } from '../context/TypingContext';

const TypingIndicator = () => {
  const { typingUsers } = useContext(TypingContext);
  
  const typingUserNames = Object.values(typingUsers).map(user => user.displayName);
  
  if (typingUserNames.length === 0) return null;

  const getTypingText = () => {
    if (typingUserNames.length === 1) {
      return `${typingUserNames[0]} is typing...`;
    } else if (typingUserNames.length === 2) {
      return `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`;
    } else {
      return `${typingUserNames.length} people are typing...`;
    }
  };

  return (
    <div className="typing-indicator">
      <div className="typing-content">
        <div className="typing-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <span className="typing-text">{getTypingText()}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
