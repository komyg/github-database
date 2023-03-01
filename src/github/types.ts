export interface Owner {
  id: string;
  url: string;
  login: string;
}

export interface Repository {
  id: string;
  name: string;
  owner: Owner;
  url: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  forkCount: number;
  stargazerCount: number;
}

export interface RepositoryEdge {
  cursor: string;
  node: Repository;
}

export interface Repositories {
  search: {
    edges: RepositoryEdge[];
  };
}

export interface User {
  id: string;
  name: string;
  websiteUrl: string;
  url: string;
  login: string;
  bio: string;
}

export interface UserEdge {
  cursor: string;
  node: User;
}

export interface UsersPerRepository {
  repository: {
    mentionableUsers: {
      edges: UserEdge[];
    };
  };
}
