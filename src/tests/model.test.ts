import * as userModel from '../user/user.model';
import { User } from '../types';

describe('User Model Tests', () => {
  let userId: string;
  const userData = { username: 'Test User', age: 25, hobbies: ['Reading', 'Gaming'] };

  test('1. Get all users', async () => {
    const users = await userModel.returnAllUsers();
    expect(users).toEqual(userModel.db);
  });

  test('2. Create new user', async () => {
    const newUser = await userModel.createNewUser(userData) as User;
    expect(newUser).toHaveProperty('id');
    userId = newUser.id as string;
    expect(newUser.username).toBe(userData.username);
    expect(newUser.age).toBe(userData.age);
    expect(newUser.hobbies).toEqual(userData.hobbies);
  });

  test('3. Get user by ID', async () => {
    const user = await userModel.findUser(userId);
    expect(user).toEqual({ id: userId, ...userData });
  });

  test('4. Update user with given ID', async () => {
    const updatedUserData = { id: userId, username: 'Updated User', age: 30, hobbies: ['Music', 'Sports'] };
    await userModel.updateUser(updatedUserData);
    const updatedUser = await userModel.findUser(userId);
    expect(updatedUser).toEqual(updatedUserData);
  });

  test('5. Delete user with given ID', async () => {
    await userModel.deleteUser(userId);
    const deletedUser = await userModel.findUser(userId);
    expect(deletedUser).toBeUndefined();
  });
});
