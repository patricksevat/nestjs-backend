import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserService,
        {
          // TODO figure out how this works
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
      controllers: [UserController],
      providers: [UserService],
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
    expect(Array.isArray(newUser.consents)).toBe(true);
  });
});
