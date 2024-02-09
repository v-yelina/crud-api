import * as usedTypes from '../types';
import { v4 as uuidv4 } from 'uuid';

export let db: usedTypes.User[] = [{
  id: "2f64ca86-535e-44e4-a807-20cd3943eb2f",
  username: "Default User",
  age: 1,
  hobbies: []
}];

export const returnAllUsers = () => {
  return new Promise((resolve, _reject) => {
    resolve(db);
  });
};

export const createNewUser = (userData: Omit<usedTypes.User, 'id'>) => {
  return new Promise((resolve, _reject) => {
    const newUser: usedTypes.User = { id: uuidv4(), ...userData };
    db.push(newUser);
    resolve(newUser);
  });
}

export const findUser = (userID: string) => {
  return new Promise((resolve, _reject) => {
    const user: usedTypes.User | undefined = db.find(user => user.id == userID);
    resolve(user);
  });
}

export const updateUser = (userData: usedTypes.User) => {
  return new Promise((resolve, _reject) => {
    const user: usedTypes.User | undefined = db.find(user => user.id == userData.id);
    if (user) {
      let userIndex = db.indexOf(user);
      db[userIndex] = { ...userData };
    }
    resolve(userData);
  });
}

export const deleteUser = (userId: string) => {
  return new Promise((resolve, _reject) => {
    const user: usedTypes.User | undefined = db.find(user => user.id == userId);
    if (user) {
      db = db.filter((item) => item.id !== userId)
    }
    resolve(user);
  });
}