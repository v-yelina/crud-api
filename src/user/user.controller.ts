import { User } from "db";
import { IncomingMessage, ServerResponse } from "http";
import * as check from "../utils/checkId";
import * as model from "./user.model";

export const getAllUsers = async (_req: IncomingMessage, res: ServerResponse) => {
  try {
    const users = await model.returnAllUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(users));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Internal Server Error: Please try again later.' }));
  }
};

export const postNewUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    let chunks = '';

    req.on("data", (chunk) => chunks += chunk);
    req.on("end", async () => {
      let newUserData: Omit<User, 'id'> = JSON.parse(chunks);
      const newUser = await model.createNewUser(newUserData);
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(newUser));
    })

  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Internal Server Error: Please try again later.' }));
  }
};

export const getUserById = async (_req: IncomingMessage, res: ServerResponse, id: string | undefined) => {
  if (id) {
    try {
      if (!check.checkUUID(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'User id is invalid' }));
        return;
      }
      const user = await model.findUser(id);
      if (user == undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User with such ID was not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Internal Server Error: Please try again later.' }));
    }
  }
};