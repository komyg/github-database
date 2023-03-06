import { Knex } from 'knex';
import { getKnex } from '../../common/knex';
import { DbCollection, DbPost } from './types';

export function getDbHandler() {
  const knex = getKnex();

  return {
    insertCollections: (data: DbCollection[]) =>
      knex.batchInsert('collections', data),
    insertPosts: (data: DbPost[]) => knex.batchInsert('posts', data),
    dispose: () => knex.destroy(),
  };
}
