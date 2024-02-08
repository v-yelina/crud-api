import http from 'http';
import process from 'process';
import dotenv from 'dotenv';
dotenv.config()

const PORT = process.env.PORT || 4000;
const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, Node.js Server!');
});

server.listen(PORT, () => {
  console.info(`Ready on port ${PORT}`);
});

