import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import chatReducer from "../slices/chatSlice";
import userProfileReducer from "../slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    userProfile: userProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
