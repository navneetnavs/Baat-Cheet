import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import { TypingContextProvider } from "./context/TypingContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import "./style.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeContextProvider>
    <AuthContextProvider>
      <ChatContextProvider>
        <TypingContextProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </TypingContextProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  </ThemeContextProvider>
);