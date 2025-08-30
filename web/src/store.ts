import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "./store/apiSlice";

const store = configureStore({
  reducer: {
    api: apiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
