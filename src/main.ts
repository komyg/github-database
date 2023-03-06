import * as dotenv from 'dotenv';

import { getCollections, getPost } from './product-hunt/api';
dotenv.config();

async function main() {
  const result = await getCollections();
  console.log(result);

  const postID = result.collections.edges[0].node.posts.edges[0].node.id;
  const post = await getPost(postID);
  console.log(post);
}

main();
