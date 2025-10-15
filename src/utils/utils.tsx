import { ChatMessage, LiveMessage, LoggedUser, User } from "../types/type";

// Merging types for live msg and regular chat msg so they can exist in same array without TS errors
export function transformLiveToChat(
    data: LiveMessage,
    loggedUser: LoggedUser,
    targetUser?: User | null
): ChatMessage {
    return {
        id: `live-${Date.now()}-${Math.random()}`,
        message: data.message,
        from_id: data.from_id,
        to_id: data.to_id,
        created_at: new Date().toISOString(),
        updated_at: undefined,
        read_at: null,
        confirmed: true,
        from: {
            id: data.from_id,
            name:
                data.from_id === loggedUser.id
                    ? loggedUser.name
                    : targetUser?.name,
            image_path:
                data.from_id === loggedUser.id
                    ? loggedUser.image_path
                    : targetUser?.image_path,
        },
        to: {
            id: data.to_id,
            name:
                data.to_id === loggedUser.id
                    ? loggedUser.name
                    : targetUser?.name,
            image_path:
                data.to_id === loggedUser.id
                    ? loggedUser.image_path
                    : targetUser?.image_path,
        },
    };
}

// Pusher channels ending
// export const unsubscribeAllPusherChannels = () => {
//     Object.values(pusher.channels.channels).forEach((channel: any) => {
//         channel.unbind_all();
//         pusher.unsubscribe(channel.name);
//     });
// };
