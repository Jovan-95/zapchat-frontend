/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateTyping, sendMessage } from "../../services/chatServices";
import { ChatInputProps, SendMessagePayload } from "../../types/interfaces";
import { ChatMessage, Message } from "../../types/type";
import { showErrorToast } from "../../components/toast";
import { useMemo } from "react";
import debounce from "lodash.debounce";

function ChatInput({
    loggedUser,
    targetUser,
    message,
    setMessage,
    setConversationMessages,
}: ChatInputProps) {
    const queryClient = useQueryClient();

    // Send message mutation
    const { mutate: sendMessageMutate, isPending: sending } = useMutation({
        mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
        onSuccess: (data: Message) => {
            console.log("Message data POST Req sent: ", data);

            if (!data || !data.data || !targetUser) return;
            setMessage("");

            // Refetch users
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => showErrorToast("Failed to send message"),
    });

    // Typing mutation
    const { mutate: typingMutation } = useMutation({
        mutationFn: (payload: number) => activateTyping(payload),
        onSuccess: (data: number) => {
            console.log("Typing mutation data: ", data);

            if (!data || !targetUser) return;
        },
        onError: () => showErrorToast("Failed to send message"),
    });

    function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!targetUser || !message.trim()) return;

        // Instant msg show, replaced with pusher live msg
        const optimisticMessage: ChatMessage = {
            id: `temp-${Date.now()}`,
            from_id: loggedUser?.id,
            from: {
                id: loggedUser?.id,
                image_path: loggedUser?.image_path,
                name: loggedUser?.name,
            },
            to: {
                id: targetUser.id,
                image_path: targetUser.image_path,
                name: targetUser.name,
            },
            to_id: targetUser.id,
            message: message,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            read_at: null,
            confirmed: false,
        };

        setConversationMessages((prev) => [...prev, optimisticMessage]);

        sendMessageMutate({
            to_id: targetUser.id,
            message: message,
        });
    }

    const debouncedTyping = useMemo(
        () =>
            debounce(() => {
                if (!targetUser) return;
                typingMutation(targetUser.id);
            }, 300),
        [targetUser, typingMutation]
    );

    return (
        <div className="conversation-input">
            <form onSubmit={handleSendMessage} className="message-input">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        debouncedTyping();
                    }}
                />
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={sending}
                >
                    <span>{sending ? "Sending..." : "Send"}</span>
                </button>
            </form>
        </div>
    );
}

export default ChatInput;
