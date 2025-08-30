import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ApiState<T = any> {
  [key: string]: {
    data: T | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: ApiState = {};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    apiRequest(state, action: PayloadAction<string>) {
      state[action.payload] = { data: null, loading: true, error: null };
    },
    apiSuccess<T>(
      state: ApiState<T>,
      action: PayloadAction<{ key: string; data: T }>
    ) {
      const { key, data } = action.payload;
      state[key] = { data, loading: false, error: null };
    },
    apiFailure(state, action: PayloadAction<{ key: string; error: string }>) {
      const { key, error } = action.payload;
      state[key] = { data: null, loading: false, error };
    },
  },
});

export const { apiRequest, apiSuccess, apiFailure } = apiSlice.actions;
export default apiSlice.reducer;
