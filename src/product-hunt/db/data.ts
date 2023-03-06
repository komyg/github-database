import { getKnex } from '../../common/knex';
import { DbCollection, DbPost, DbTopic } from './types';

export function getDbHandler() {
  const knex = getKnex();

  return {
    insertCollections: (data: DbCollection[]) =>
      knex.batchInsert('collections', data),
    insertPosts: (data: DbPost[]) => knex.batchInsert('posts', data),
    insertTopics: (data: DbTopic[]) => knex.batchInsert('topics', data),
    dispose: () => knex.destroy(),
  };
}
