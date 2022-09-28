import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createApi } from "unsplash-js";
import { removeAllImages } from "../pixlikes/pixlikesSlice";

const api = createApi({
  // your Unsplash access key here
  accessKey: process.env.UNSPLASH_KEY || "",
});

const initialState = {
  images: [],
  page: 1,
  total_pages: 0,
  search_terms: "",
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const defaultPageSize = 20;

export const fetchImages = createAsyncThunk(
  "unsplash/fetchImages",
  async (requestData, { getState }) => {
    removeAllImages();
    const state = getState().unsplash;
    const result = await api.search.getPhotos({
      query: state.search_terms,
      orientation: "landscape",
      page: state.page,
      perPage: defaultPageSize,
    });
    if (result?.type === "error") {
      throw new Error(result.errors[0]);
    }
    return result.response;
  }
);

const unsplashSlice = createSlice({
  name: "unsplash",
  initialState,
  reducers: {
    resetSearch: {
      reducer(state, action) {
        state.page = 1;
        state.total_pages = 1;
        state.search_terms = action.payload.search_terms;
        state.images = [];
      },
      prepare(search_terms) {
        return {
          payload: {
            search_terms: search_terms,
          },
        };
      },
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchImages.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchImages.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.total_pages = action.payload.total_pages;
      state.images = state.images.concat(action.payload.results);
      state.page++;
    });
    builder.addCase(fetchImages.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export const { resetSearch } = unsplashSlice.actions;

export const getAllImages = (state) => state.unsplash.images;
export const getSearchTerms = (state) => state.unsplash.search_terms;
export const getMorePagesAvailable = (state) =>
  state.unsplash.page <= state.unsplash.total_pages;
export const isUnsplashLoading = (state) => state.unsplash.status === "loading";
export const getUnsplashError = (state) => state.unsplash.error;

export default unsplashSlice.reducer;
