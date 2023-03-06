import * as dotenv from 'dotenv';
import { createProductHuntSchema } from './product-hunt/db/schema';

import { getCollections, getPost } from './product-hunt/api/api';
dotenv.config();

async function createSchema() {
  await createProductHuntSchema();
}

async function main() {
  await createSchema();
}

main();
