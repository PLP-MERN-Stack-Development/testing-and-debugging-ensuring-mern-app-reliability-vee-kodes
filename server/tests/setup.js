// Jest setup file for server tests
require('dotenv').config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';

// Mock console methods to reduce noise during testing
global.console = {
  ...console,
  // Keep log for debugging but suppress others including error for cleaner test output
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};