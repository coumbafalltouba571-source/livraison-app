/* eslint-disable @typescript-eslint/no-require-imports */
const http = require('http');
const req = http.get('http://localhost:3000/commander/history', (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('STATUS:' + res.statusCode);
    console.log(body.slice(0, 1000));
  });
});
req.on('error', (err) => { console.error('ERROR:' + err.message); process.exit(1); });
