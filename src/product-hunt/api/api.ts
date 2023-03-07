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

export async function getPostsFromPh(max: number, count = 0): Promise<Posts> {
  const query = `
  query Posts($cursor: String) {
    posts(order: VOTES, after: $cursor) {
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

  if (count >= max) {
    console.log('Data fetch number:', count);
    const res = await api<Posts>(query, { cursor: '' });
    return res;
  }

  const previousPage = await getPostsFromPh(max, count + 1);
  console.log('Data fetch number:', count);

  // Avoid trottling
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const nextPage = await api<Posts>(query, {
    cursor: previousPage.posts.pageInfo.endCursor,
  });

  nextPage.posts.edges = nextPage.posts.edges.concat(previousPage.posts.edges);
  nextPage.posts.totalCount =
    previousPage.posts.totalCount + nextPage.posts.totalCount;
  return nextPage;
}
