import type { Knex } from 'knex';
import knex from 'knex';

const CLIENT = 'pg';

export function getKnex(): Knex {
  return knex({
    client: CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
    },
  });
}
