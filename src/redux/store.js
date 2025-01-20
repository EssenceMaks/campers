import { configureStore } from '@reduxjs/toolkit';
import campersReducer from './slices/campersSlice';
import locationsReducer from './slices/locationsSlice';

const store = configureStore({
  reducer: {
    campers: campersReducer,
    locations: locationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
