/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { LoggedUser } from "../types/type";

type AuthState = {
    loggedInUser: LoggedUser | null;
};

const initialState: AuthState = {
    loggedInUser:
        JSON.parse(localStorage.getItem("loggedInUser") as string) || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Add logic for login
        addLoggedUser: (state, action: PayloadAction<LoggedUser>) => {
            state.loggedInUser = action.payload;
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(state.loggedInUser)
            );
        },

        // Add logic for logout
        logoutUserFromReduxAndLS: (state) => {
            state.loggedInUser = null;
            localStorage.removeItem("loggedInUser");
        },
        updateLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload;
            // Osvezavanje usera i u local storage je uradjeno u komponenti
        },
    },
});

export const { addLoggedUser, logoutUserFromReduxAndLS, updateLoggedInUser } =
    authSlice.actions;
export default authSlice.reducer;
