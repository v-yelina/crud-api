import * as bd from "../db"

export const returnAllUsers = () => {
  return new Promise((resolve, _reject) => {
    resolve(bd.bd);
  });
};