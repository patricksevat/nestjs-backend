import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn((user: User, userId = uuidv4()) => {
    return {
      ...user,
      id: userId,
    };
  }),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async function () {
    const newUser = await controller.create({
      email: 'test-email@provider.com ',
    });

    expect(newUser.email).toBeTruthy();
    expect(isUUID(newUser.id)).toBe(true);

    // Testing interceptors as a part of the request flow can only be done in e2e and partial integration test
    expect(newUser.consents).toBe(undefined);
  });
});
