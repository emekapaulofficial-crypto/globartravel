import fs from 'node:fs/promises';

const file = 'data/opportunities.json';
const data = JSON.parse(await fs.readFile(file, 'utf8'));
const now = new Date().toISOString().slice(0, 10);

for (const item of data.items) {
  try {
    const response = await fetch(item.url, { redirect: 'follow', headers: { 'user-agent': 'GlobarTravelOpportunityBot/1.0' } });
    item.sourceStatus = response.ok ? 'reachable' : `http-${response.status}`;
  } catch (error) {
    item.sourceStatus = 'unreachable';
  }
  item.lastChecked = now;
}

data.lastUpdated = now;
await fs.writeFile(file, JSON.stringify(data, null, 2) + '\n');
console.log(`Checked ${data.items.length} approved opportunity sources on ${now}`);
