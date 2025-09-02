import { describe, test, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, createTestStore, mockUserResponse, createTestUser } from '../utils/testUtils';
import { mockAxios } from '../utils/apiTestUtils';
import Users from '../../pages/Users';
import States from '../../pages/States';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Frontend Integration Tests', () => {
  let mockedAxios: ReturnType<typeof mockAxios>;

  beforeEach(() => {
    mockedAxios = mockAxios();
    vi.clearAllMocks();
  });

  describe('Users Page Integration', () => {
    test('should integrate form submission with Redux store and API call', async () => {
      // Mock successful API response
      mockedAxios.get.mockResolvedValueOnce({ data: mockUserResponse });
      mockedAxios.post.mockResolvedValueOnce({ data: { message: 'User saved successfully!' } });

      const { store } = renderWithProviders(<Users />);

      // Wait for initial data load
      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('/users/')
        );
      }, { timeout: 5000 });

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' },
      });
      fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
        target: { value: '1990-01-01' },
      });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Save User/i }));

      // Verify API call was made
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          expect.stringContaining('/user/'),
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-01-01',
          })
        );
      }, { timeout: 5000 });

      // Verify success message appears
      await waitFor(() => {
        expect(screen.getByText(/User saved successfully!/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Verify Redux store state
      const state = store.getState();
      expect(state.api.saveUser?.data).toEqual({ message: 'User saved successfully!' });
    });

    test('should handle API errors and update Redux store accordingly', async () => {
      // Mock API error
      mockedAxios.get.mockResolvedValueOnce({ data: mockUserResponse });
      mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

      const { store } = renderWithProviders(<Users />);

      // Wait for initial load
      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalled();
      }, { timeout: 5000 });

      // Fill and submit form
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' },
      });
      fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
        target: { value: '1990-01-01' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Save User/i }));

      // Verify error handling
      await waitFor(() => {
        expect(screen.getByText(/Error saving user./i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Verify Redux store has error state
      const state = store.getState();
      expect(state.api.saveUser?.error).toBe('Network Error');
    });

    test('should display users data from Redux store', async () => {
      // Mock successful API response
      mockedAxios.get.mockResolvedValueOnce({ data: mockUserResponse });

      renderWithProviders(<Users />);

      // Wait for data to load and display
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
        expect(screen.getByText('Smith')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Verify table structure
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
    });
  });

  describe('States Page Integration', () => {
    test('should integrate form submission with Redux store and Python API', async () => {
      // Mock successful API response
      mockedAxios.get.mockResolvedValueOnce({ data: [] });
      mockedAxios.post.mockResolvedValueOnce({ data: { message: 'State saved successfully!' } });

      const { store } = renderWithProviders(<States />);

      // Wait for initial data load
      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('/states/')
        );
      }, { timeout: 5000 });

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/State Name/i), {
        target: { value: 'Test State' },
      });
      fireEvent.change(screen.getByLabelText(/Description/i), {
        target: { value: 'Test Description' },
      });
      fireEvent.change(screen.getByLabelText(/sort_order/i), {
        target: { value: '1' },
      });
      fireEvent.change(screen.getByLabelText(/created_at/i), {
        target: { value: '2024-01-01' },
      });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Save State/i }));

      // Verify API call was made to Python backend
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          expect.stringContaining('/states/'),
          expect.objectContaining({
            name: 'Test State',
            description: 'Test Description',
            sort_order: '1',
            created_at: '2024-01-01',
          })
        );
      }, { timeout: 5000 });

      // Verify success message appears
      await waitFor(() => {
        expect(screen.getByText(/State saved successfully!/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Verify Redux store state
      const state = store.getState();
      expect(state.api.saveState?.data).toEqual({ message: 'State saved successfully!' });
    });
  });

  describe('Cross-Component Integration', () => {
    test('should maintain separate Redux state for different API endpoints', async () => {
      // Mock different responses for different endpoints
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockUserResponse }) // Users API
        .mockResolvedValueOnce({ data: [] }); // States API

      const { store } = renderWithProviders(
        <div>
          <Users />
          <States />
        </div>
      );

      // Wait for both components to load data
      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      }, { timeout: 5000 });

      // Verify separate Redux state for each API
      const state = store.getState();
      expect(state.api.fetchUsers?.data).toEqual(mockUserResponse);
      expect(state.api.fetchStates?.data).toEqual([]);
      expect(state.api.fetchUsers?.loading).toBe(false);
      expect(state.api.fetchStates?.loading).toBe(false);
    });
  });
});
