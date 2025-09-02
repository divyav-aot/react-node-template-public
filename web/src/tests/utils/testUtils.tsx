import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import apiReducer from "../../store/apiSlice";

// Create a test store with the same configuration as the real store
export const createTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      api: apiReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });
};

// Custom render function that includes Redux Provider
interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock API responses for testing
export const mockUserResponse = {
  users: [
    {
      firstName: "John",
      middleName: "Michael",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
    },
    {
      firstName: "Jane",
      middleName: "",
      lastName: "Smith",
      dateOfBirth: "1985-05-15",
    },
  ],
};

export const mockStateResponse = [
  {
    id: 1,
    name: "Active",
    description: "Active state",
    is_active: true,
    sort_order: 1,
    created_at: "2024-01-01",
    updated_at: null,
  },
  {
    id: 2,
    name: "Inactive",
    description: "Inactive state",
    is_active: false,
    sort_order: 2,
    created_at: "2024-01-02",
    updated_at: null,
  },
];

// Test data factories
export const createTestUser = (overrides = {}) => ({
  firstName: "Test",
  middleName: "User",
  lastName: "Name",
  dateOfBirth: "1990-01-01",
  ...overrides,
});

export const createTestState = (overrides = {}) => ({
  id: 0,
  name: "Test State",
  description: "Test Description",
  is_active: true,
  sort_order: 1,
  created_at: "2024-01-01",
  updated_at: null,
  ...overrides,
});
