import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_HOST = process.env.API_HOST || "http://localhost:8081";

const client = axios.create({
  baseURL: API_HOST,
});

const initialState = {
  images: [],
  similarUsers: [],
  liked_ids: {},
  page: 1,
  total_pages: 1,
  userId: 0,
  profileUser: {},
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const defaultPageSize = 20;

export const fetchImages = createAsyncThunk(
  "pixlikes/fetchImages",
  async (requestData, { getState }) => {
    const state = getState().pixlikes;
    const { userId } = requestData;
    let page = userId === state.userId ? state.page : 1;
    page = requestData.page ? requestData.page : page;
    const limit = requestData.limit || defaultPageSize;
    const url = `likes?userId=${userId}&_page=${page}&_limit=${limit}&_sort=id&_order=desc`;
    const response = await client.get(url);
    return {
      images: response.data,
      total_pages: Math.ceil(Number(response.headers["x-total-count"]) / limit),
    };
  }
);

export const fetchAllLikes = createAsyncThunk(
  "pixlikes/fetchAllLikes",
  async (requestData) => {
    const { userId } = requestData;
    const url = `likes?userId=${userId}`;
    const response = await client.get(url);
    const liked_ids = response.data.reduce((accumulator, value) => {
      return { ...accumulator, [value.unsplash_id]: value.id };
    }, {});
    return {
      liked_ids: liked_ids,
    };
  }
);

export const addLike = createAsyncThunk(
  "pixlikes/addLike",
  async (requestData) => {
    const token = localStorage.getItem("token");
    let payload = { ...requestData.image };
    payload.unsplash_id = payload.id;
    payload.userId = requestData.userId;
    delete payload.id;
    const response = await client.post("likes", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const removeLike = createAsyncThunk(
  "pixlikes/removeLike",
  async (requestData, { getState }) => {
    const token = localStorage.getItem("token");
    const likeIds = getState().pixlikes.liked_ids;
    if (!(requestData.image_id in likeIds)) {
      throw new Error("Error while removing like");
    }
    const url = `likes/${likeIds[requestData.image_id]}`;
    const response = await client.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const fetchUsers = createAsyncThunk(
  "pixlikes/fetchUsers",
  async (requestData) => {
    const skipid = (requestData && requestData.id) || 0;
    const page = (requestData && requestData.page) || 1;
    const limit = (requestData && requestData.limit) || defaultPageSize;
    const url = `users?id_ne=${skipid}&_page=${page}&_limit=${limit}&_sort=id&_order=desc`;
    const response = await client.get(url);
    return response.data;
  }
);

export const getUserByID = createAsyncThunk(
  "pixlikes/getUserByID",
  async (requestData) => {
    const { userId } = requestData;
    const url = `users/${userId}`;
    const response = await client.get(url);
    return response.data;
  }
);

const pixlikesSlice = createSlice({
  name: "pixlikes",
  initialState,
  reducers: {
    removeAllImages: {
      reducer(state) {
        state.images = [];
      },
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchImages.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchImages.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userId = action.meta.arg.userId;
      state.total_pages = action.payload.total_pages;
      state.page = action.meta.arg.page ? action.meta.arg.page : state.page;
      state.images =
        state.page > 1
          ? state.images.concat(action.payload.images)
          : action.payload.images;
      state.page++;
    });
    builder.addCase(fetchImages.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(fetchAllLikes.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchAllLikes.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.liked_ids = action.payload.liked_ids;
    });
    builder.addCase(fetchAllLikes.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    });
    builder.addCase(addLike.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(addLike.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.liked_ids[action.payload.unsplash_id] = action.payload.id;
      state.images = state.images.concat(action.meta.arg.image);
    });
    builder.addCase(addLike.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    });
    builder.addCase(removeLike.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(removeLike.fulfilled, (state, action) => {
      state.status = "succeeded";
      delete state.liked_ids[action.meta.arg.image_id];
      state.images = state.images.filter(
        (e) => e.unsplash_id !== action.meta.arg.image_id
      );
    });
    builder.addCase(removeLike.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    });
    builder.addCase(fetchUsers.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.similarUsers = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    });
    builder.addCase(getUserByID.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getUserByID.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.profileUser = action.payload;
    });
    builder.addCase(getUserByID.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    });
  },
});

export const { removeAllImages } = pixlikesSlice.actions;
export const getAllImages = (state) => state.pixlikes.images;
export const getAllLikes = (state) => state.pixlikes.liked_ids;
export const getSimilarUsers = (state) => state.pixlikes.similarUsers;
export const getMorePagesAvailable = (state) =>
  state.pixlikes.page <= state.pixlikes.total_pages;
export const getProfileUser = (state) => state.pixlikes.profileUser;
export const isPixlikesLoading = (state) => state.pixlikes.status === "loading";
export const getPixlikesError = (state) => state.pixlikes.error;

export default pixlikesSlice.reducer;
