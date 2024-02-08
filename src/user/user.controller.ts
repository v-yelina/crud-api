import { IncomingMessage, ServerResponse } from "http";
import * as model from "./user.model";

export const getAllUsers = async (_req: IncomingMessage, res: ServerResponse) => {
  try {
    const persons = [await model.returnAllUsers()];

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(persons));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Internal Server Error: Please try again later.' }));
  }
};