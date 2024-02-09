import { IncomingMessage, ServerResponse } from 'http';
import * as controller from './user.controller';

export const routes = (req: IncomingMessage, res: ServerResponse) => {
  const { method } = req;
  if (req.url) {
    let userId = req.url.split('/')[3];

    if (method === 'GET') {

      switch (req.url) {
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
    else if (method === 'POST' && (req.url === '/api/users' || req.url === '/api/users/')) {
      controller.postNewUser(req, res);
    }
    else if (method === 'PUT' && req.url === `/api/users/${userId}`) {
      controller.putUserById(req, res, userId);
    }
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: "This page doesn't exist"
      }));
    }
  }
}
