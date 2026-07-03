const https = require('https');

const options = {
  hostname: '157.10.98.26',
  port: 443,
  path: '/galaxy_api/login.php?api_key=galaxy_it_repair_secret_key_2026',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'Host': 'etechworld.in'
  },
  servername: 'etechworld.in', // SNI
  rejectUnauthorized: false
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Body:', body);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
  process.exit(1);
});

req.write(JSON.stringify({ email: "amitanurup@gmail.com", password: "Amit@1990" }));
req.end();
