import { configureStore } from '@reduxjs/toolkit';
import campersReducer from './slices/campersSlice';

const store = configureStore({
  reducer: {
    campers: campersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
