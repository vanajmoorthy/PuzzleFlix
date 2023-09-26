// Set the environment variable to "LOCAL"
process.env.APP_ENVIRONMENT = 'LOCAL';
const mysql = require("mysql");

// Import the database connection pool
const pool = require('../queries');

// test the connection
describe('Test the database connection and select the user table', () => {
  test('it should connect to the database and return an array of users', (done) => {
    pool.query('SELECT * FROM users', (error, results) => {
      expect(error).toBeNull();
      expect(Array.isArray(results)).toBe(true);
      done();
    });
  });
});

describe('Test selecting a nonexistent table', () => {
  test('it should return an error', (done) => {
    pool.query('SELECT * FROM test', (error, results) => {
      expect(error).toBe(error);
      done();
    });
  });
});