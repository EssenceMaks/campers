import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: "",
  equipment: {
    AC: false,
    bathroom: false,
    kitchen: false,
    TV: false,
    radio: false,
    refrigerator: false,
    microwave: false,
    gas: false,
    water: false
  },
  engine: "", // "petrol", "diesel", "hybrid", "gas"
  transmission: "", // "automatic" или "manual"
  form: "", // "alcove", "fullyIntegrated", "panelTruck"
  isAutoSearch: true
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setLocationFilter: (state, action) => {
      state.location = action.payload;
    },
    setEquipmentFilter: (state, action) => {
      const { name, value } = action.payload;
      state.equipment[name] = value;
    },
    setEngineFilter: (state, action) => {
      state.engine = action.payload;
    },
    setTransmissionFilter: (state, action) => {
      state.transmission = action.payload;
    },
    setFormFilter: (state, action) => {
      state.form = action.payload;
    },
    toggleAutoSearch: (state) => {
      state.isAutoSearch = !state.isAutoSearch;
    },
    resetFilters: () => initialState,
  },
});

// Селекторы
export const selectFilters = (state) => state.filters;
export const selectIsAutoSearch = (state) => state.filters.isAutoSearch;

export const {
  setLocationFilter,
  setEquipmentFilter,
  setEngineFilter,
  setTransmissionFilter,
  setFormFilter,
  toggleAutoSearch,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
