import { describe, test, expect, beforeEach, vi } from "vitest";
import { createTestStore } from "../utils/testUtils";
import { mockAxios } from "../utils/apiTestUtils";
import { saveUser, fetchUsers } from "../../services/userService";
import { saveState, fetchStates } from "../../services/statesService";
import { mockUserResponse, mockStateResponse } from "../utils/testUtils";

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Service Integration Tests", () => {
  let store: ReturnType<typeof createTestStore>;
  let mockedAxios: ReturnType<typeof mockAxios>;

  beforeEach(() => {
    mockedAxios = mockAxios();
    store = createTestStore();
    vi.clearAllMocks();
  });

  describe("User Service Integration", () => {
    test("should integrate fetchUsers with Redux store", async () => {
      // Mock successful API response
      mockedAxios.get.mockResolvedValueOnce({ data: mockUserResponse });

      // Dispatch the action
      await store.dispatch(fetchUsers());

      // Verify API was called correctly
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/users/")
      );

      // Verify Redux state was updated
      const state = store.getState();
      expect(state.api.fetchUsers?.data).toEqual(mockUserResponse);
      expect(state.api.fetchUsers?.loading).toBe(false);
      expect(state.api.fetchUsers?.error).toBeNull();
    });

    test("should integrate saveUser with Redux store", async () => {
      const testUser = {
        firstName: "John",
        middleName: "Michael",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
      };

      const mockResponse = { message: "User saved successfully!" };
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      // Dispatch the action
      const result = await store.dispatch(saveUser(testUser));

      // Verify API was called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/user/"),
        testUser
      );

      // Verify Redux state was updated
      const state = store.getState();
      expect(state.api.saveUser?.data).toEqual(mockResponse);
      expect(state.api.saveUser?.loading).toBe(false);
      expect(state.api.saveUser?.error).toBeNull();

      // Verify return value (Redux thunk returns the actual data)
      expect(result).toEqual(mockResponse);
    });

    test("should handle API errors in fetchUsers", async () => {
      const errorMessage = "Network Error";
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      // Dispatch the action
      await store.dispatch(fetchUsers());

      // Verify Redux state has error
      const state = store.getState();
      expect(state.api.fetchUsers?.error).toBe(errorMessage);
      expect(state.api.fetchUsers?.loading).toBe(false);
      expect(state.api.fetchUsers?.data).toBeNull();
    });

    test("should handle API errors in saveUser", async () => {
      const testUser = {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
      };

      const errorMessage = "Validation Error";
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      // Dispatch the action and expect it to throw
      await expect(store.dispatch(saveUser(testUser))).rejects.toThrow(
        errorMessage
      );

      // Verify Redux state has error
      const state = store.getState();
      expect(state.api.saveUser?.error).toBe(errorMessage);
      expect(state.api.saveUser?.loading).toBe(false);
    });
  });

  describe("States Service Integration", () => {
    test("should integrate fetchStates with Redux store", async () => {
      // Mock successful API response
      mockedAxios.get.mockResolvedValueOnce({ data: mockStateResponse });

      // Dispatch the action
      await store.dispatch(fetchStates());

      // Verify API was called correctly
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/states/")
      );

      // Verify Redux state was updated
      const state = store.getState();
      expect(state.api.fetchStates?.data).toEqual(mockStateResponse);
      expect(state.api.fetchStates?.loading).toBe(false);
      expect(state.api.fetchStates?.error).toBeNull();
    });

    test("should integrate saveState with Redux store", async () => {
      const testState = {
        id: 0,
        name: "Test State",
        description: "Test Description",
        is_active: true,
        sort_order: 1,
        created_at: "2024-01-01",
        updated_at: null,
      };

      const mockResponse = { message: "State saved successfully!" };
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      // Dispatch the action
      const result = await store.dispatch(saveState(testState));

      // Verify API was called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/states/"),
        testState
      );

      // Verify Redux state was updated
      const state = store.getState();
      expect(state.api.saveState?.data).toEqual(mockResponse);
      expect(state.api.saveState?.loading).toBe(false);
      expect(state.api.saveState?.error).toBeNull();

      // Verify return value (Redux thunk returns the actual data)
      expect(result).toEqual(mockResponse);
    });

    test("should handle API errors in fetchStates", async () => {
      const errorMessage = "Server Error";
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      // Dispatch the action
      await store.dispatch(fetchStates());

      // Verify Redux state has error
      const state = store.getState();
      expect(state.api.fetchStates?.error).toBe(errorMessage);
      expect(state.api.fetchStates?.loading).toBe(false);
      expect(state.api.fetchStates?.data).toBeNull();
    });

    test("should handle API errors in saveState", async () => {
      const testState = {
        id: 0,
        name: "Test State",
        description: "Test Description",
        is_active: true,
        sort_order: 1,
        created_at: "2024-01-01",
        updated_at: null,
      };

      const errorMessage = "Validation Error";
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      // Dispatch the action and expect it to throw
      await expect(store.dispatch(saveState(testState))).rejects.toThrow(
        errorMessage
      );

      // Verify Redux state has error
      const state = store.getState();
      expect(state.api.saveState?.error).toBe(errorMessage);
      expect(state.api.saveState?.loading).toBe(false);
    });
  });

  describe("Cross-Service Integration", () => {
    test("should handle multiple concurrent API calls", async () => {
      // Mock responses for both services
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockUserResponse })
        .mockResolvedValueOnce({ data: mockStateResponse });

      // Dispatch both actions concurrently
      const [usersResult, statesResult] = await Promise.all([
        store.dispatch(fetchUsers()),
        store.dispatch(fetchStates()),
      ]);

      // Verify both API calls were made
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);

      // Verify both Redux states were updated
      const state = store.getState();
      expect(state.api.fetchUsers?.data).toEqual(mockUserResponse);
      expect(state.api.fetchStates?.data).toEqual(mockStateResponse);
      expect(state.api.fetchUsers?.loading).toBe(false);
      expect(state.api.fetchStates?.loading).toBe(false);
    });

    test("should maintain separate loading states for different services", async () => {
      // Mock delayed responses
      mockedAxios.get
        .mockImplementationOnce(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ data: mockUserResponse }), 100)
            )
        )
        .mockImplementationOnce(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ data: mockStateResponse }), 200)
            )
        );

      // Start both actions
      const usersPromise = store.dispatch(fetchUsers());
      const statesPromise = store.dispatch(fetchStates());

      // Check loading states immediately
      let state = store.getState();
      expect(state.api.fetchUsers?.loading).toBe(true);
      expect(state.api.fetchStates?.loading).toBe(true);

      // Wait for users to complete
      await usersPromise;
      state = store.getState();
      expect(state.api.fetchUsers?.loading).toBe(false);
      expect(state.api.fetchStates?.loading).toBe(true);

      // Wait for states to complete
      await statesPromise;
      state = store.getState();
      expect(state.api.fetchUsers?.loading).toBe(false);
      expect(state.api.fetchStates?.loading).toBe(false);
    });
  });
});
