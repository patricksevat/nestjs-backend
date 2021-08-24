import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { mockUserRepository } from './mocks/user-repository';

import { messages } from './constants/messages';
import { UserNotDeletedError, UserNotFoundError } from './constants/errors';
import { UserServiceMock } from './mocks/user-service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: UserServiceMock,
        },
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
    const createUserRequestBody: CreateUserDto = {
      email: 'test-email@provider.com ',
    };
    await controller.create(createUserRequestBody);

    expect(UserServiceMock.create).toHaveBeenCalledTimes(1);
    expect(UserServiceMock.create).toHaveBeenCalledWith(createUserRequestBody);
  });

  it('should get a user', async function () {
    await controller.findOne('my_uuid');
    expect(UserServiceMock.findOne).toHaveBeenCalledTimes(1);
    expect(UserServiceMock.findOne).toHaveBeenCalledWith('my_uuid');
  });

  it('should return a message if user could not be found', async function () {
    expect.assertions(1);
    try {
      const id = 'my_uuid';
      UserServiceMock.findOne.mockRejectedValueOnce(new UserNotFoundError(id));
      await controller.findOne(id);
    } catch (e) {
      expect(e instanceof UserNotFoundError).toBe(true);
    }
  });

  it('should return a message upon deleting a user', async function () {
    UserServiceMock.remove.mockReturnValue(true);
    const response = await controller.remove('my_uuid');
    expect(response.message).toBe(messages.userDeleted);
  });

  it('should return a message if user could not be deleted', async function () {
    UserServiceMock.remove.mockRejectedValueOnce(
      new UserNotDeletedError('my_uuid'),
    );
    expect.assertions(1);
    try {
      await controller.remove('my_uuid');
    } catch (e) {
      expect(e instanceof UserNotDeletedError).toBe(true);
    }
  });
});
