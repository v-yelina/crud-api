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