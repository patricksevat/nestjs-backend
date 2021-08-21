import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';

export const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn((user: User, userId = uuidv4()) => {
    return {
      ...user,
      id: userId,
    };
  }),
};
