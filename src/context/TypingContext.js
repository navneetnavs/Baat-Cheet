import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from './AuthContext';
import { ChatContext } from './ChatContext';

export const TypingContext = createContext();

export const TypingContextProvider = ({ children }) => {
  const [typingUsers, setTypingUsers] = useState({});
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const setTyping = async (isTyping) => {
    if (!data || data.chatId === "null" || !currentUser) return;

    try {
      await updateDoc(doc(db, "chats", data.chatId), {
        [`typing.${currentUser.uid}`]: isTyping ? {
          displayName: currentUser.displayName,
          timestamp: Date.now()
        } : null
      });
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  useEffect(() => {
    if (!data || !currentUser || data.chatId === "null") {
      setTypingUsers({});
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        const chatData = doc.data();
        const typing = chatData.typing || {};
        
        // Filter out current user and expired typing indicators
        const activeTyping = {};
        const now = Date.now();
        
        Object.entries(typing).forEach(([uid, typingData]) => {
          if (uid !== currentUser.uid && typingData && (now - typingData.timestamp < 5000)) {
            activeTyping[uid] = typingData;
          }
        });
        
        setTypingUsers(activeTyping);
      }
    });

    return () => unsubscribe();
  }, [data?.chatId, currentUser?.uid, currentUser, data]);

  // Clean up expired typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const filtered = {};
      let hasChanges = false;

      Object.entries(typingUsers).forEach(([uid, typingData]) => {
        if (now - typingData.timestamp < 5000) {
          filtered[uid] = typingData;
        } else {
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setTypingUsers(filtered);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [typingUsers]);

  return (
    <TypingContext.Provider value={{ typingUsers, setTyping }}>
      {children}
    </TypingContext.Provider>
  );
};
