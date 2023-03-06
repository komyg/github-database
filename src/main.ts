import * as dotenv from 'dotenv';
dotenv.config();

import { executeAction } from './product-hunt/core';

async function main() {
  await executeAction('createSchema');
  await executeAction('populateDatabase');
}

main();
