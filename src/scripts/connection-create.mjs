import { loadEnvConfig } from './utils/envLoader.mjs';
import process from 'process';

loadEnvConfig();

const apiKey = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

/**
 * see db-specific examples @https://docs.embeddable.com/data/credentials
 */
const dbType = 'postgres'; // or bigquery, etc.
const connectionName = 'scalis-local';
const credentials = {
  database: '...',
  host: '...',
  user: '...',
  password: '...',
};

async function run() {
  const resp = await fetch(`https://${BASE_URL}/api/v1/connections`, {
    method: 'POST', // POST = CREATE
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}` /* keep your API Key secure */,
    },
    body: JSON.stringify({
      name: `${connectionName}`,
      type: dbType,
      credentials: credentials,
    }),
  });

  console.log(`${resp.status} ${resp.statusText}`);
  const json = await resp.json();
  console.log(json);
}

run();
