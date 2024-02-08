import { IncomingMessage, ServerResponse } from 'http';
import * as controller from './user.controller';

export const routes = (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/api/users') {
    controller.getAllUsers(req, res);
  }
  else if (method === 'POST' && url === '/api/users') {
    controller.postNewUser(req, res);
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
}