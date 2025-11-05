// posts.test.js - Integration tests for posts API endpoints

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const BugPost = require('../../src/models/BugPost');
const User = require('../../src/models/User');
const { generateToken } = require('../../src/utils/auth');

let mongoServer;
let token;
let userId;
let bugId;

// Setup in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test user
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  });
  userId = user._id;
  token = generateToken(user);

  // Create a test post (Create initial bug)
  const bug = await BugPost.create({
    title: 'Test Bug Post',
    description: 'This is a test bug post description',
    status: 'open',
    priority: 'high',
    author: userId,
    category: new mongoose.Types.ObjectId().toString(),
    slug: 'test-post',
  });
  bugId = bug._id;
}, 30000); // Increase timeout for MongoDB download

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clean up database between tests
afterEach(async () => {
  // Keep the test user and bug post, but clean up any other created data (Clean up any bugs except initial test one)
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    if (collection.collectionName !== 'users' && collection.collectionName !== 'bugs') {
      await collection.deleteMany({});
    }
  }
});

describe('POST /api/bugs', () => {
  it('should create a new bug post when authenticated', async () => {
    const newBug = {
      title: 'New Test Bug Post',
      description: 'This is a new test bug post description',
      category: new mongoose.Types.ObjectId().toString(),
      status: 'open',
      priority: 'medium',
    };

    const res = await request(app)
      .post('/api/bugs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBug);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newBug.title);
    expect(res.body.description).toBe(newBug.description);
    expect(res.body.author).toBe(userId.toString());
  });

  it('should return 401 if not authenticated', async () => {
    const newBug = {
      title: 'Unauthorized Bug Post',
      description: 'This should not be created',
      category: new mongoose.Types.ObjectId().toString(),
    };

    const res = await request(app)
      .post('/api/bugs')
      .send(newBug);

    expect(res.status).toBe(401);
  });

  it('should return 400 if validation fails', async () => {
    const invalidBugPost = {
      // Missing bug title
      description: 'This bug post is missing a title',
      category: new mongoose.Types.ObjectId().toString(),
    };

    const res = await request(app)
      .post('/api/bugs')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBugPost);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});


describe('GET /api/bugs', () => {
  it('should return all bug posts', async () => {
    const res = await request(app).get('/api/bugs');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should filter bug posts by category', async () => {
    const categoryId = new mongoose.Types.ObjectId().toString();
    
    // Create a bug post with specific category
    await BugPost.create({
      title: 'Filtered Bug Post',
      description: 'This bug post should be filtered by category',
      author: userId,
      category: categoryId,
      slug: 'filtered-bug-post',
    });

    const res = await request(app)
      .get(`/api/bugs?category=${categoryId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].category).toBe(categoryId);
  });

  it('should filter bugs by priority', async () => {
    const res = await request(app).get('/api/bugs?priority=high');
    expect(res.status).toBe(200);
    expect(res.body[0].priority).toBe('high');
  });

  it('should paginate results', async () => {
    // Create multiple bug posts
    const bugs = [];
    for (let i = 0; i < 15; i++) {
      bugs.push({
        title: `Pagination Bug Post ${i}`,
        description: `Content for pagination test ${i}`,
        author: userId,
        category: new mongoose.Types.ObjectId().toString(),
        slug: `pagination-bug-post-${i}`,
      });
    }
    await BugPost.insertMany(bugs);

    const page1 = await request(app)
      .get('/api/bugs?page=1&limit=10');
    
    const page2 = await request(app)
      .get('/api/bugs?page=2&limit=10');

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);
    expect(page1.body.length).toBe(10);
    expect(page2.body.length).toBeGreaterThan(0);
    expect(page1.body[0]._id).not.toBe(page2.body[0]._id);
  });
});


describe('GET /api/bugs/:id', () => {
  it('should return a bug post by ID', async () => {
    const res = await request(app).get(`/api/bugs/${bugId}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(bugId.toString());
    expect(res.body.title).toBe('Test Bug Post');
  });

  it('should return 404 for non-existent bug post', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/bugs/${nonExistentId}`);

    expect(res.status).toBe(404);
  });
});


describe('PUT /api/bugs/:id', () => {
  it('should update a bug post when authenticated as author', async () => {
    const updates = {
      title: 'Updated Test Post',
      description: 'This bug content has been updated',
      status: 'resolved',
      priority: 'low'
    };

    const res = await request(app)
      .put(`/api/bugs/${bugId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updates.title);
    expect(res.body.status).toBe('resolved');
  });

  it('should return 401 if not authenticated', async () => {
    const updates = {
      title: 'Unauthorized Bug Update',
    };

    const res = await request(app)
      .put(`/api/bugs/${bugId}`)
      .send(updates);

    expect(res.status).toBe(401);
  });

  it('should return 403 if not the author', async () => {
    // Create another user
    const anotherUser = await User.create({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'password123',
    });
    const anotherToken = generateToken(anotherUser);

    const updates = {
      title: 'Forbidden Update',
    };

    const res = await request(app)
      .put(`/api/bugs/${bugId}`)
      .set('Authorization', `Bearer ${anotherToken}`)
      .send(updates);

    expect(res.status).toBe(403);
  });
});


describe('DELETE /api/bugs/:id', () => {
  it('should delete a bug post when authenticated as author', async () => {
    const res = await request(app)
      .delete(`/api/bugs/${bugId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    
    // Verify bug post is deleted
    const deletedBug = await BugPost.findById(bugId);
    expect(deletedBug).toBeNull();
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .delete(`/api/bugs/${bugId}`);

    expect(res.status).toBe(401);
  });
}); 