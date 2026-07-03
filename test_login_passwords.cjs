const https = require('https');

async function testLogin(email, password) {
  return new Promise((resolve) => {
    const options = {
      hostname: '157.10.98.26',
      port: 443,
      path: '/galaxy_api/login.php?api_key=galaxy_it_repair_secret_key_2026',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Host': 'etechworld.in'
      },
      servername: 'etechworld.in',
      rejectUnauthorized: false
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`[${res.statusCode}] ${email} / ${password} → ${body.trim()}`);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('Error:', e.message);
      resolve();
    });

    req.write(JSON.stringify({ email, password }));
    req.end();
  });
}

async function main() {
  console.log('Testing login combinations...\n');
  await testLogin('amitanurup@gmail.com', 'Amit@1990');
  await testLogin('amitanurup@gmail.com', 'Amit@12345');
  await testLogin('gccbhubaneswar@gmail.com', 'Admin@12345');
}

main();
