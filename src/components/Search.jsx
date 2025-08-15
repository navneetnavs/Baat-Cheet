import React, { useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  // Real-time search suggestions while typing
  useEffect(() => {
    const searchSuggestions = async () => {
      if (!username.trim() || username.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        console.log("Searching for:", username);
        // Get all users and filter client-side (simpler approach)
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const users = [];
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          console.log("User data:", userData);
          // Filter users whose name contains the search term and exclude current user
          if (
            userData.uid !== currentUser.uid &&
            userData.displayName &&
            userData.displayName.toLowerCase().includes(username.toLowerCase())
          ) {
            users.push(userData);
          }
        });

        // Limit to 5 results and sort by name
        const sortedUsers = users
          .sort((a, b) => a.displayName.localeCompare(b.displayName))
          .slice(0, 5);

        console.log("Found users:", sortedUsers);
        setSuggestions(sortedUsers);
        setErr(sortedUsers.length === 0);
      } catch (error) {
        console.error("Search suggestions error:", error);
        setSuggestions([]);
        setErr(true);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [username, currentUser.uid]);

  const handleSearch = async () => {
    if (!username.trim()) return;
    
    setErr(false);
    setUser(null);
    
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username.trim())
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErr(true);
        return;
      }
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Don't show current user in search results
        if (userData.uid !== currentUser.uid) {
          setUser(userData);
        } else {
          setErr(true);
        }
      });
    } catch (err) {
      console.error("Search error:", err);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (selectedUser) => {
    if (!selectedUser) return;
    
    console.log("Selecting user:", selectedUser);
    
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;
    
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats for current user
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: selectedUser.uid,
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        //create user chats for selected user
        await updateDoc(doc(db, "userChats", selectedUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      
      // Immediately select the chat after creation/verification
      dispatch({ type: "CHANGE_USER", payload: selectedUser });
      console.log("Chat selected, chatId:", combinedId);
      
    } catch (err) {
      console.error("Error creating chat:", err);
    }

    setUser(null);
    setUsername("");
    setSuggestions([]);
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Search users to chat with..."
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        {isLoading && <div className="search-loading">Searching...</div>}
      </div>
      
      {/* Real-time suggestions */}
      {suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestedUser) => (
            <div
              key={suggestedUser.uid}
              className="userChat suggestion"
              onClick={() => handleSelect(suggestedUser)}
            >
              <img src={suggestedUser.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{suggestedUser.displayName}</span>
                <p>Click to start chatting</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {err && username.length > 0 && suggestions.length === 0 && !isLoading && (
        <div className="search-error">
          <span>No users found matching "{username}"</span>
          <p>Try a different search term</p>
        </div>
      )}

      {/* Selected user from exact search */}
      {user && (
        <div className="userChat selected" onClick={() => handleSelect(user)}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
            <p>Click to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;