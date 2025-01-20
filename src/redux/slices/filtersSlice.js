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
      const value = action.payload;
      if (state.engines.includes(value)) {
        state.engines = state.engines.filter(engine => engine !== value);
      } else {
        state.engines.push(value);
      }
    },
    setTransmissionFilter: (state, action) => {
      const value = action.payload;
      if (state.transmissions.includes(value)) {
        state.transmissions = state.transmissions.filter(trans => trans !== value);
      } else {
        state.transmissions.push(value);
      }
    },
    setFormFilter: (state, action) => {
      const value = action.payload;
      if (state.forms.includes(value)) {
        state.forms = state.forms.filter(form => form !== value);
      } else {
        state.forms.push(value);
      }
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
