import axios from "axios";
import { vi } from "vitest";

// API Base URLs for testing
export const NODE_API_BASE_URL = "http://localhost:5000";
export const PYTHON_API_BASE_URL = "http://localhost:8300";

// Helper to wait for API to be ready
export const waitForApi = async (
  url: string,
  maxRetries = 10,
  delay = 1000
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await axios.get(`${url}/health`);
      return true;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
};

// Mock axios for unit tests
export const mockAxios = () => {
  const mockGet = vi.fn();
  const mockPost = vi.fn();
  const mockPut = vi.fn();
  const mockDelete = vi.fn();

  // Mock the axios methods
  vi.mocked(axios).get = mockGet;
  vi.mocked(axios).post = mockPost;
  vi.mocked(axios).put = mockPut;
  vi.mocked(axios).delete = mockDelete;

  return {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
  };
};

// Real API test helpers (for integration tests)
export const testNodeApi = {
  async getUsers() {
    return axios.get(`${NODE_API_BASE_URL}/users/`);
  },

  async createUser(userData: any) {
    return axios.post(`${NODE_API_BASE_URL}/user/`, userData);
  },

  async healthCheck() {
    return axios.get(`${NODE_API_BASE_URL}/health`);
  },
};

export const testPythonApi = {
  async getStates() {
    return axios.get(`${PYTHON_API_BASE_URL}/states/`);
  },

  async createState(stateData: any) {
    return axios.post(`${PYTHON_API_BASE_URL}/states/`, stateData);
  },

  async healthCheck() {
    return axios.get(`${PYTHON_API_BASE_URL}/health`);
  },
};

// Environment setup for integration tests
export const setupIntegrationTestEnv = () => {
  // Set environment variables for testing
  process.env.VITE_API_BASE_URL = NODE_API_BASE_URL;
  process.env.VITE_PYTHON_API_BASE_URL = PYTHON_API_BASE_URL;
};

// Cleanup after tests
export const cleanupIntegrationTestEnv = () => {
  delete process.env.VITE_API_BASE_URL;
  delete process.env.VITE_PYTHON_API_BASE_URL;
};
