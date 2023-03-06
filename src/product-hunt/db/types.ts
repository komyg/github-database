export interface DbCollection {
  id: number;
  name: string;
  created_at: Date;
  description: string;
  featured_at: Date;
  followers_count: number;
  url: string;
}

export interface DbPost {
  id: number;
  collection_id: number;
  topic_id: number;
  name: string;
  comments_count: number;
  featured_at: Date;
  created_at: Date;
  tagline: string;
  url: string;
  website: string;
  description: string;
  votes_count: number;
  slug: string;
  reviews_count: number;
}

export interface DbTopic {
  id: number;
  name: string;
  created_at: Date;
  description: string;
  followers_count: number;
  posts_count: number;
}

export interface DbComments {
  id: number;
  post_id: number;
  body: string;
  created_at: Date;
  votes_count: number;
}
