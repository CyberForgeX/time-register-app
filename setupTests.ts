import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { serverHandlers } from '../tests/mocks/serverHandlers';
import { configure } from 'axe-core';
import { toHaveNoViolations } from 'jest-axe';
import { setLogger } from 'react-query/core';
import { QueryClient } from 'react-query';

// Set up MSW server handlers
const server = setupServer(...serverHandlers);

// Configure axe-core for accessibility testing
const axe = configure({
  rules: {
    'color-contrast': { enabled: false },
  },
});

expect.extend(toHaveNoViolations);

// Set up a global error handler that throws an error for any uncaught errors
const globalErrorHandler = (error: any) => {
  throw new Error(error);
};

// Set up a mock logger for react-query
const mockLogger = jest.fn();

// Set up a react-query client with a mock logger
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => mockLogger(error),
    },
  },
});

// Set up environment variables
process.env.NEXT_PUBLIC_APP_NAME = 'Time Register App';
process.env.NEXT_PUBLIC_APP_VERSION = '1.0.0';
process.env.NEXT_PUBLIC_API_URL = process.env.API_BASE_URL || "http://localhost:3000";

// Set up global variables and functions
global.server = server;
global.serverHandlers = serverHandlers;
global.axe = axe;
global.mockLogger = mockLogger;
global.queryClient = queryClient;

// Set up Jest before all hook
beforeAll(async () => {
  // Start MSW server
  await server.listen();
});

// Set up Jest after all hook
afterAll(async () => {
  // Stop MSW server
  await server.close();
});

// Set up Jest before each hook
beforeEach(() => {
  // Clear MSW server handlers and reset request id counter
  server.resetHandlers();
  server.use(
    rest.get('/api/time-entries', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([]));
    })
  );

  // Set up global error handler
  jest.spyOn(console, 'error').mockImplementation(globalErrorHandler);

  // Set up react-query logger
  setLogger({
    log: mockLogger,
    warn: mockLogger,
    error: mockLogger,
  });
});

// Set up Jest after each hook
afterEach(() => {
  // Restore console error function
  jest.restoreAllMocks();

  // Clear react-query logger
  mockLogger.mockClear();
});