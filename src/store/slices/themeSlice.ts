import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for theme
interface ThemeState {
  isDarkMode: boolean;
}

const initialState: ThemeState = {
  isDarkMode: false, // Default to light theme
};

// Create the theme slice
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

// Export actions to be used in components
export const { toggleTheme } = themeSlice.actions;

// Export the reducer for store configuration
export default themeSlice.reducer;
