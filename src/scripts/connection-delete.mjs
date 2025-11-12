import { loadEnvConfig } from './utils/envLoader.mjs';
import process from 'process';

loadEnvConfig();

const apiKey = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
const connectionName = 'scalis-local';

async function run() {
  const resp = await fetch(`https://${BASE_URL}/api/v1/connections/${connectionName}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}` /* keep your API Key secure */,
    },
  });

  console.log(`${resp.status} ${resp.statusText}`);
  const contentType = resp.headers.get("content-type");
  if (contentType && contentType.includes('application/json')) {
    const json = await resp.json();
    console.log(json);
  } else {
    const text = await resp.text();
    console.log(text);  
  }
}

run();
