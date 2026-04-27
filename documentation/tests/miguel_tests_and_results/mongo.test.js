// mongo.test.js
// Unit tests for Express API routes in server/mongo.js
// Uses supertest to fire HTTP requests against the app directly (no port needed)
// MongoDB collections are fully mocked — no live database required

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// ---------------------------------------------------------------------------
// Mock mongodb + dotenv before importing the app
// ---------------------------------------------------------------------------

const mockInsertOne  = vi.fn();
const mockFindOne    = vi.fn();
const mockUpdateOne  = vi.fn();
const mockCollection = vi.fn(() => ({
  insertOne: mockInsertOne,
  findOne:   mockFindOne,
  updateOne: mockUpdateOne,
}));
const mockDb      = vi.fn(() => ({ collection: mockCollection }));
const mockConnect = vi.fn();
const mockListen  = vi.fn((port, cb) => { if (cb) cb(); return { close: vi.fn() }; });

vi.mock('mongodb', () => ({
  MongoClient: vi.fn(function () {
    this.connect = mockConnect;
    this.db      = mockDb;
  }),
}));

vi.mock('dotenv', () => ({ default: { config: vi.fn() } }));

process.env.MONGODB_URL     = 'mongodb://localhost:27017';
process.env.AUTH0_AUDIENCE  = 'test-audience';
process.env.ISSUER_BASE_URL = 'https://test.auth0.com/';

// ---------------------------------------------------------------------------
// Stub JWT middleware
// ---------------------------------------------------------------------------

vi.mock('express-oauth2-jwt-bearer', () => ({
  auth: () => (req, _res, next) => {
    req.auth = { payload: { email: 'test@example.com' } };
    next();
  },
}));

// ---------------------------------------------------------------------------
// Mock express listen so the server never actually binds to a port.
// We grab the app instance from the mock instead.
// ---------------------------------------------------------------------------

let appInstance;
vi.mock('express', async (importOriginal) => {
  const actual = await importOriginal();
  const originalExpress = actual.default ?? actual;
  const wrapped = function (...args) {
    const app = originalExpress(...args);
    const originalListen = app.listen.bind(app);
    app.listen = (...listenArgs) => {
      // Don't actually listen — just call the callback if provided
      const cb = listenArgs.find(a => typeof a === 'function');
      if (cb) cb();
      return { close: vi.fn() };
    };
    appInstance = app;
    return app;
  };
  // copy static methods (json, urlencoded, static, Router, etc.)
  Object.assign(wrapped, originalExpress);
  return { default: wrapped };
});

// Import after all mocks are set up
await import('../../../server/mongo.js');

// ---------------------------------------------------------------------------

const EMAIL = 'test@example.com';

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// POST /api/user
// ---------------------------------------------------------------------------

describe('POST /api/user', () => {

  it('creates a new user and returns 201 when user does not exist', async () => {
    mockFindOne.mockResolvedValueOnce(null);
    mockInsertOne.mockResolvedValueOnce({ insertedId: 'abc123' });

    const res = await request(appInstance).post('/api/user');

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: EMAIL, recipes: [] });
    expect(mockInsertOne).toHaveBeenCalledWith({ email: EMAIL, recipes: [] });
  });

  it('returns 200 with created:false when user already exists', async () => {
    const existing = { _id: 'existing-id', email: EMAIL, recipes: [] };
    mockFindOne.mockResolvedValueOnce(existing);

    const res = await request(appInstance).post('/api/user');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ created: false, email: EMAIL });
    expect(mockInsertOne).not.toHaveBeenCalled();
  });

  it('returns 500 and logs the error when an exception is thrown', async () => {
    mockFindOne.mockRejectedValueOnce(new Error('DB exploded'));
    mockInsertOne.mockResolvedValue({});

    const res = await request(appInstance).post('/api/user');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });

});

// ---------------------------------------------------------------------------
// GET /api/user
// ---------------------------------------------------------------------------

describe('GET /api/user', () => {

  it('returns 200 with the user document when user is found', async () => {
    const user = { _id: 'id1', email: EMAIL, recipes: ['r1'] };
    mockFindOne.mockResolvedValueOnce(user);

    const res = await request(appInstance).get('/api/user');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: EMAIL });
  });

  it('returns 404 when user is not found', async () => {
    mockFindOne.mockResolvedValueOnce(null);

    const res = await request(appInstance).get('/api/user');

    expect(res.status).toBe(404);
  });

});

// ---------------------------------------------------------------------------
// PUT /api/recipe
// ---------------------------------------------------------------------------

describe('PUT /api/recipe', () => {

  it('returns 200 when recipe is added successfully', async () => {
    mockUpdateOne.mockResolvedValueOnce({ modifiedCount: 1 });

    const res = await request(appInstance)
      .put('/api/recipe')
      .send({ recipe: { id: 1, title: 'Pasta' } });

    expect(res.status).toBe(200);
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { email: EMAIL },
      { $push: { recipes: { id: 1, title: 'Pasta' } } }
    );
  });

  it('returns 400 when recipe field is missing from body', async () => {
    const res = await request(appInstance).put('/api/recipe').send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Recipe is required' });
    expect(mockUpdateOne).not.toHaveBeenCalled();
  });

  it('returns 404 when no document was modified (user not found)', async () => {
    mockUpdateOne.mockResolvedValueOnce({ modifiedCount: 0 });

    const res = await request(appInstance)
      .put('/api/recipe')
      .send({ recipe: { id: 99 } });

    expect(res.status).toBe(404);
  });

});

// ---------------------------------------------------------------------------
// DELETE /api/recipe
// ---------------------------------------------------------------------------

describe('DELETE /api/recipe', () => {

  it('returns 200 with success message when recipe is deleted', async () => {
    mockUpdateOne.mockResolvedValueOnce({ modifiedCount: 1 });

    const res = await request(appInstance)
      .delete('/api/recipe')
      .send({ recipeId: 42 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Recipe deleted successfully' });
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { email: EMAIL },
      { $pull: { recipes: { id: 42 } } }
    );
  });

  it('returns 400 when recipeId is missing from body', async () => {
    const res = await request(appInstance).delete('/api/recipe').send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'recipeId is required' });
    expect(mockUpdateOne).not.toHaveBeenCalled();
  });

  it('returns 404 when no document was modified (user not found)', async () => {
    mockUpdateOne.mockResolvedValueOnce({ modifiedCount: 0 });

    const res = await request(appInstance)
      .delete('/api/recipe')
      .send({ recipeId: 99 });

    expect(res.status).toBe(404);
  });

});

