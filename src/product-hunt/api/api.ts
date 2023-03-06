import { graphql } from '../../common/graphql';
import { Collections, Posts } from './types';

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

export function getCollectionsFromApi(): Promise<Collections> {
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
        }
      }
    }
  }

  `;

  return api(query);
}

export function getPostsFromPh(): Promise<Posts> {
  const query = `
  query Posts {
    posts(order: VOTES) {
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
          commentsCount
          featuredAt
          createdAt
          tagline
          url
          website
          description
          votesCount
          slug
          reviewsCount
          comments(first: 5) {
            totalCount
            pageInfo {
              hasNextPage
              startCursor
              endCursor
              hasPreviousPage
            }
            edges {
              node {
                id
                createdAt
                body
                isVoted
                votesCount
              }
            }
          }
          collections(first: 1) {
            totalCount
            pageInfo {
              hasNextPage
              startCursor
              endCursor
              hasPreviousPage
            }
            edges {
              node {
                id
                name
                createdAt
                description
                featuredAt
                followersCount
                url
              }
            }
          }
          topics(first: 1) {
            totalCount
            pageInfo {
              hasNextPage
              startCursor
              endCursor
              hasPreviousPage
            }
            edges {
              node {
                id
                name
                createdAt
                description
                followersCount
                postsCount
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
