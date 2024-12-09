import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./slices/todoSlice";
import themeReducer from "./slices/themeSlice";

// Configure the Redux store
const store = configureStore({
  reducer: {
    todos: todoReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
