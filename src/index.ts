import http from 'http';
import process from 'process';
import dotenv from 'dotenv';
import * as routes from './user/user.routes';
dotenv.config()

const PORT = process.env.PORT || 4000;
const server = http.createServer(routes.routes);

server.listen(PORT, () => {
  console.info(`Ready on port ${PORT}`);
});

