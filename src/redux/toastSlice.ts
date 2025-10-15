import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: JSON.parse(localStorage.getItem("notifications") ?? "[]"),
};
const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.push({
                message: action.payload.message,
                type: action.payload.type,
                timestamp: new Date().toISOString(),
            });
            localStorage.setItem(
                "notifications",
                JSON.stringify(state.notifications)
            );
        },
        // removeNotification: (state, action) => {
        //     state.notifications = state.notifications.filter(
        //         (note) => note.timestamp !== action.payload.timestamp
        //     );
        //     localStorage.setItem(
        //         "notifications",
        //         JSON.stringify(state.notifications)
        //     );
        // },
        clearNotifications: (state) => {
            state.notifications = [];
            localStorage.removeItem("notifications");
        },
    },
});
export const { addNotification, clearNotifications } =
    notificationsSlice.actions;
export default notificationsSlice.reducer;
