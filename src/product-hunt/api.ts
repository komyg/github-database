import { graphql } from '../common/graphql';
import { Collections, Post } from './types';

const PRODUCT_HUNT_URL = 'https://api.producthunt.com/v2/api/graphql';

function api<T>(query: string, variables?: object) {
  return graphql<T>(
    PRODUCT_HUNT_URL,
    {
      Authorization: `Bearer ${process.env.PRODUCT_HUNT_TOKEN}`,
    },
    query,
    variables
  );
}

export function getCollections(): Promise<Collections> {
  const query = `
  query Collections {
    collections(order: FOLLOWERS_COUNT) {
      totalCount
      pageInfo {
        hasNextPage
        startCursor
        endCursor
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          name
          createdAt
          description
          featuredAt
          followersCount
          url
          posts {
            totalCount
            pageInfo {
              hasNextPage
              startCursor
              endCursor
              hasPreviousPage
            }
            edges {
              cursor
              node {
                id
              }
            }
          }
        }
      }
    }
  }

  `;

  return api(query);
}

export function getPost(id: string): Promise<Post> {
  const query = `
  query Post($id: ID) {
    post(id: $id) {
      id
      name
      commentsCount
      featuredAt
      createdAt
      tagline
      url
      website
      description
      votesCount
      topics {
        totalCount
        edges {
          node {
            id
          }
        }
      }
    }
  }
  `;

  return api(query, { id });
}
