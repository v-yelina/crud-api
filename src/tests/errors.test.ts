import * as userController from '../user/user.controller';
import { IncomingMessage, ServerResponse } from 'http';
import { User } from '../types';
import * as userModel from '../user/user.model';

import { v4 as uuidv4 } from 'uuid';
let mockUserData: User = { username: 'Test User', age: 25, hobbies: ['Reading', 'Gaming'] };
let userId = uuidv4();
let users: User[] = [];


jest.mock('../user/user.model', () => ({
  returnAllUsers: jest.fn(() => Promise.resolve(users)),
  createNewUser: jest.fn((userData: Omit<User, 'id'>) => Promise.resolve({ id: userId, ...userData })),
  findUser: jest.fn((id: string) => Promise.resolve({ id, ...mockUserData })),
  updateUser: jest.fn((userData: User) => Promise.resolve({ id: userId, ...userData })),
  deleteUser: jest.fn((userId: string) => Promise.resolve({ id: userId, ...mockUserData }))
}));

const mockedUserModel = userModel as jest.Mocked<typeof userModel>;

describe('Test error handling', () => {
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    mockResponse = {
      writeHead: jest.fn(),
      end: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('1. Update user with not all information provided', async () => {
    mockedUserModel.findUser.mockResolvedValueOnce({ id: userId, ...mockUserData });

    const mockRequest: Partial<IncomingMessage> = {
      on: jest.fn().mockImplementation(function (this: any, event, callback) {
        if (event === 'data') {
          callback.call(this, JSON.stringify({ id: userId, username: 'Updated User', age: 30 }));
        }
        if (event === 'end') {
          callback.call(this);
        }
      })
    };

    await userController.putUserById(mockRequest as IncomingMessage, mockResponse as ServerResponse, userId);

    expect(mockResponse.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
    expect(mockResponse.end).toHaveBeenCalled();

    expect(mockedUserModel.updateUser).not.toHaveBeenCalled();
  });

  test('2. Create new user with not all information provided', async () => {
    const mockRequest: Partial<IncomingMessage> = {
      on: jest.fn().mockImplementation(function (this: any, event, callback) {
        if (event === 'data') {
          callback.call(this, JSON.stringify({ username: "User1" }));
        }
        if (event === 'end') {
          callback.call(this);
        }
      })
    };

    await userController.postNewUser(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(mockResponse.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' });
    expect(mockResponse.end).toHaveBeenCalled();

    expect(mockedUserModel.createNewUser).not.toHaveBeenCalled();
  });

  test('3. Get user with non-existent ID', async () => {

    mockedUserModel.findUser.mockResolvedValueOnce(undefined);

    const mockRequest: Partial<IncomingMessage> = {
      url: `/api/users/${userId}`
    };

    await userController.getUserById(mockRequest as IncomingMessage, mockResponse as ServerResponse, userId);

    expect(mockResponse.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
    expect(mockResponse.end).toHaveBeenCalled();
  });

  test('4. Update user with non-existent ID', async () => {
    mockedUserModel.findUser.mockResolvedValueOnce(undefined);

    const mockRequest: Partial<IncomingMessage> = {
      on: jest.fn().mockImplementation(function (this: any, event, callback) {
        if (event === 'data') {
          callback.call(this, JSON.stringify({ id: userId, username: 'Updated User', age: 30, hobbies: ['Music', 'Sports'] }));
        }
        if (event === 'end') {
          callback.call(this);
        }
      })
    };

    await userController.putUserById(mockRequest as IncomingMessage, mockResponse as ServerResponse, userId);

    expect(mockResponse.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
    expect(mockResponse.end).toHaveBeenCalled();

    expect(mockedUserModel.updateUser).not.toHaveBeenCalled();
  });

  test('5. Delete user with non-existent ID', async () => {
    mockedUserModel.findUser.mockResolvedValueOnce(undefined);

    await userController.deleteUserById({} as IncomingMessage, mockResponse as ServerResponse, userId);

    expect(mockResponse.writeHead).toHaveBeenCalledWith(404, { 'Content-Type': 'application/json' });
    expect(mockResponse.end).toHaveBeenCalled();

    expect(mockedUserModel.deleteUser).not.toHaveBeenCalled();
  });

});
