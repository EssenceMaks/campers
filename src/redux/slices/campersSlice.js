import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io";

// Функция для преобразования данных кемпера в формат для каталога
const transformCamperForCatalog = (camper) => ({
  id: camper.id,
  name: camper.name,
  price: camper.price,
  rating: camper.rating,
  reviews: camper.reviews?.length || 0,
  location: camper.location,
  description: camper.description?.length > 150 
    ? `${camper.description.slice(0, 150)}...` 
    : camper.description || '',
  mainImage: camper.gallery?.[0]?.original,
  features: {
    transmission: camper.transmission, // "automatic" или "manual"
    engine: camper.engine, // "petrol", "diesel", "hybrid", "gas"
    AC: camper.AC,
    bathroom: camper.bathroom,
    kitchen: camper.kitchen,
    TV: camper.TV,
    radio: camper.radio,
    refrigerator: camper.refrigerator,
    microwave: camper.microwave,
    gas: camper.gas,
    water: camper.water
  },
  form: camper.form // "alcove", "fullyIntegrated", "panelTruck"
});

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 9,
    total: 0
  },
  hasMore: true,
  selectedCamper: null
};

export const searchCampers = createAsyncThunk(
  "campers/searchCampers",
  async ({ page = 1, loadAll = false }, { getState }) => {
    try {
      const response = await axios.get(`${BASE_URL}/campers`);
      const { items = [], total = 0 } = response.data;
      const filters = getState().filters;
      const showFavorites = getState().favorites.showFavorites;
      
      const transformedItems = items.map(transformCamperForCatalog);
      
      // If loadAll is true or showing favorites, skip filtering
      let filteredItems = transformedItems;
      if (!loadAll && !showFavorites) {
        filteredItems = transformedItems.filter(camper => {
          // Фильтр по локации
          if (filters.location && !camper.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
          }

          // Фильтр по оборудованию
          const hasAllEquipment = Object.entries(filters.equipment)
            .every(([key, isSelected]) => {
              if (!isSelected) return true;
              return camper.features[key] === true;
            });

          if (!hasAllEquipment) return false;

          // Фильтр по типу двигателя
          if (filters.engines.length > 0 && !filters.engines.includes(camper.features.engine)) {
            return false;
          }

          // Фильтр по трансмиссии
          if (filters.transmissions.length > 0 && !filters.transmissions.includes(camper.features.transmission)) {
            return false;
          }

          // Фильтр по типу транспортного средства
          if (filters.forms.length > 0 && !filters.forms.includes(camper.form)) {
            return false;
          }

          return true;
        });
      }
      
      // If loadAll is true, return all items without pagination
      if (loadAll) {
        return {
          items: filteredItems,
          total: filteredItems.length
        };
      }
      
      // Пагинация
      const startIndex = (page - 1) * initialState.pagination.limit;
      const endIndex = startIndex + initialState.pagination.limit;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);
      
      return {
        items: paginatedItems,
        total: filteredItems.length
      };
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
);

export const fetchCamperById = createAsyncThunk(
  "campers/fetchCamperById",
  async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/campers/${id}`);
      const camper = response.data;
      return {
        ...camper,
        features: {
          transmission: camper.transmission,
          engine: camper.engine,
          AC: camper.AC,
          bathroom: camper.bathroom,
          kitchen: camper.kitchen,
          TV: camper.TV,
          radio: camper.radio,
          refrigerator: camper.refrigerator,
          microwave: camper.microwave,
          gas: camper.gas,
          water: camper.water
        }
      };
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
);

const campersSlice = createSlice({
  name: "campers",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
    resetCampers: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCampers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCampers.fulfilled, (state, action) => {
        const { items, total } = action.payload;
        
        if (state.pagination.page === 1) {
          state.items = items;
        } else {
          state.items = [...state.items, ...items];
        }
        
        state.pagination.total = total;
        state.hasMore = items.length === state.pagination.limit;
        state.isLoading = false;
      })
      .addCase(searchCampers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCamperById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCamperById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCamper = action.payload;
      })
      .addCase(fetchCamperById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const selectCampers = (state) => state.campers.items;
export const selectPagination = (state) => state.campers.pagination;
export const selectHasMore = (state) => state.campers.hasMore;
export const selectSelectedCamper = (state) => state.campers.selectedCamper;
export const selectCampersLoading = (state) => state.campers.isLoading;
export const selectCampersError = (state) => state.campers.error;

export const { setPage, resetPagination, resetCampers } = campersSlice.actions;

export default campersSlice.reducer;
