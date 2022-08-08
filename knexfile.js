// Update with your config settings.
const { join } = require('path');
const config = require('config');

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');

module.exports = {

  development: {
    client: DATABASE_CLIENT,
    connection: {
      host: "192.168.0.245",
      port: 3306,
      user: "Admin",
      password: "Kaas1212",
      database: "webservices",
    },
    migrations: {
      tableName: 'knex_meta',
      directory: join('src', 'data', 'migrations'),
    },
  },

  production: {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
