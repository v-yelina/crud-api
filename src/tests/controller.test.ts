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

describe('User Controller Tests', () => {
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    mockResponse = {
      writeHead: jest.fn(),
      end: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('1. Get all users', async () => {
    mockedUserModel.returnAllUsers.mockResolvedValueOnce(users);

    const mockRequest = {} as IncomingMessage;
    await userController.getAllUsers(mockRequest, mockResponse as ServerResponse);

    expect(mockResponse.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(mockResponse.end).toHaveBeenCalledWith(JSON.stringify(users));
  });

  test('2. Create new user', async () => {
    const mockRequest: Partial<IncomingMessage> = {
      on: jest.fn().mockImplementation(function (this: any, event, callback) {
        if (event === 'data') {
          callback.call(this, JSON.stringify({ ...mockUserData }));
        }
        if (event === 'end') {
          callback.call(this);
        }
      })
    };

    await userController.postNewUser(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(mockResponse.writeHead).toHaveBeenCalledWith(201, { 'Content-Type': 'application/json' });
    expect(mockResponse.end).toHaveBeenCalled();

    expect(mockedUserModel.createNewUser).toHaveBeenCalled();
  });

  test('3. Get user by ID', async () => {

    mockedUserModel.findUser.mockResolvedValueOnce({ id: userId, ...mockUserData });

    const mockRequest: Partial<IncomingMessage> = {
      url: `/api/users/${userId}`
    };

    await userController.getUserById(mockRequest as IncomingMessage, mockResponse as ServerResponse, userId);

    expect(mockResponse.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(mockResponse.end).toHaveBeenCalledWith(JSON.stringify({ id: userId, ...mockUserData }));
  });

  test('4. Update user with given ID', async () => {
    mockedUserModel.findUser.mockResolvedValueOnce({ id: userId, ...mockUserData });

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

    expect(mockResponse.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(mockResponse.end).toHaveBeenCalled();

    expect(mockedUserModel.updateUser).toHaveBeenCalled();
  });

  test('5. Delete user with given ID', async () => {
    mockedUserModel.findUser.mockResolvedValueOnce({ id: userId, ...mockUserData });

    await userController.deleteUserById({} as IncomingMessage, mockResponse as ServerResponse, userId);

    expect(mockResponse.writeHead).toHaveBeenCalledWith(204, { 'Content-Type': 'application/json' });
    expect(mockResponse.end).toHaveBeenCalled();

    expect(mockedUserModel.deleteUser).toHaveBeenCalled();
  });

});
