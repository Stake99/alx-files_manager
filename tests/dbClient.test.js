import dbClient from '../utils/db';

describe('dbClient Tests', () => {
  it('should connect to MongoDB', async () => {
    expect(dbClient.isAlive()).toBe(true);
  });

  it('should return the number of documents in a collection', async () => {
    const count = await dbClient.nbUsers();
    expect(typeof count).toBe('number');
  });

  it('should return the correct count of files', async () => {
    const fileCount = await dbClient.nbFiles();
    expect(typeof fileCount).toBe('number');
  });
});
