const https = require('https');

// First test: check what get_data returns (users section)
const options = {
  hostname: '157.10.98.26',
  port: 443,
  path: '/galaxy_api/get_data.php?api_key=galaxy_it_repair_secret_key_2026',
  method: 'GET',
  headers: {
    'Host': 'etechworld.in'
  },
  servername: 'etechworld.in',
  rejectUnauthorized: false
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Users in data.json:');
      if (data.users) {
        data.users.forEach(u => {
          console.log(`  - Email: ${u.email}, Name: ${u.name}, HasPassword: ${!!u.password}, Role: ${u.role}`);
        });
      } else {
        console.log('  No users field found!');
        console.log('Keys:', Object.keys(data));
      }
    } catch(e) {
      console.log('Raw body (first 500 chars):', body.substring(0, 500));
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});

req.end();
