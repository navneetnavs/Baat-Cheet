import React, { useContext, useState } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import ChatSearch from "./ChatSearch";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [showSearch, setShowSearch] = useState(false);

  console.log("Chat component render:", { chatId: data.chatId, user: data.user });

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chatUser">
          {data.user?.photoURL && (
            <img src={data.user.photoURL} alt="" />
          )}
          <span>{data.user?.displayName || "Select a chat to start messaging"}</span>
        </div>
        <div className="chatIcons">
          <button 
            className="search-toggle"
            onClick={() => setShowSearch(!showSearch)}
            title="Search in chat"
            disabled={data.chatId === "null"}
          >
            🔍
          </button>
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      {showSearch && (
        <div className="chat-search-container">
          <ChatSearch />
        </div>
      )}
      {data.chatId === "null" ? (
        <div className="welcome-message">
          <div className="welcome-content">
            <h2>Welcome to Chat!</h2>
            <p>Search for users to start a conversation</p>
            <div className="welcome-steps">
              <div className="step">
                <span className="step-number">1</span>
                <span>Use the search bar to find users</span>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <span>Click on a user to start chatting</span>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <span>Your conversations will appear in the sidebar</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Messages />
          <Input />
        </>
      )}
    </div>
  );
};

export default Chat;