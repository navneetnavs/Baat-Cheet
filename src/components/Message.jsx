import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [showReactions, setShowReactions] = useState(false);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Mark message as seen when it comes into view
  useEffect(() => {
    if (message.senderId !== currentUser.uid && !message.seenBy?.includes(currentUser.uid)) {
      const markAsSeen = async () => {
        try {
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: data.messages?.map(m => 
              m.id === message.id 
                ? { ...m, seenBy: [...(m.seenBy || []), currentUser.uid] }
                : m
            ) || []
          });
        } catch (error) {
          console.error("Error marking message as seen:", error);
        }
      };
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            markAsSeen();
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }
  }, [message, currentUser.uid, data.chatId, data.messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "now";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  const getFullTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const getReadStatus = () => {
    if (message.senderId !== currentUser.uid) return null;
    
    const seenCount = message.seenBy?.length || 0;
    if (seenCount > 1) return "✓✓"; // Double check - seen
    return "✓"; // Single check - sent
  };

  const addReaction = async (emoji) => {
    try {
      const reactions = message.reactions || {};
      const userReactions = reactions[currentUser.uid] || [];
      
      if (userReactions.includes(emoji)) {
        // Remove reaction
        reactions[currentUser.uid] = userReactions.filter(r => r !== emoji);
      } else {
        // Add reaction
        reactions[currentUser.uid] = [...userReactions, emoji];
      }

      await updateDoc(doc(db, "chats", data.chatId), {
        messages: data.messages?.map(m => 
          m.id === message.id 
            ? { ...m, reactions }
            : m
        ) || []
      });
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
    setShowReactions(false);
  };

  const getAllReactions = () => {
    if (!message.reactions) return [];
    
    const reactionCounts = {};
    Object.values(message.reactions).forEach(userReactions => {
      userReactions.forEach(emoji => {
        reactionCounts[emoji] = (reactionCounts[emoji] || 0) + 1;
      });
    });
    
    return Object.entries(reactionCounts);
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid ? "owner" : ""}`}
      onDoubleClick={() => setShowReactions(!showReactions)}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span 
          className="timestamp"
          title={getFullTimestamp(message.date)}
        >
          {formatTime(message.date)}
        </span>
      </div>
      
      <div className="messageContent">
        <div className="messageText">
          {message.text && <p>{message.text}</p>}
          {message.img && (
            <div className="messageImage">
              <img src={message.img} alt="" />
            </div>
          )}
        </div>
        
        <div className="messageFooter">
          {getAllReactions().length > 0 && (
            <div className="reactions">
              {getAllReactions().map(([emoji, count]) => (
                <span 
                  key={emoji} 
                  className="reaction"
                  onClick={() => addReaction(emoji)}
                >
                  {emoji} {count > 1 && count}
                </span>
              ))}
            </div>
          )}
          
          {getReadStatus() && (
            <span className="readStatus">{getReadStatus()}</span>
          )}
        </div>
      </div>

      {showReactions && (
        <div className="reactionPicker">
          {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
            <button 
              key={emoji}
              onClick={() => addReaction(emoji)}
              className="reactionButton"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;