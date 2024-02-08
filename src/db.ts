export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export const db: User[] = [{
  id: "2f64ca86-535e-44e4-a807-20cd3943eb2f",
  username: "Default User",
  age: 1,
  hobbies: []
}];