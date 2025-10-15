import React from "react";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline"; // optional icon, možete koristiti bilo koji

const EmptyConversation: React.FC = () => {
    return (
        <div className="empty-conversation">
            <div className="icon-wrapper">
                <ChatBubbleOvalLeftEllipsisIcon className="icon" />
            </div>
            <h2>Select a conversation</h2>
            <p>
                Choose a user from the list to start chatting. Your
                conversations will appear here.
            </p>
        </div>
    );
};

export default EmptyConversation;
