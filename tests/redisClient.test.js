import redisClient from '../utils/redis';

describe('redisClient Tests', () => {
  it('should connect to Redis', async () => {
    expect(redisClient.isAlive()).toBe(true);
  });

  it('should set and get a value', async () => {
    await redisClient.set('test_key', 'test_value', 10);
    const value = await redisClient.get('test_key');
    expect(value).toBe('test_value');
  });

  it('should handle expiration correctly', async () => {
    await redisClient.set('test_key_exp', 'test_value', 1);
    const valueBefore = await redisClient.get('test_key_exp');
    expect(valueBefore).toBe('test_value');

    await new Promise(resolve => setTimeout(resolve, 1500)); // wait for 1.5 seconds

    const valueAfter = await redisClient.get('test_key_exp');
    expect(valueAfter).toBe(null);
  });
});
