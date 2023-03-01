import { Octokit } from 'octokit';

async function authenticate() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  return octokit;
}

function getPublicGithubRepositories(octokit: Octokit) {
  const gql = octokit.graphql; // Must do this to preserve syntax highlighting for some reason.

  return gql(`
    query Repositories {
      search(query: "stars:>0", type: REPOSITORY, first: 10) {
        repositoryCount
        edges {
          cursor
          node {
            ... on Repository {
              id
              name
              owner {
                id
                url
                login
              }
              url
              description
              createdAt
              updatedAt
              forkCount
              stargazerCount
            }
          }
        }
      }
    }
  `);
}

function getUsersPerRepository(octokit: Octokit) {
  const gql = octokit.graphql; // Must do this to preserve syntax highlighting for some reason.

  return (name: string, owner: string) =>
    gql(
      `
    query UsersPerRepository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      mentionableUsers(first: 100) {
        edges {
          cursor
          node {
            id
            name
            websiteUrl
            url
            login
            bio
          }
        }
      }
    }
  }
  `,
      { name, owner }
    );
}

export async function getGithubData() {
  const octokit = await authenticate();

  const repositories = await getPublicGithubRepositories(octokit);
  // pretty print json result on console
  // console.log(JSON.stringify(repositories, null, 2));

  const usersPerRepository = await getUsersPerRepository(octokit)(
    'electron',
    'electron'
  );
  console.log(JSON.stringify(usersPerRepository, null, 2));
}
