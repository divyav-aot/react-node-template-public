# Integration Tests

This directory contains integration tests for the React frontend application, testing how components interact with each other and with the backend APIs.

## Test Types

### 1. Frontend Integration Tests (`frontend-integration.test.tsx`)
Tests how multiple React components work together, including:
- Component interactions with Redux store
- Form submissions and state management
- Error handling across components
- Cross-component state management

### 2. API Integration Tests (`api-integration.test.ts`)
Tests the communication between the frontend and both backends:
- **Node.js Backend** (Users API) - Tests user CRUD operations
- **Python Backend** (States API) - Tests state CRUD operations
- Health checks for both backends
- Error handling and validation
- Cross-backend compatibility

### 3. Service Integration Tests (`service-integration.test.ts`)
Tests the service layer integration with Redux:
- Service functions with Redux store updates
- API call integration with state management
- Error handling in services
- Concurrent API calls

## Running Tests

### Run All Integration Tests
```bash
npm run test:integration
```

### Run Specific Integration Tests
```bash
# Frontend integration tests only
npm run test:frontend-integration

# API integration tests only (requires backends running)
npm run test:api-integration

# Service integration tests only
npm run test:service-integration
```

### Run All Tests (Unit + Integration)
```bash
npm run test:all
```

## Prerequisites for API Integration Tests

The API integration tests require both backends to be running:

### Start Backends
```bash
# From project root
cd deployment
docker-compose up -d postgres_db api python-backend
```

### Verify Backends are Running
- Node.js API: http://localhost:5000/health
- Python API: http://localhost:8300/health

## Test Structure

```
src/tests/
├── integration/
│   ├── frontend-integration.test.tsx  # Component integration tests
│   ├── api-integration.test.ts        # Real API integration tests
│   ├── service-integration.test.ts    # Service layer integration tests
│   └── README.md                      # This file
├── utils/
│   ├── testUtils.tsx                  # Test utilities and helpers
│   └── apiTestUtils.ts                # API testing utilities
└── [existing unit tests]
```

## Test Utilities

### `testUtils.tsx`
- `renderWithProviders()` - Renders components with Redux store
- `createTestStore()` - Creates test Redux store
- Mock data factories for users and states

### `apiTestUtils.ts`
- `testNodeApi` - Helper functions for Node.js API testing
- `testPythonApi` - Helper functions for Python API testing
- Environment setup for integration tests
- Mock utilities for unit tests

## Writing New Integration Tests

### Frontend Integration Test Example
```typescript
import { renderWithProviders } from '../utils/testUtils';
import { mockAxios } from '../utils/apiTestUtils';

test('should integrate form submission with Redux store', async () => {
  const { store } = renderWithProviders(<MyComponent />);
  
  // Test component interaction
  fireEvent.click(screen.getByRole('button'));
  
  // Verify Redux state
  const state = store.getState();
  expect(state.api.myAction?.data).toBeDefined();
});
```

### API Integration Test Example
```typescript
import { testNodeApi } from '../utils/apiTestUtils';

test('should create user via API', async () => {
  const userData = { firstName: 'John', lastName: 'Doe' };
  const response = await testNodeApi.createUser(userData);
  
  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
});
```

## Best Practices

1. **Mock vs Real APIs**: Use mocks for unit tests, real APIs for integration tests
2. **Test Isolation**: Each test should be independent and not rely on other tests
3. **Error Handling**: Test both success and error scenarios
4. **Cleanup**: Always clean up after tests to avoid side effects
5. **Descriptive Names**: Use clear, descriptive test names that explain what is being tested

## Troubleshooting

### Backend Connection Issues
- Ensure Docker containers are running: `docker-compose ps`
- Check backend health endpoints manually
- Verify port mappings in docker-compose.yaml

### Test Failures
- Check console output for detailed error messages
- Ensure all dependencies are installed: `npm install`
- Run tests individually to isolate issues

### Environment Issues
- Verify environment variables are set correctly
- Check that test utilities are properly imported
- Ensure Redux store is configured correctly for tests
