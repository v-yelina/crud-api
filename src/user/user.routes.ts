import { IncomingMessage, ServerResponse } from 'http';
import * as controller from './user.controller';

export const routes = (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;
  if (req.url) {
    if (method === 'GET' && url) {
      let userId = url.split('/')[3];

      switch (url) {
        case '/api/users':
        case '/api/users/':
          controller.getAllUsers(req, res);
          break;
        case `/api/users/${userId}`:
          controller.getUserById(req, res, userId);
          break
        default:
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            message: "This page doesn't exist"
          }));
      }

    }
    else if (method === 'POST' && url === '/api/users') {
      controller.postNewUser(req, res);
    }
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: "This page doesn't exist"
      }));
    }
  }
}
