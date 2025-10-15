/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactNode } from "react";
import { ChatMessage, LoggedUser, Messages, User } from "./type";

// Tipiziranje za children (PrivateRoute)
export interface PrivateRouteProps {
    children: ReactNode;
    requiredRole?: "admin" | "user"; // ili samo 'admin' ako ti ne treba za 'user'
}

export interface PublicRouteProps {
    children: ReactNode;
}

export interface SendMessagePayload {
    to_id: number; // ID korisnika kojem šalješ
    message: string;
}

// User List props type
export interface UsersListProps {
    loggedUser: LoggedUser | null;
    setTargetUser: React.Dispatch<React.SetStateAction<User | null>>;
    setShowConversation: React.Dispatch<React.SetStateAction<boolean>>;
    onlineUsers: OnlineUser[];
}

// Chat input props type
export interface ChatInputProps {
    loggedUser: LoggedUser | null;
    targetUser: User | null;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setConversationMessages: React.Dispatch<
        React.SetStateAction<ChatMessage[]>
    >;
}

export interface ConversationProps {
    conversationMessages: ChatMessage[];
    targetUser: User | null;
    loggedUser: LoggedUser | null;
    setShowConversation: React.Dispatch<React.SetStateAction<boolean>>;
    typingUsers: Record<number, boolean>;
}

// Online user obj
export interface OnlineUser {
    created_at: string;
    email: string;
    email_verified_at: null;
    id: number;
    image_path: string;
    is_admin: number;
    last_name: string;
    name: string;
    updated_at: string;
    username: string;
}

// Pusher live members
export interface Members {
    count: number;
    me: { id: string; info: OnlineUser };
    members: OnlineUser;
    myID: string;
}

// Home props
export interface HomeProps {
    onlineUsers: OnlineUser[];
    targetUser: User | null;
    setTargetUser: React.Dispatch<React.SetStateAction<User | null>>;
    conversationMessages: ChatMessage[];
    setConversationMessages: React.Dispatch<
        React.SetStateAction<ChatMessage[]>
    >;
    typingUsers: Record<number, boolean>;
}

// User live typing event
export interface UserTypingEvent {
    fromId: number;
}
