// Baseline & Load Testing programmatic execution using Autocannon
const autocannon = require('autocannon');
const http = require('http');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const args = process.argv.slice(2);
const targetUrl = args[0] || config.defaultUrl;
const isLocal = targetUrl === config.defaultUrl;

let server;

function startLocalServer() {
  return new Promise((resolve, reject) => {
    server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(__dirname, '../web', urlPath);
      
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      let contentType = 'text/html';
      if (ext === '.css') contentType = 'text/css';
      else if (ext === '.js') contentType = 'application/javascript';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.svg') contentType = 'image/svg+xml';

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });

    const port = parseInt(targetUrl.split(':').pop().split('/')[0]) || 8085;
    server.listen(port, (err) => {
      if (err) reject(err);
      else {
        console.log(`[+] Started local web server at ${targetUrl}`);
        resolve();
      }
    });
  });
}

async function run() {
  if (isLocal) {
    await startLocalServer();
  }

  console.log(`\n==================================================`);
  console.log(`RUNNING CIVICBIN BASELINE LOAD TEST`);
  console.log(`==================================================`);
  console.log(`Target URL        : ${targetUrl}`);
  console.log(`Concurrent Users  : ${config.connections} virtual users`);
  console.log(`Duration          : ${config.duration} seconds`);
  console.log(`Please wait (running stress test)...`);
  console.log(`==================================================\n`);

  const instance = autocannon({
    url: targetUrl,
    connections: config.connections,
    duration: config.duration,
    headers: config.headers
  }, (err, result) => {
    if (isLocal && server) {
      server.close();
      console.log(`[+] Local web server stopped.`);
    }

    if (err) {
      console.error(`[Error] Load testing failed:`, err);
      process.exit(1);
    }

    console.log(`\n==================================================`);
    console.log(`LOAD TESTING COMPLETE!`);
    console.log(`==================================================`);
    console.log(`Requests per second (RPS)`);
    console.log(`  Average: ${result.requests.average} req/sec`);
    console.log(`  Min:     ${result.requests.min} req/sec`);
    console.log(`  Max:     ${result.requests.max} req/sec`);
    console.log(`  Total:   ${result.requests.total} requests`);
    console.log(`\nResponse Time (Latency)`);
    console.log(`  Average: ${result.latency.average} ms`);
    console.log(`  Min:     ${result.latency.min} ms`);
    console.log(`  Max:     ${result.latency.max} ms`);
    console.log(`==================================================\n`);
  });

  // Track progress visually
  autocannon.track(instance, { renderProgressBar: true });
}

run().catch(err => {
  console.error(err);
  if (server) server.close();
  process.exit(1);
});
