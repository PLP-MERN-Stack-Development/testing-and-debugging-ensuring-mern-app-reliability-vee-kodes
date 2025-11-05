// Unit tests for bug controller helper functions
const { createBug } = require('../../src/controllers/bugController');

// Mock the BugPost model methods
jest.mock('../../src/models/BugPost', () => ({
  create: jest.fn(),
}));

const BugPost = require('../../src/models/BugPost');

describe('Bug Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBug validation', () => {
    it('should validate required fields', async () => {
      const mockReq = {
        body: { title: 'Test', description: 'Desc' }, // missing priority
        user: { _id: 'user123' }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockNext = jest.fn();

      await createBug(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should create bug when all fields provided', async () => {
      const mockReq = {
        body: {
          title: 'Test Bug',
          description: 'Test Description',
          priority: 'high',
          category: 'frontend',
          status: 'open'
        },
        user: { _id: 'user123' }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockNext = jest.fn();

      const mockBug = { _id: 'bug123', title: 'Test Bug' };
      BugPost.create.mockResolvedValue(mockBug);

      await createBug(mockReq, mockRes, mockNext);

      expect(BugPost.create).toHaveBeenCalledWith({
        title: 'Test Bug',
        description: 'Test Description',
        priority: 'high',
        category: 'frontend',
        status: 'open',
        author: 'user123',
        slug: 'test-bug'
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockBug);
    });

    it('should handle database creation error', async () => {
      const mockReq = {
        body: {
          title: 'Test Bug',
          description: 'Test Description',
          priority: 'high',
          category: 'frontend',
          status: 'open'
        },
        user: { _id: 'user123' }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockNext = jest.fn();

      // Mock database error
      BugPost.create.mockRejectedValue(new Error('Database connection failed'));

      await createBug(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Database connection failed'
        })
      );
    });
  });
});
