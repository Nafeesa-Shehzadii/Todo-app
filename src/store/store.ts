import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./slices/todoSlice";
import themeReducer from "./slices/themeSlice";

// Configure the Redux store
const store = configureStore({
  reducer: {
    todos: todoReducer, // Attach the todo reducer
    theme: themeReducer, // Attach the theme reducer
  },
});

// Export types for the store and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
