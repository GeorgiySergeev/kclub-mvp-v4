const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:3000/api/v1/test/seed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-e2e-secret': 'e2e-test-secret-local',
    },
    body: JSON.stringify({ scenario: 'published-businesses' }),
  });
  const text = await res.text();
  console.log(res.status, text);
}

test();
