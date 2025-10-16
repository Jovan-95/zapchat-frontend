/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../services/chatServices";
import { useEffect, useState } from "react";
import EmptyConversation from "../components/emptyState";
import UsersList from "./home-components/usersList";
import ChatInput from "./home-components/chatInput";
import Conversation from "./home-components/conversation";
import { HomeProps } from "../types/interfaces";

function Home({
  onlineUsers,
  targetUser,
  setTargetUser,
  conversationMessages,
  setConversationMessages,
  typingUsers,
}: HomeProps) {
  const loggedUser = useSelector((state: RootState) => state.auth.loggedInUser);
  const [message, setMessage] = useState("");
  const [showConversation, setShowConversation] = useState(false);

  // Fetch messages only on targetUser change
  const { data: messages } = useQuery({
    queryKey: ["messages", targetUser?.id],
    queryFn: () => fetchMessages(targetUser!.id),
    enabled: !!targetUser,
  });

  // Update conversationMessages when messages are fetched
  useEffect(() => {
    // console.log("Messages", messages);
    if (messages && Array.isArray(messages.data.messages)) {
      setConversationMessages(messages.data.messages);
    } else {
      setConversationMessages([]);
    }
  }, [messages]);

  // console.log("Conversation messages", conversationMessages);
  // console.log("Targer user", targetUser);

  return (
    <div className="chat-wrapper">
      <div
        className={`users-list-wrapper ${
          showConversation ? "hidden-mobile" : "active"
        }`}
      >
        {/* Users list */}
        <UsersList
          loggedUser={loggedUser}
          setTargetUser={setTargetUser}
          setShowConversation={setShowConversation}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Conversation */}
      <div
        className={`conversation-wrapper ${
          showConversation ? "active" : "hidden-mobile"
        }`}
      >
        {targetUser ? (
          <>
            <Conversation
              conversationMessages={conversationMessages}
              targetUser={targetUser}
              loggedUser={loggedUser}
              setShowConversation={setShowConversation}
              typingUsers={typingUsers}
            />
          </>
        ) : (
          <EmptyConversation />
        )}

        {/* Input */}
        {targetUser && (
          <ChatInput
            loggedUser={loggedUser}
            targetUser={targetUser}
            message={message}
            setMessage={setMessage}
            setConversationMessages={setConversationMessages}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
