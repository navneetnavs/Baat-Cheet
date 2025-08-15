import {
    createContext,
    useContext,
    useReducer,
  } from "react";
  import { AuthContext } from "./AuthContext";
  
  export const ChatContext = createContext();
  
  export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const INITIAL_STATE = {
      chatId: "null",
      user: {},
    };
  
    const chatReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_USER":
          if (!currentUser || !action.payload) {
            console.error("ChatContext: Missing currentUser or payload");
            return state;
          }
          
          const newChatId = currentUser.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid;
          
          console.log("ChatContext: CHANGE_USER", {
            user: action.payload,
            chatId: newChatId,
            currentUser: currentUser.uid
          });
          
          return {
            user: action.payload,
            chatId: newChatId,
          };

        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  
    return (
      <ChatContext.Provider value={{ data:state, dispatch }}>
        {children}
      </ChatContext.Provider>
    );
  };