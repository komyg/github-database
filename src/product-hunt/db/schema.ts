import { Knex } from 'knex';
import { getKnex } from '../../common/knex';

export async function createProductHuntSchema() {
  const knex = getKnex();

  await clean(knex);

  await createCollectionsTable(knex);
  await createTopicsTable(knex);
  await createPostsTable(knex);

  await knex.destroy();
}

async function clean(knex: Knex) {
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('topics');
  await knex.schema.dropTableIfExists('collections');
}

async function createCollectionsTable(knex: Knex) {
  await knex.schema.createTable('collections', (table) => {
    table.integer('id').notNullable().primary();
    table.string('name').notNullable();
    table.dateTime('created_at');
    table.string('description');
    table.dateTime('featured_at');
    table.integer('followers_count');
    table.string('url');
  });
}

async function createTopicsTable(knex: Knex) {
  await knex.schema.createTable('topics', (table) => {
    table.integer('id').notNullable().primary();
    table.string('name').notNullable();
    table.dateTime('created_at');
    table.string('description');
    table.integer('followers_count');
    table.integer('posts_count');
  });
}

async function createPostsTable(knex: Knex) {
  await knex.schema.createTable('posts', (table) => {
    table.integer('id').notNullable().primary();
    table.integer('collection_id');
    table.foreign('collection_id').references('collections.id');
    table.integer('topic_id');
    table.foreign('topic_id').references('topics.id');
    table.string('name').notNullable();
    table.integer('comments_count');
    table.dateTime('featured_at');
    table.dateTime('created_at');
    table.string('tagline');
    table.string('url');
    table.string('website');
    table.string('description');
    table.integer('votes_count');
  });
}
