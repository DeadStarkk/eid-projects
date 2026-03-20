/**
 * A simple in-memory store that mimics Redis behavior.
 * This can be easily swapped for a real Redis client (e.g., ioredis) in production.
 */
class Store {
  constructor() {
    this.data = new Map();
  }

  /**
   * Set a value in the store.
   * @param {string} key 
   * @param {any} value 
   */
  async set(key, value) {
    this.data.set(key, JSON.parse(JSON.stringify(value)));
    return 'OK';
  }

  /**
   * Get a value from the store.
   * @param {string} key 
   */
  async get(key) {
    const value = this.data.get(key);
    return value !== undefined ? JSON.parse(JSON.stringify(value)) : null;
  }

  /**
   * Delete a key from the store.
   * @param {string} key 
   */
  async del(key) {
    return this.data.delete(key);
  }

  /**
   * Atomic update of a value in the store.
   * @param {string} key 
   * @param {function} updateFn 
   */
  async update(key, updateFn) {
    const current = await this.get(key);
    const updated = updateFn(current);
    await this.set(key, updated);
    return updated;
  }

  /**
   * Clear all data from the store.
   */
  async clear() {
    this.data.clear();
  }

  /**
   * Get all keys in the store.
   */
  async keys() {
    return Array.from(this.data.keys());
  }
}

export const store = new Store();
