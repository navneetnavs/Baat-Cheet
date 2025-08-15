import React, { useState } from 'react';

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');

  const emojiCategories = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
    gestures: ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
    objects: ['💬', '💭', '💯', '💢', '💨', '💫', '💦', '💨', '🕳️', '💣', '💤', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞'],
    nature: ['🌱', '🌿', '🍀', '🍃', '🌾', '🌵', '🌲', '🌳', '🌴', '🌸', '🌺', '🌻', '🌹', '🥀', '🌷', '🌼', '🌙', '⭐', '🌟', '✨', '⚡', '🔥', '💧', '🌈']
  };

  const categoryIcons = {
    smileys: '😊',
    hearts: '❤️',
    gestures: '👍',
    objects: '💬',
    nature: '🌸'
  };

  return (
    <div className="emoji-picker">
      <div className="emoji-categories">
        {Object.keys(emojiCategories).map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {categoryIcons[category]}
          </button>
        ))}
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      
      <div className="emoji-grid">
        {emojiCategories[activeCategory].map(emoji => (
          <button
            key={emoji}
            className="emoji-btn"
            onClick={() => onEmojiSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
