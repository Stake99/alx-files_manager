import request from 'supertest';
import app from '../app';

describe('API Endpoints Tests', () => {
  let token = '';

  beforeAll(async () => {
    // Simulate user login to get a token
    const response = await request(app)
      .get('/connect')
      .set('Authorization', 'Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=');
    token = response.body.token;
  });

  test('GET /status', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('redis');
    expect(res.body).toHaveProperty('db');
  });

  test('GET /stats', async () => {
    const res = await request(app).get('/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('files');
  });

  test('POST /users', async () => {
    const res = await request(app).post('/users').send({
      email: 'test@example.com',
      password: 'password',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');
  });

  test('GET /connect', async () => {
    const res = await request(app)
      .get('/connect')
      .set('Authorization', 'Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  test('GET /disconnect', async () => {
    const res = await request(app).get('/disconnect').set('X-Token', token);
    expect(res.statusCode).toEqual(204);
  });

  test('GET /users/me', async () => {
    const res = await request(app).get('/users/me').set('X-Token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email');
  });

  test('POST /files', async () => {
    const res = await request(app)
      .post('/files')
      .set('X-Token', token)
      .attach('file', 'path/to/file.jpg'); // Example of file upload
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  test('GET /files/:id', async () => {
    const fileId = 'someFileId';
    const res = await request(app).get(`/files/${fileId}`).set('X-Token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', fileId);
  });

  test('GET /files (pagination)', async () => {
    const res = await request(app).get('/files?page=0').set('X-Token', token);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /files/:id/publish', async () => {
    const fileId = 'someFileId';
    const res = await request(app).put(`/files/${fileId}/publish`).set('X-Token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('isPublic', true);
  });

  test('PUT /files/:id/unpublish', async () => {
    const fileId = 'someFileId';
    const res = await request(app).put(`/files/${fileId}/unpublish`).set('X-Token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('isPublic', false);
  });

  test('GET /files/:id/data', async () => {
    const fileId = 'someFileId';
    const res = await request(app).get(`/files/${fileId}/data`).set('X-Token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/image|text|application/);
  });
});
