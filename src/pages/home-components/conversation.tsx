import { useEffect, useRef } from "react";
import { ChatMessage, LoggedUser, User } from "../../types/type";
import { ConversationProps } from "../../types/interfaces";
const API_URL = import.meta.env.VITE_API_URL;

function Conversation({
  conversationMessages,
  targetUser,
  loggedUser,
  setShowConversation,
  typingUsers,
}: ConversationProps) {
  // Auto scroll
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll everytime new msg appears (conversationMessages changes)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationMessages, typingUsers, targetUser]);

  // User convo image src helper function
  function getUserImageUrl(user: LoggedUser | User | null | undefined) {
    if (!user?.image_path) return "/default-avatar.png";
    return user.image_path === "images/default.png"
      ? `${API_URL}/${user.image_path}`
      : `${API_URL}/storage/${user.image_path}`;
  }

  // console.log("Typing users:", typingUsers, "targetUser id:", targetUser?.id);

  return (
    <>
      <div className="conversation-header">
        <h3>
          <div className="back-button-mobile">
            <button onClick={() => setShowConversation(false)}>←</button>
          </div>
          Chat with {targetUser?.name}
        </h3>
      </div>
      <section className="conversation">
        {conversationMessages.map((msg: ChatMessage) => {
          // console.log("MSG", msg);

          // User profile imgs finder
          const isFromMe = msg.from_id === loggedUser?.id;
          const imageSrc = isFromMe
            ? getUserImageUrl(loggedUser)
            : getUserImageUrl(targetUser);

          return (
            <div
              key={msg.id ?? `${msg.from_id}-${msg.to_id}-${msg.message}`}
              className={`message ${isFromMe ? "from-me" : "from-them"}`}
            >
              <div className="bubble-avatar">
                <img
                  src={imageSrc}
                  alt="Profilna slika"
                  className="message-avatar"
                />
              </div>
              <div className="bubble-wrapper">
                <div className="bubble">
                  <div className="bubble-msg"> {msg.message}</div>
                </div>

                <span className="time">
                  {new Date(msg.created_at ?? Date.now()).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>
            </div>
          );
        })}
        {targetUser && typingUsers[targetUser.id] && (
          <p className="typing-indicator">
            {targetUser.name} is typing...
            <span></span>
          </p>
        )}

        <div ref={messagesEndRef} />
      </section>
    </>
  );
}

export default Conversation;
