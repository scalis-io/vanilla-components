import { loadEnvConfig } from './utils/envLoader.mjs';
import process from 'process';

loadEnvConfig();

const apiKey = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
const environmentName = 'local';

async function run() {
    const resp = await fetch(`https://${BASE_URL}/api/v1/environments/${environmentName}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
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