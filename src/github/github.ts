import { Octokit } from 'octokit';

async function authenticate() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  return octokit;
}

// Search for public repositories on Github
async function getGithubRepositories(octokit: Octokit) {
  const gql = octokit.graphql;
  const repositories = await gql(`
    query {
      search(query: "stars:>0", type: REPOSITORY, first: 100) {
        repositoryCount
        edges {
          node {
            ... on Repository {
              name
              url
              description
              stargazers {
                totalCount
              }
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

  const repositories = await getGithubRepositories(octokit);
  // pretty print json result on console
  console.log(JSON.stringify(repositories, null, 2));
}
