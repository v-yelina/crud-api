import { IncomingMessage, ServerResponse } from "http";
import * as check from "../utils/checkId";
import * as model from "./user.model";
import * as typeCheck from "../utils/checkType"
import { User } from "types";

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
      let newUserData = JSON.parse(chunks);
      const sampleData: Omit<User, 'id'> = { username: 'Sample name', age: 11, hobbies: ['String'] }
      if (typeCheck.isCorrectType(newUserData, sampleData)) {
        const newUser = await model.createNewUser(newUserData);
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(newUser));
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Something wrong with user data. Required fields: name, age, hobbies' }));
        return;
      }
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

export const putUserById = async (req: IncomingMessage, res: ServerResponse, id: string | undefined) => {
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
      let chunks = '';

      req.on("data", (chunk) => chunks += chunk);
      req.on("end", async () => {
        let newUserData = JSON.parse(chunks);
        let sampleUser: User = { id: "af4b4b2e-7a90-4b5a-bef5-0fd18ebbff6d", username: 'Sample name', age: 11, hobbies: ['String'] }

        if (typeCheck.isCorrectType(newUserData, sampleUser)) {
          const newUser = await model.updateUser({ id, ...newUserData })
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify((newUser)));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: 'Something wrong with user data. Required fields: name, age, hobbies' }));
          return;
        }
      })
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Internal Server Error: Please try again later.' }));
    }
  }
};

export const deleteUserById = async (_req: IncomingMessage, res: ServerResponse, id: string | undefined) => {
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
      await model.deleteUser(id);

      res.writeHead(204, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `User with id: ${id} was deleted` }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Internal Server Error: Please try again later.' }));
    }
  }
};