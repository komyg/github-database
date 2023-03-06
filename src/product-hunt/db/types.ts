export interface DbCollection {
  id: number;
  name: string;
  create_at: Date;
  description: string;
  featured_at: Date;
  followers_count: number;
  url: string;
}

export interface DbPost {
  id: number;
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
