import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { mockUserRepository } from './mocks/user-repository';
import { mockUsers } from './mocks/user';
import { messages } from './constants/messages';

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

  it('should get a user', async function () {
    mockUserRepository.findOne.mockReturnValueOnce(mockUsers[0]);
    const foundUser = (await controller.findOne('my_uuid')) as User;
    expect(isUUID(foundUser.id)).toBe(true);
  });

  it('should return a message if user could not be found', async function () {
    const id = 'my_uuid';
    const response = (await controller.findOne(id)) as {
      message: string;
    };
    expect(response.message).toBe(messages.idNotFound(id));
  });

  it('should return a message upon deleting a user', async function () {
    mockUserRepository.update.mockReturnValueOnce({ affected: 1 });
    const response = await controller.remove('my_uuid');
    expect(response.message).toBe(messages.userDeleted);
  });

  it('should return a message if user could not be deleted', async function () {
    mockUserRepository.update.mockReturnValueOnce({ affected: 0 });
    const response = await controller.remove('my_uuid');
    expect(response.message).toBe(messages.userNotDeleted);
  });
});
