const { v4: uuidv4 } = require('uuid');
import * as db from "../db"

export const returnAllUsers = () => {
  return new Promise((resolve, _reject) => {
    resolve(db.db);
  });
};

export const createNewUser = (userData: Omit<db.User, 'id'>) => {
  return new Promise((resolve, _reject) => {
    const newUser: db.User = { id: uuidv4(), ...userData };
    db.db.push(newUser);
    resolve(newUser);
  });
}

export const findUser = (userID: string) => {
  return new Promise((resolve, _reject) => {
    const user: db.User | undefined = db.db.find(user => user.id == userID);
    resolve(user);
  });
}