import { createSlice } from '@reduxjs/toolkit';

// Load favorites from localStorage on initialization
const loadFavoritesFromStorage = () => {
  try {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favoriteIds: loadFavoritesFromStorage(),
    showFavorites: false
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const camperId = action.payload;
      const index = state.favoriteIds.indexOf(camperId);
      
      if (index === -1) {
        state.favoriteIds.push(camperId);
      } else {
        state.favoriteIds.splice(index, 1);
      }
      
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favoriteIds));
    },
    toggleShowFavorites: (state) => {
      state.showFavorites = !state.showFavorites;
    }
  }
});

export const { toggleFavorite, toggleShowFavorites } = favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.favoriteIds;
export const selectShowFavorites = (state) => state.favorites.showFavorites;

export default favoritesSlice.reducer;
