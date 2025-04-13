// 4. HTTP Server with Routes
// Build a Node.js HTTP server that:
// ● Serves "Home Page" on /
// ● Serves "About Page" on /about
// ● Serves 404 on any other route


import http from 'http';

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.end('Welcome to Home Page');
  } else if (req.url === '/about') {
    res.end('This is About Page');
  } else {
    res.end('404 Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
