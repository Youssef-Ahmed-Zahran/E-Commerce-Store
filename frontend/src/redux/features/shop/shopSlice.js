import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  products: [],
  checked: [],
  radio: [],
  selectedBrand: "",
  page: 1,
  pages: 1,
  hasMore: false,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
    setRadio: (state, action) => {
      state.radio = action.payload;
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPaginationData: (state, action) => {
      state.page = action.payload.page;
      state.pages = action.payload.pages;
      state.hasMore = action.payload.hasMore;
    },
  },
});

export const {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setSelectedBrand,
  setPage,
  setPaginationData,
} = shopSlice.actions;

export default shopSlice.reducer;
