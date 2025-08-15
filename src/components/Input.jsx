import React, { useContext, useState, useEffect } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { TypingContext } from "../context/TypingContext";
import EmojiPicker from "./EmojiPicker";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { setTyping } = useContext(TypingContext);

  const handleSend = async () => {
    // Prevent sending if no chat is selected or no text/image
    if (data.chatId === "null" || (!text.trim() && !img)) {
      console.log("Cannot send message:", { chatId: data.chatId, text, img });
      return;
    }

    console.log("Sending message:", { chatId: data.chatId, text, user: data.user });

    // Store the current text and image before clearing
    const messageText = text;
    const messageImg = img;
    
    // Clear the input immediately and stop typing indicator
    setText("");
    setImg(null);
    setImagePreview(null);
    setTyping(false);

    try {
      if (messageImg) {
        const storageRef = ref(storage, uuid());

        const uploadTask = uploadBytesResumable(storageRef, messageImg);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progress tracking (optional)
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: messageText,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            });
          }
        );
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: messageText,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text: messageText,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text: messageText,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Typing indicator logic
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (data.chatId !== "null") {
        setTyping(text.length > 0);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text, data.chatId, setTyping]);

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImagePreview = () => {
    setImg(null);
    setImagePreview(null);
  };

  return (
    <div className="input">
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" />
          <button className="remove-preview" onClick={removeImagePreview}>✕</button>
        </div>
      )}
      
      <div className="input-container">
        <input
          type="text"
          placeholder={data.chatId === "null" ? "Select a chat to start messaging..." : "Type something..."}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          value={text}
          disabled={data.chatId === "null"}
        />
        
        <div className="input-actions">
          <button 
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={data.chatId === "null"}
          >
            😊
          </button>
          
          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            accept="*/*"
            onChange={handleImageSelect}
          />
          <label htmlFor="file" className={data.chatId === "null" ? "disabled" : ""}>
            <img src={Attach} alt="Attach file" />
          </label>
          
          <input
            type="file"
            style={{ display: "none" }}
            id="img"
            accept="image/*"
            onChange={handleImageSelect}
          />
          <label htmlFor="img" className={data.chatId === "null" ? "disabled" : ""}>
            <img src={Img} alt="Attach" />
          </label>
          
          <button 
            className="send-btn"
            onClick={handleSend}
            disabled={data.chatId === "null" || (!text.trim() && !img)}
          >
            Send
          </button>
        </div>
      </div>
      
      {showEmojiPicker && (
        <EmojiPicker 
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
};

export default Input;
