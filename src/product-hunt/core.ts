import { getPostsFromPh } from './api/api';
import { Posts } from './api/types';
import { getDbHandler } from './db/data';
import { createProductHuntSchema } from './db/schema';
import { DbPost } from './db/types';

export type ProductHuntAction = 'createSchema' | 'populateDatabase';

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
  const phPosts = await getPostsFromPh();
  const dbPosts = getDbPosts(phPosts);

  const db = getDbHandler();
  await db.insertPosts(dbPosts);
  db.dispose();
}

function getDbPosts(phPosts: Posts): DbPost[] {
  return phPosts.posts.edges.map((edge) => ({
    id: Number(edge.node.id),
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
