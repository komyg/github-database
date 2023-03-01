import * as dotenv from 'dotenv';
import { getGithubData } from './github/github';
dotenv.config();

async function main() {
  await getGithubData();
}

main();
