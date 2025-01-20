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
  async ({ page = 1 }) => {
    try {
      const response = await axios.get(`${BASE_URL}/campers`);
      const { items = [], total = 0 } = response.data;
      return {
        items: items.map(transformCamperForCatalog),
        total
      };
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
);

const initialState = {
  items: [],
  camper: {},
  isLoading: false,
  error: null,
  filters: {
    location: '',
    equipment: {
      ac: false,
      tv: false,
      kitchen: false,
      shower: false,
      heater: false,
      toilet: false,
      wifi: false
    },
    vehicleType: {
      van: false,
      rv: false,
      motorhome: false,
      campervan: false,
      travelTrailer: false
    }
  },
  pagination: {
    page: 1,
    per_page: 4,
    total: 0,
  },
  hasMore: true
};

const handleLoading = (state) => {
  state.isLoading = true;
  state.error = null;
}

const handleError = (state, action) => {
  state.isLoading = false;
  state.error = action.error.message;
}

const handleFulfilled = (state) => {
  state.isLoading = false;
  state.error = null;
}

const campersSlice = createSlice({
  name: "campers",
  initialState,
  reducers: {
    setLocationFilter: (state, action) => {
      state.filters.location = action.payload;
    },
    setEquipmentFilter: (state, action) => {
      const { name, value } = action.payload;
      state.filters.equipment[name] = value;
    },
    setVehicleTypeFilter: (state, action) => {
      const { name, value } = action.payload;
      state.filters.vehicleType[name] = value;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
      state.hasMore = true;
    },
    resetCampers: (state) => {
      state.items = [];
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCampers.pending, handleLoading)
      .addCase(searchCampers.rejected, handleError)
      .addCase(searchCampers.fulfilled, (state, action) => {
        handleFulfilled(state);
        const { items = [], total = 0 } = action.payload;
        
        // Apply filters
        let filteredItems = items;
        
        // Filter by location
        if (state.filters.location) {
          filteredItems = filteredItems.filter(item => 
            item.location.toLowerCase().includes(state.filters.location.toLowerCase())
          );
        }
        
        // Filter by equipment
        Object.entries(state.filters.equipment).forEach(([key, value]) => {
          if (value) {
            filteredItems = filteredItems.filter(item => item.features[key]);
          }
        });
        
        // Filter by vehicle type
        Object.entries(state.filters.vehicleType).forEach(([key, value]) => {
          if (value) {
            filteredItems = filteredItems.filter(item => item.type === key);
          }
        });
        
        // Handle pagination
        if (state.pagination.page === 1) {
          state.items = filteredItems;
        } else {
          const existingIds = new Set(state.items.map(item => item.id));
          const newItems = filteredItems.filter(item => !existingIds.has(item.id));
          state.items = [...state.items, ...newItems];
        }
        
        state.pagination.total = total;
        state.hasMore = filteredItems.length === state.pagination.per_page;
      });
  },
});

export const selectCampers = (state) => state.campers.items;
export const selectPagination = (state) => state.campers.pagination;
export const selectCampersQuery = (state) => state.campers;
export const selectHasMore = (state) => state.campers.hasMore;

export const { 
  setLocationFilter,
  setEquipmentFilter,
  setVehicleTypeFilter,
  resetFilters,
  setPage,
  resetPagination,
  resetCampers 
} = campersSlice.actions;

export default campersSlice.reducer;
