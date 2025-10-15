// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store;

// Types for usage in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // <--- dodaj ovo
