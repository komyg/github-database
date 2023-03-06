import { getKnex } from '../../common/knex';
import { DbCollection, DbComments, DbPost, DbTopic } from './types';

export function getDbHandler() {
  const knex = getKnex();

  return {
    insertCollections: (data: DbCollection[]) =>
      knex.batchInsert('collections', data),
    insertComments: (data: DbComments[]) => knex.batchInsert('comments', data),
    insertPosts: (data: DbPost[]) => knex.batchInsert('posts', data),
    insertTopics: (data: DbTopic[]) => knex.batchInsert('topics', data),
    dispose: () => knex.destroy(),
  };
}
