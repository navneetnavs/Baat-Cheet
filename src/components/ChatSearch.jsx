import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const ChatSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!searchTerm.trim() || data.chatId === "null") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    // Search in messages
    const messagesRef = collection(db, "chats", data.chatId, "messages");
    const q = query(
      messagesRef,
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        const messageData = doc.data();
        if (messageData.text && 
            messageData.text.toLowerCase().includes(searchTerm.toLowerCase())) {
          messages.push({
            id: doc.id,
            ...messageData
          });
        }
      });
      
      setSearchResults(messages.slice(0, 10)); // Limit to 10 results
      setShowResults(true);
      setIsSearching(false);
    });

    return () => unsubscribe();
  }, [searchTerm, data.chatId]);

  const handleResultClick = (messageId) => {
    // Scroll to message in chat
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add('highlight-message');
      setTimeout(() => {
        messageElement.classList.remove('highlight-message');
      }, 3000);
    }
    setShowResults(false);
    setSearchTerm('');
  };

  const formatMessagePreview = (text) => {
    if (!text) return '';
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return text.substring(0, 50) + '...';
    
    const start = Math.max(0, index - 20);
    const end = Math.min(text.length, index + searchTerm.length + 20);
    const preview = text.substring(start, end);
    
    return start > 0 ? '...' + preview + '...' : preview + '...';
  };

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div className="chat-search">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search in chat history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          disabled={data.chatId === "null"}
        />
        {isSearching && <div className="search-spinner">🔍</div>}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="search-results">
          <div className="search-results-header">
            Found {searchResults.length} message{searchResults.length !== 1 ? 's' : ''}
          </div>
          {searchResults.map((message) => (
            <div
              key={message.id}
              className="search-result-item"
              onClick={() => handleResultClick(message.id)}
            >
              <div className="search-result-content">
                <div 
                  className="search-result-text"
                  dangerouslySetInnerHTML={{
                    __html: highlightSearchTerm(formatMessagePreview(message.text))
                  }}
                />
                <div className="search-result-date">
                  {message.date?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && searchResults.length === 0 && !isSearching && (
        <div className="search-no-results">
          No messages found for "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default ChatSearch;
