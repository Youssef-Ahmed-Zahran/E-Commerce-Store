import { createSlice } from "@reduxjs/toolkit";

// ========================================
// LocalStorage Utilities
// ========================================

const STORAGE_KEY = "favorites";

// Retrieve favorites from localStorage
export const getFavoritesFromLocalStorage = () => {
  try {
    const favoritesJSON = localStorage.getItem(STORAGE_KEY);
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
    return [];
  }
};

// Save favorites to localStorage
const saveFavoritesToLocalStorage = (favorites) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
};

// ========================================
// Redux Slice
// ========================================

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: getFavoritesFromLocalStorage(),
  reducers: {
    addToFavorites: (state, action) => {
      // Check if the product is not already in favorites
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
        saveFavoritesToLocalStorage(state);
      }
    },
    removeFromFavorites: (state, action) => {
      // Remove the product with the matching ID
      const updatedState = state.filter(
        (product) => product._id !== action.payload._id
      );
      saveFavoritesToLocalStorage(updatedState);
      return updatedState;
    },
  },
});

// ========================================
// Exports
// ========================================

export const { addToFavorites, removeFromFavorites } = favoriteSlice.actions;

export const selectFavoriteProduct = (state) => state.favorites;

export default favoriteSlice.reducer;
