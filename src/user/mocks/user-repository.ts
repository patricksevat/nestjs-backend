import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';

class MockUserRepository {
  getOneMock = jest.fn();
  whereMock = jest.fn();

  findOne = jest.fn();
  createQueryBuilder = () => ({
    leftJoinAndSelect: () => ({
      where: this.whereMock.mockReturnValue({
        getOne: this.getOneMock,
      }),
    }),
  });
  update = jest.fn();
  save = jest.fn((user: User, userId = uuidv4()) => {
    return {
      ...user,
      id: userId,
    };
  });
}

export const mockUserRepository = new MockUserRepository();
