import { configureStore } from '@reduxjs/toolkit';
import campersReducer from './slices/campersSlice';
import locationsReducer from './slices/locationsSlice';
import filtersReducer from './slices/filtersSlice';
import favoritesReducer from './slices/favoritesSlice';

const store = configureStore({
  reducer: {
    campers: campersReducer,
    locations: locationsReducer,
    filters: filtersReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
