// Unit tests for auth utilities
const { generateToken, verifyToken } = require('../../src/utils/auth');
const jwt = require('jsonwebtoken');

describe('Auth Utils', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const user = { _id: '123', username: 'testuser' };
      const token = generateToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify token can be decoded
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      expect(decoded._id).toBe(user._id);
      expect(decoded.username).toBe(user.username);
    });

    it('should include expiration time', () => {
      const user = { _id: '123', username: 'testuser' };
      const token = generateToken(user);

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      expect(decoded.exp).toBeDefined();
      expect(decoded.exp - decoded.iat).toBe(24 * 60 * 60); // 24 hours
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const user = { _id: '123', username: 'testuser' };
      const token = generateToken(user);

      const decoded = verifyToken(token);
      expect(decoded._id).toBe(user._id);
      expect(decoded.username).toBe(user.username);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });

    it('should throw error for expired token', () => {
      // Create expired token
      const expiredToken = jwt.sign(
        { _id: '123', username: 'testuser' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' }
      );

      expect(() => verifyToken(expiredToken)).toThrow();
    });
  });
});
