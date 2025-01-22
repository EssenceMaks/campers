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
  engines: [], // массив выбранных типов двигателей
  transmissions: [], // массив выбранных типов трансмиссий
  forms: [], // массив выбранных типов кузова
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
      state.engines = action.payload;
    },
    setTransmissionFilter: (state, action) => {
      state.transmissions = action.payload;
    },
    setFormFilter: (state, action) => {
      state.forms = action.payload;
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
