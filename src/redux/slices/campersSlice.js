import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io";

// Функция для преобразования данных кемпера в формат для каталога
const transformCamperForCatalog = (camper) => ({
  id: camper.id,
  name: camper.name,
  price: camper.price,
  rating: camper.rating,
  location: camper.location,
  description: camper.description,
  mainImage: camper.gallery?.[0]?.original,
  features: {
    transmission: camper.transmission,
    engine: camper.engine,
    kitchen: camper.kitchen,
    AC: camper.AC
  }
});

export const searchCampers = createAsyncThunk(
  "campers/searchCampers",
  async ({ page = 1, filters = {} }) => {
    try {
      console.log("Fetching campers with params:", { page, filters });
      const response = await axios.get(`${BASE_URL}/campers`);
      console.log("API Response:", response.data);
      
      // Получаем items из response.data
      const { items = [], total = 0 } = response.data;
      
      // Преобразуем данные для каталога
      const transformedItems = items.map(transformCamperForCatalog);
      
      return {
        items: transformedItems,
        total
      };
    } catch (error) {
      console.error("API Error:", error.response || error);
      throw error;
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  page: 1,
  hasMore: true,
  total: 0,
  filters: {
    equipment: {
      ac: false,
      automatic: false,
      kitchen: false,
      tv: false,
      bathroom: false,
    },
    vehicleType: {
      van: false,
      fullyIntegrated: false,
      alcove: false,
    },
  },
};

const campersSlice = createSlice({
  name: "campers",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { category, name, value } = action.payload;
      state.filters[category][name] = value;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCampers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchCampers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        
        const { items = [], total = 0 } = action.payload;
        
        if (state.page === 1) {
          state.items = items;
        } else {
          state.items = [...state.items, ...items];
        }
        
        state.total = total;
        state.hasMore = items.length > 0;
        state.page += 1;
      })
      .addCase(searchCampers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.error("Redux Error:", action.error);
      });
  },
});

export const { setFilter, resetFilters } = campersSlice.actions;
export default campersSlice.reducer;
