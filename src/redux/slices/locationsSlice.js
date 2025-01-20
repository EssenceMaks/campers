import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io";

export const searchLocations = createAsyncThunk(
  "locations/searchLocations",
  async (searchTerm) => {
    try {
      const response = await axios.get(`${BASE_URL}/campers`);
      const { items = [] } = response.data;
      
      // Extract unique locations from campers
      const locations = [...new Set(items.map(item => item.location))];
      
      // Filter locations based on search term
      return locations.filter(location => 
        location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
);

const locationsSlice = createSlice({
  name: "locations",
  initialState: {
    suggestions: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchLocations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suggestions = action.payload;
      })
      .addCase(searchLocations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const selectLocationSuggestions = (state) => state.locations.suggestions;
export const selectLocationsLoading = (state) => state.locations.isLoading;

export const { clearSuggestions } = locationsSlice.actions;
export default locationsSlice.reducer;
