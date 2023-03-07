import { getPostsFromPh } from './api/api';
import { Posts } from './api/types';
import { getDbHandler } from './db/data';
import { createProductHuntSchema } from './db/schema';
import { DbCollection, DbComments, DbPost, DbTopic } from './db/types';

export type ProductHuntAction = 'createSchema' | 'populateDatabase';

interface ExistingData<T> {
  data: T[];
  existingIds: Set<number>;
}

export async function executeAction(action: ProductHuntAction) {
  switch (action) {
    case 'createSchema':
      await createProductHuntSchema();
      break;
    case 'populateDatabase':
      await populateDatabase();
      break;
  }
}

async function populateDatabase() {
  const phPosts = await getPostsFromPh(2);
  console.log(phPosts.posts.totalCount);
  const dbPosts = extractDbPosts(phPosts);
  const comments = extractDbComments(phPosts);

  const dbCollections = extractDbCollections(phPosts, {
    data: [],
    existingIds: new Set(),
  });

  const dbTopics = extractDbTopics(phPosts, {
    data: [],
    existingIds: new Set(),
  });

  const db = getDbHandler();
  await db.insertCollections(dbCollections.data);
  await db.insertTopics(dbTopics.data);
  await db.insertPosts(dbPosts);
  await db.insertComments(comments);
  db.dispose();
}

function extractDbPosts(phPosts: Posts): DbPost[] {
  return phPosts.posts.edges.map((edge) => ({
    id: Number(edge.node.id),
    collection_id: Number(edge.node.collections.edges[0].node.id),
    topic_id: Number(edge.node.topics.edges[0].node.id),
    name: edge.node.name,
    comments_count: edge.node.commentsCount,
    featured_at: new Date(edge.node.featuredAt),
    created_at: new Date(edge.node.createdAt),
    tagline: edge.node.tagline,
    url: edge.node.url,
    website: edge.node.website,
    description: edge.node.description,
    votes_count: edge.node.votesCount,
    slug: edge.node.slug,
    reviews_count: edge.node.reviewsCount,
  }));
}

function extractDbComments(phPosts: Posts): DbComments[] {
  return phPosts.posts.edges.flatMap((edge) =>
    edge.node.comments.edges.map((comment) => ({
      id: Number(comment.node.id),
      post_id: Number(edge.node.id),
      body: comment.node.body,
      created_at: new Date(comment.node.createdAt),
      votes_count: comment.node.votesCount,
    }))
  );
}

function extractDbCollections(
  phPosts: Posts,
  currentCollections: ExistingData<DbCollection>
): ExistingData<DbCollection> {
  const newCollections: DbCollection[] = phPosts.posts.edges.map(
    (postEdge) => ({
      id: Number(postEdge.node.collections.edges[0].node.id),
      name: postEdge.node.collections.edges[0].node.name,
      created_at: new Date(postEdge.node.collections.edges[0].node.createdAt),
      description: postEdge.node.collections.edges[0].node.description,
      featured_at: new Date(postEdge.node.collections.edges[0].node.featuredAt),
      followers_count: postEdge.node.collections.edges[0].node.followersCount,
      url: postEdge.node.collections.edges[0].node.url,
    })
  );

  const filteredNewCollections = removeDuplicates(newCollections).filter(
    (col) => !currentCollections.existingIds.has(col.id)
  );

  return {
    data: currentCollections.data.concat(filteredNewCollections),
    existingIds: new Set([
      ...currentCollections.existingIds,
      ...filteredNewCollections.map((col) => col.id),
    ]),
  };
}

function extractDbTopics(
  phPosts: Posts,
  currentTopics: ExistingData<DbTopic>
): ExistingData<DbTopic> {
  const newTopics: DbTopic[] = phPosts.posts.edges.map((postEdge) => ({
    id: Number(postEdge.node.topics.edges[0].node.id),
    name: postEdge.node.topics.edges[0].node.name,
    created_at: new Date(postEdge.node.topics.edges[0].node.createdAt),
    description: postEdge.node.topics.edges[0].node.description,
    followers_count: postEdge.node.topics.edges[0].node.followersCount,
    posts_count: postEdge.node.topics.edges[0].node.postsCount,
  }));

  const filteredNewTopics = removeDuplicates(newTopics).filter(
    (topic) => !currentTopics.existingIds.has(topic.id)
  );

  return {
    data: currentTopics.data.concat(filteredNewTopics),
    existingIds: new Set([
      ...currentTopics.existingIds,
      ...filteredNewTopics.map((topic) => topic.id),
    ]),
  };
}

function removeDuplicates<T extends { id: number }>(arr: T[]): T[] {
  const seen = new Set<number>();

  return arr
    .map((item) => {
      if (seen.has(item.id)) {
        return null;
      } else {
        seen.add(item.id);
        return item;
      }
    })
    .filter((item) => item !== null) as T[];
}
