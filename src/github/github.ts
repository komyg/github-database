import { Octokit } from 'octokit';

export async function authenticate() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  return octokit;
}

export async function getGithubData() {
  const octokit = await authenticate();

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  console.log('Hello, %s', login);
}
