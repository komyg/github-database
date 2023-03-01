import { getGithubApi } from './api';

export async function getGithubData() {
  const api = await getGithubApi();

  const repositories = await api.getPublicGithubRepositories();

  const usersPerRepository = await api.getUsersPerRepository(
    'electron',
    'electron'
  );
  console.log(JSON.stringify(usersPerRepository, null, 2));
}
