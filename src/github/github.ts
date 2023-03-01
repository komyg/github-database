import { Octokit } from 'octokit';

async function authenticate() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  return octokit;
}

async function getPublicGithubRepositories(octokit: Octokit) {
  const gql = octokit.graphql; // Must do this to preserve syntax highlighting for some reason.

  const repositories = await gql(`
    {
      search(query: "stars:>0", type: REPOSITORY, first: 10) {
        repositoryCount
        edges {
          cursor
          node {
            ... on Repository {
              name
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

  return repositories;
}

export async function getGithubData() {
  const octokit = await authenticate();

  const repositories = await getPublicGithubRepositories(octokit);
  // pretty print json result on console
  console.log(JSON.stringify(repositories, null, 2));
}
